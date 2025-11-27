import express from "express";
import {
  getMedicines,
  getMedicineById,
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getMedicineCategories,
} from "../controllers/medicineController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

// Public routes
router.get("/", getMedicines);
router.get("/categories", getMedicineCategories);
router.get("/:id", getMedicineById);

// Protected routes (Pharmacy only)
router.post("/", protect, authorize("pharmacy"), addMedicine);
router.put("/:id", protect, authorize("pharmacy"), updateMedicine);
router.delete("/:id", protect, authorize("pharmacy"), deleteMedicine);

export default router;
