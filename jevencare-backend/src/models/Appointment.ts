import mongoose, { Document, Schema } from "mongoose";

export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  dateTime: Date;
  status: "scheduled" | "completed" | "cancelled" | "ongoing";
  type: "video" | "chat";
  symptoms: string;
  prescription?: {
    medicines: Array<{
      medicineId?: string;
      name: string;
      dosage: string;
      duration: string;
      instructions: string;
    }>;
    labTests?: string[];
    notes: string;
  };
  consultationFee: number;
  paymentStatus: "pending" | "completed" | "refunded";
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "ongoing"],
      default: "scheduled",
    },
    type: {
      type: String,
      enum: ["video", "chat"],
      required: true,
    },
    symptoms: {
      type: String,
      required: true,
    },
    prescription: {
      medicines: [
        {
          medicineId: String,
          name: { type: String, required: true },
          dosage: { type: String, required: true },
          duration: { type: String, required: true },
          instructions: String,
        },
      ],
      labTests: [String],
      notes: String,
    },
    consultationFee: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "refunded"],
      default: "completed", // Mock payment for now
    },
    cancelReason: String,
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
appointmentSchema.index({ patientId: 1, dateTime: -1 });
appointmentSchema.index({ doctorId: 1, dateTime: -1 });
appointmentSchema.index({ status: 1 });

export default mongoose.model<IAppointment>("Appointment", appointmentSchema);
