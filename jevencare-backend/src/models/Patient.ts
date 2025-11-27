import mongoose, { Document, Schema } from "mongoose";

export interface IPatient extends Document {
  userId: mongoose.Types.ObjectId;
  bloodGroup?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  allergies?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    emergencyContact: String,
    medicalHistory: String,
    allergies: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPatient>("Patient", patientSchema);
