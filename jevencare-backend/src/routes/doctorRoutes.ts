import express from "express";
import {
  getDoctors,
  getDoctorById,
  updateDoctorProfile,
  getSpecializations,
  getMyDoctorProfile,
} from "../controllers/doctorController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

// Public routes
router.get("/", getDoctors);
router.get("/specializations", getSpecializations);
router.get("/:id", getDoctorById);

// Protected routes (Doctor only)
router.get("/my-profile", protect, authorize("doctor"), getMyDoctorProfile);
router.put("/profile", protect, authorize("doctor"), updateDoctorProfile);

export default router;
