import express from "express";
import {
  uploadHealthRecord,
  getHealthRecords,
  getHealthRecordById,
  deleteHealthRecord,
} from "../controllers/healthRecordController";
import { protect, authorize } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = express.Router();

// All routes are protected
router.use(protect);

// Patient can upload and delete records
router.post(
  "/",
  authorize("patient"),
  upload.single("file"),
  uploadHealthRecord
);
router.delete("/:id", authorize("patient"), deleteHealthRecord);

// Both patient and doctor can view records
router.get("/", getHealthRecords);
router.get("/:id", getHealthRecordById);

export default router;
