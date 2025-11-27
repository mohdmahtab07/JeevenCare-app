import express from "express";
import {
  register,
  sendOTPToUser,
  verifyOTPAndLogin,
  refreshAccessToken,
  logout,
  getMe,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/send-otp", sendOTPToUser);
router.post("/verify-otp", verifyOTPAndLogin);
router.post("/refresh-token", refreshAccessToken);

// Protected routes
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;
