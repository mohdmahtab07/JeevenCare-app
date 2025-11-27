import mongoose, { Document, Schema } from "mongoose";

export interface IPharmacy extends Document {
  userId: mongoose.Types.ObjectId;
  pharmacyName: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const pharmacySchema = new Schema<IPharmacy>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    pharmacyName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      latitude: Number,
      longitude: Number,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPharmacy>("Pharmacy", pharmacySchema);
