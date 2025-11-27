import { Request, Response } from "express";
import Pharmacy from "../models/Pharmacy";
import Medicine from "../models/Medicine";
import User from "../models/User";

// @desc    Get all pharmacies
// @route   GET /api/pharmacies
// @access  Public
export const getPharmacies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { search, isOpen, page = 1, limit = 10 } = req.query;

    const query: any = {};

    if (isOpen !== undefined) {
      query.isOpen = isOpen === "true";
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    let pharmacies = await Pharmacy.find(query)
      .populate("userId", "name phone email")
      .skip(skip)
      .limit(limitNum);

    // Search by pharmacy name
    if (search) {
      const searchRegex = new RegExp(search as string, "i");
      pharmacies = pharmacies.filter((pharmacy) =>
        pharmacy.pharmacyName.match(searchRegex)
      );
    }

    // Get medicine count for each pharmacy
    const pharmaciesWithCount = await Promise.all(
      pharmacies.map(async (pharmacy) => {
        const medicineCount = await Medicine.countDocuments({
          pharmacyId: pharmacy.userId._id,
          isAvailable: true,
        });
        return {
          ...pharmacy.toObject(),
          medicineCount,
        };
      })
    );

    const total = await Pharmacy.countDocuments(query);

    res.status(200).json({
      success: true,
      data: pharmaciesWithCount,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error("Get pharmacies error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pharmacies",
      error: error.message,
    });
  }
};

// @desc    Get pharmacy by ID
// @route   GET /api/pharmacies/:id
// @access  Public
export const getPharmacyById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const pharmacy = await Pharmacy.findById(id).populate(
      "userId",
      "name phone email"
    );

    if (!pharmacy) {
      res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
      return;
    }

    // Get medicines for this pharmacy
    const medicines = await Medicine.find({
      pharmacyId: pharmacy.userId._id,
      isAvailable: true,
    }).limit(20);

    res.status(200).json({
      success: true,
      data: {
        ...pharmacy.toObject(),
        medicines,
      },
    });
  } catch (error: any) {
    console.error("Get pharmacy by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pharmacy",
      error: error.message,
    });
  }
};

// @desc    Update pharmacy profile
// @route   PUT /api/pharmacies/profile
// @access  Private (Pharmacy only)
export const updatePharmacyProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { pharmacyName, address, location, isOpen } = req.body;

    const pharmacy = await Pharmacy.findOne({ userId });

    if (!pharmacy) {
      res.status(404).json({
        success: false,
        message: "Pharmacy profile not found",
      });
      return;
    }

    // Update fields
    if (pharmacyName) pharmacy.pharmacyName = pharmacyName;
    if (address) pharmacy.address = address;
    if (location) pharmacy.location = location;
    if (isOpen !== undefined) pharmacy.isOpen = isOpen;

    await pharmacy.save();

    const updatedPharmacy = await Pharmacy.findById(pharmacy._id).populate(
      "userId",
      "name phone email"
    );

    res.status(200).json({
      success: true,
      message: "Pharmacy profile updated successfully",
      data: updatedPharmacy,
    });
  } catch (error: any) {
    console.error("Update pharmacy profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update pharmacy profile",
      error: error.message,
    });
  }
};

// @desc    Get my pharmacy profile
// @route   GET /api/pharmacies/my-profile
// @access  Private (Pharmacy only)
export const getMyPharmacyProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;

    const pharmacy = await Pharmacy.findOne({ userId }).populate(
      "userId",
      "name phone email address"
    );

    if (!pharmacy) {
      res.status(404).json({
        success: false,
        message: "Pharmacy profile not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: pharmacy,
    });
  } catch (error: any) {
    console.error("Get my pharmacy profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pharmacy profile",
      error: error.message,
    });
  }
};
