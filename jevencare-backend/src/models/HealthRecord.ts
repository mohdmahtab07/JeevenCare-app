import mongoose, { Document, Schema } from "mongoose";

export interface IHealthRecord extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId?: mongoose.Types.ObjectId;
  appointmentId?: mongoose.Types.ObjectId;
  type: "prescription" | "lab_report" | "visit_summary" | "scan" | "other";
  title: string;
  description: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const healthRecordSchema = new Schema<IHealthRecord>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },
    type: {
      type: String,
      enum: ["prescription", "lab_report", "visit_summary", "scan", "other"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    fileUrl: String,
    fileType: String,
    fileSize: Number,
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
healthRecordSchema.index({ patientId: 1, date: -1 });
healthRecordSchema.index({ type: 1 });

export default mongoose.model<IHealthRecord>(
  "HealthRecord",
  healthRecordSchema
);
