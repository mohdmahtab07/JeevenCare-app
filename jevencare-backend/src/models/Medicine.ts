import mongoose, { Document, Schema } from "mongoose";

export interface IMedicine extends Document {
  pharmacyId: mongoose.Types.ObjectId;
  name: string;
  genericName: string;
  manufacturer: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  requiresPrescription: boolean;
  expiryDate?: Date;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const medicineSchema = new Schema<IMedicine>(
  {
    pharmacyId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    genericName: {
      type: String,
      required: true,
      trim: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    requiresPrescription: {
      type: Boolean,
      default: false,
    },
    expiryDate: Date,
    imageUrl: String,
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search
medicineSchema.index({ name: "text", genericName: "text", category: "text" });
medicineSchema.index({ pharmacyId: 1, isAvailable: 1 });
medicineSchema.index({ stock: 1 });

export default mongoose.model<IMedicine>("Medicine", medicineSchema);
