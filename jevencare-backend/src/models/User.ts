import mongoose, { Document, Schema, CallbackError } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  phone: string;
  email?: string;
  name: string;
  role: "patient" | "doctor" | "pharmacy" | "admin";
  password?: string;
  isVerified: boolean;
  isActive: boolean;

  // OTP fields
  otpCode?: string;
  otpExpiry?: Date;
  otpAttempts: number;

  // Refresh token
  refreshToken?: string;

  // Profile
  profileImage?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  language: string;

  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "pharmacy", "admin"],
      default: "patient",
    },
    password: {
      type: String,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    otpCode: {
      type: String,
      select: false,
    },
    otpExpiry: {
      type: Date,
      select: false,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    profileImage: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    address: String,
    language: {
      type: String,
      default: "English",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving (if password exists)
userSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
