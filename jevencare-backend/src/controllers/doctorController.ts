import { Request, Response } from "express";
import Doctor from "../models/Doctor";
import User from "../models/User";

// @desc    Get all doctors with filters
// @route   GET /api/doctors
// @access  Public
export const getDoctors = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      specialization,
      language,
      minFee,
      maxFee,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter query
    const query: any = { isAvailable: true };

    if (specialization) {
      query.specialization = { $regex: specialization, $options: "i" };
    }

    if (language) {
      query.languages = { $in: [language] };
    }

    if (minFee || maxFee) {
      query.consultationFee = {};
      if (minFee) query.consultationFee.$gte = Number(minFee);
      if (maxFee) query.consultationFee.$lte = Number(maxFee);
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get doctors with populated user data
    let doctors = await Doctor.find(query)
      .populate("userId", "name phone email profileImage language")
      .sort({ rating: -1, totalRatings: -1 })
      .skip(skip)
      .limit(limitNum);

    // Search by doctor name
    if (search) {
      const searchRegex = new RegExp(search as string, "i");
      doctors = doctors.filter((doctor: any) =>
        doctor.userId.name.match(searchRegex)
      );
    }

    const total = await Doctor.countDocuments(query);

    res.status(200).json({
      success: true,
      data: doctors,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error("Get doctors error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
      error: error.message,
    });
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id).populate(
      "userId",
      "name phone email profileImage language address"
    );

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error: any) {
    console.error("Get doctor by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch doctor",
      error: error.message,
    });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private (Doctor only)
export const updateDoctorProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const {
      specialization,
      experience,
      qualifications,
      languages,
      consultationFee,
      availableSlots,
      isAvailable,
    } = req.body;

    // Find doctor by userId
    const doctor = await Doctor.findOne({ userId });

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
      return;
    }

    // Update fields
    if (specialization) doctor.specialization = specialization;
    if (experience !== undefined) doctor.experience = experience;
    if (qualifications) doctor.qualifications = qualifications;
    if (languages) doctor.languages = languages;
    if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
    if (availableSlots) doctor.availableSlots = availableSlots;
    if (isAvailable !== undefined) doctor.isAvailable = isAvailable;

    await doctor.save();

    const updatedDoctor = await Doctor.findById(doctor._id).populate(
      "userId",
      "name phone email profileImage"
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedDoctor,
    });
  } catch (error: any) {
    console.error("Update doctor profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// @desc    Get all specializations
// @route   GET /api/doctors/specializations
// @access  Public
export const getSpecializations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const specializations = await Doctor.distinct("specialization");

    res.status(200).json({
      success: true,
      data: specializations.filter((s) => s), // Remove empty strings
    });
  } catch (error: any) {
    console.error("Get specializations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch specializations",
      error: error.message,
    });
  }
};

// @desc    Get doctor by user ID (for current logged-in doctor)
// @route   GET /api/doctors/my-profile
// @access  Private (Doctor only)
export const getMyDoctorProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;

    const doctor = await Doctor.findOne({ userId }).populate(
      "userId",
      "name phone email profileImage language address"
    );

    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error: any) {
    console.error("Get my doctor profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};
