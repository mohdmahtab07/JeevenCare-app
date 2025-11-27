import { Request, Response } from "express";
import User from "../models/User";
import Patient from "../models/Patient";
import Doctor from "../models/Doctor";
import Pharmacy from "../models/Pharmacy";
import { sendOTP, verifyOTP } from "../services/twilioService";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtUtils";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, name, role, email, address } = req.body;

    // Validate required fields
    if (!phone || !name || !role) {
      res.status(400).json({
        success: false,
        message: "Please provide phone, name, and role",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User with this phone number already exists",
      });
      return;
    }

    // Create user
    const user = await User.create({
      phone,
      name,
      role,
      email,
      address,
      isVerified: false,
    });

    // Create role-specific profile
    if (role === "patient") {
      await Patient.create({ userId: user._id });
    } else if (role === "doctor") {
      await Doctor.create({
        userId: user._id,
        specialization: "General Physician", // Default, can be updated later
        experience: 0,
        consultationFee: 300,
        qualifications: [],
        languages: ["English", "Hindi"],
        availableSlots: [],
      });
    } else if (role === "pharmacy") {
      await Pharmacy.create({
        userId: user._id,
        pharmacyName: name,
        address: address || "",
        location: { latitude: 0, longitude: 0 },
      });
    }

    // Send OTP
    const otpSent = await sendOTP(phone);
    if (!otpSent) {
      res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again.",
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Registration successful! OTP sent to your phone.",
      data: {
        userId: user._id,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// @desc    Send OTP to existing user
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTPToUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { phone } = req.body;

    if (!phone) {
      res.status(400).json({
        success: false,
        message: "Please provide phone number",
      });
      return;
    }

    // Check if user exists
    const user = await User.findOne({ phone });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found. Please register first.",
      });
      return;
    }

    // Send OTP
    const otpSent = await sendOTP(phone);
    if (!otpSent) {
      res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully!",
    });
  } catch (error: any) {
    console.error("Send OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTPAndLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      res.status(400).json({
        success: false,
        message: "Please provide phone and OTP",
      });
      return;
    }

    // Find user
    const user = await User.findOne({ phone });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Verify OTP with Twilio
    const isValidOTP = await verifyOTP(phone, otp);
    if (!isValidOTP) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
      return;
    }

    // Mark user as verified
    user.isVerified = true;
    await user.save();

    // Generate tokens
    const payload = {
      userId: user._id.toString(),
      phone: user.phone,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful!",
      data: {
        user: {
          id: user._id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          email: user.email,
          isVerified: user.isVerified,
          profileImage: user.profileImage,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: error.message,
    });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
      return;
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
      return;
    }

    // Find user and validate refresh token
    const user = await User.findById(decoded.userId).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken) {
      res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
      return;
    }

    // Generate new access token
    const payload = {
      userId: user._id.toString(),
      phone: user.phone,
      role: user.role,
    };

    const newAccessToken = generateAccessToken(payload);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error: any) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      success: false,
      message: "Token refresh failed",
      error: error.message,
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;

    // Remove refresh token from database
    await User.findByIdAndUpdate(userId, { refreshToken: null });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error: any) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        profileImage: user.profileImage,
        address: user.address,
        language: user.language,
      },
    });
  } catch (error: any) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user data",
      error: error.message,
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { name, email, address, language } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (language) user.language = language;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        language: user.language,
      },
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};
