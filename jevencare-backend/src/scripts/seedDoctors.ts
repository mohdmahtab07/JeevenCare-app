import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import Doctor from "../models/Doctor";

dotenv.config();

const mockDoctors = [
  {
    name: "Dr. Rajesh Kumar",
    phone: "9876543210",
    email: "rajesh@jevencare.com",
    role: "doctor",
    specialization: "General Physician",
    experience: 15,
    qualifications: ["MBBS", "MD"],
    languages: ["Hindi", "English", "Punjabi"],
    consultationFee: 300,
    availableSlots: [
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
    ],
  },
  {
    name: "Dr. Priya Sharma",
    phone: "9876543211",
    email: "priya@jevencare.com",
    role: "doctor",
    specialization: "Pediatrician",
    experience: 10,
    qualifications: ["MBBS", "MD Pediatrics"],
    languages: ["Hindi", "English", "Marathi"],
    consultationFee: 400,
    availableSlots: [
      { day: "Tuesday", startTime: "10:00", endTime: "18:00" },
      { day: "Thursday", startTime: "10:00", endTime: "18:00" },
    ],
  },
  {
    name: "Dr. Amit Patel",
    phone: "9876543212",
    email: "amit@jevencare.com",
    role: "doctor",
    specialization: "Cardiologist",
    experience: 20,
    qualifications: ["MBBS", "MD", "DM Cardiology"],
    languages: ["Gujarati", "Hindi", "English"],
    consultationFee: 800,
    availableSlots: [
      { day: "Monday", startTime: "11:00", endTime: "16:00" },
      { day: "Friday", startTime: "11:00", endTime: "16:00" },
    ],
  },
];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Connected to MongoDB");

    // Clear existing doctors
    await User.deleteMany({ role: "doctor" });
    await Doctor.deleteMany({});

    console.log("🗑️  Cleared existing doctors");

    // Create doctors
    for (const docData of mockDoctors) {
      const user = await User.create({
        name: docData.name,
        phone: docData.phone,
        email: docData.email,
        role: "doctor",
        isVerified: true,
      });

      await Doctor.create({
        userId: user._id,
        specialization: docData.specialization,
        experience: docData.experience,
        qualifications: docData.qualifications,
        languages: docData.languages,
        consultationFee: docData.consultationFee,
        availableSlots: docData.availableSlots,
        isAvailable: true,
        rating: 4.5,
        totalRatings: 100,
      });

      console.log(`✅ Created doctor: ${docData.name}`);
    }

    console.log("✅ Doctors seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedDoctors();
