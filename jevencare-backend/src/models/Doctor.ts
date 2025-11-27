import mongoose, { Document, Schema } from "mongoose";

export interface IDoctor extends Document {
  userId: mongoose.Types.ObjectId;
  specialization: string;
  experience: number;
  qualifications: string[];
  languages: string[];
  consultationFee: number;
  availableSlots: any[];
  isAvailable: boolean;
  rating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    qualifications: [String],
    languages: [String],
    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },
    availableSlots: [Schema.Types.Mixed],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDoctor>("Doctor", doctorSchema);
