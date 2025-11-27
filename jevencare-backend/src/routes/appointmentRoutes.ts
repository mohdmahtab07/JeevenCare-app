import express from "express";
import {
  bookAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  addPrescription,
} from "../controllers/appointmentController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

// All routes are protected
router.use(protect);

// Patient can book appointments
router.post("/", authorize("patient"), bookAppointment);

// Both patient and doctor can view appointments
router.get("/", getAppointments);
router.get("/:id", getAppointmentById);

// Patient or Doctor can cancel
router.put("/:id/cancel", cancelAppointment);

// Doctor only routes
router.put("/:id/status", authorize("doctor"), updateAppointmentStatus);
router.put("/:id/prescription", authorize("doctor"), addPrescription);

export default router;
