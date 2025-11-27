import { Request, Response } from "express";
import Medicine, { IMedicine } from "../models/Medicine";
import Pharmacy from "../models/Pharmacy";

// @desc    Get all medicines with filters
// @route   GET /api/medicines
// @access  Public
export const getMedicines = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      search,
      category,
      pharmacyId,
      minPrice,
      maxPrice,
      inStock,
      page = 1,
      limit = 20,
    } = req.query;

    // Build query
    const query: any = { isAvailable: true };

    // Search by name or generic name
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { genericName: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    if (pharmacyId) {
      query.pharmacyId = pharmacyId;
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Stock filter
    if (inStock === "true") {
      query.stock = { $gt: 0 };
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const medicines = await Medicine.find(query)
      .populate("pharmacyId", "name phone address location isOpen")
      .sort({ stock: -1, name: 1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Medicine.countDocuments(query);

    res.status(200).json({
      success: true,
      data: medicines,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error("Get medicines error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch medicines",
      error: error.message,
    });
  }
};

// @desc    Get single medicine
// @route   GET /api/medicines/:id
// @access  Public
export const getMedicineById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const medicine = await Medicine.findById(id).populate(
      "pharmacyId",
      "name phone address location isOpen"
    );

    if (!medicine) {
      res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: medicine,
    });
  } catch (error: any) {
    console.error("Get medicine by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch medicine",
      error: error.message,
    });
  }
};

// @desc    Add new medicine
// @route   POST /api/medicines
// @access  Private (Pharmacy only)
export const addMedicine = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pharmacyUserId = (req as any).user.userId;
    const {
      name,
      genericName,
      manufacturer,
      description,
      price,
      stock,
      category,
      requiresPrescription,
      expiryDate,
      imageUrl,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !genericName ||
      !manufacturer ||
      !description ||
      !price ||
      stock === undefined ||
      !category
    ) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
      return;
    }

    // Prepare medicine data
    const medicineData: Partial<IMedicine> = {
      pharmacyId: pharmacyUserId,
      name,
      genericName,
      manufacturer,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      requiresPrescription: requiresPrescription || false,
      isAvailable: true,
    };

    if (expiryDate) medicineData.expiryDate = new Date(expiryDate);
    if (imageUrl) medicineData.imageUrl = imageUrl;

    const medicine = await Medicine.create(medicineData);

    const populatedMedicine = await Medicine.findById(medicine._id).populate(
      "pharmacyId",
      "name phone"
    );

    res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      data: populatedMedicine,
    });
  } catch (error: any) {
    console.error("Add medicine error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add medicine",
      error: error.message,
    });
  }
};

// @desc    Update medicine
// @route   PUT /api/medicines/:id
// @access  Private (Pharmacy only)
export const updateMedicine = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const pharmacyUserId = (req as any).user.userId;
    const updateData = req.body;

    const medicine = await Medicine.findById(id);

    if (!medicine) {
      res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
      return;
    }

    // Check authorization
    if (medicine.pharmacyId.toString() !== pharmacyUserId) {
      res.status(403).json({
        success: false,
        message: "Not authorized to update this medicine",
      });
      return;
    }

    // Update medicine
    const updatedMedicine = await Medicine.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("pharmacyId", "name phone");

    res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data: updatedMedicine,
    });
  } catch (error: any) {
    console.error("Update medicine error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update medicine",
      error: error.message,
    });
  }
};

// @desc    Delete medicine
// @route   DELETE /api/medicines/:id
// @access  Private (Pharmacy only)
export const deleteMedicine = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const pharmacyUserId = (req as any).user.userId;

    const medicine = await Medicine.findById(id);

    if (!medicine) {
      res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
      return;
    }

    // Check authorization
    if (medicine.pharmacyId.toString() !== pharmacyUserId) {
      res.status(403).json({
        success: false,
        message: "Not authorized to delete this medicine",
      });
      return;
    }

    await Medicine.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete medicine error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete medicine",
      error: error.message,
    });
  }
};

// @desc    Get medicine categories
// @route   GET /api/medicines/categories
// @access  Public
export const getMedicineCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Medicine.distinct("category");

    res.status(200).json({
      success: true,
      data: categories.filter((c) => c),
    });
  } catch (error: any) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};
