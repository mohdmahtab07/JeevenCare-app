import { Request, Response } from "express";
import Appointment from "../models/Appointment";
import Doctor from "../models/Doctor";
import User from "../models/User";

// @desc    Book new appointment
// @route   POST /api/appointments
// @access  Private (Patient only)
export const bookAppointment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const patientId = (req as any).user.userId;
    const { doctorId, dateTime, type, symptoms } = req.body;

    // Validate required fields
    if (!doctorId || !dateTime || !type || !symptoms) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
      return;
    }

    // Check if doctor exists
    const doctor = await Doctor.findOne({ userId: doctorId });
    if (!doctor) {
      res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
      return;
    }

    // Check if appointment time is in the future
    if (new Date(dateTime) < new Date()) {
      res.status(400).json({
        success: false,
        message: "Appointment time must be in the future",
      });
      return;
    }

    // Check if doctor is available at that time (simplified check)
    const existingAppointment = await Appointment.findOne({
      doctorId,
      dateTime,
      status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
      res.status(400).json({
        success: false,
        message: "Doctor is not available at this time",
      });
      return;
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      dateTime,
      type,
      symptoms,
      consultationFee: doctor.consultationFee,
      status: "scheduled",
      paymentStatus: "completed", // Mock payment
    });

    // Populate data
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("patientId", "name phone email")
      .populate("doctorId", "name phone email profileImage");

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully!",
      data: populatedAppointment,
    });
  } catch (error: any) {
    console.error("Book appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to book appointment",
      error: error.message,
    });
  }
};

// @desc    Get user's appointments
// @route   GET /api/appointments
// @access  Private
export const getAppointments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;
    const { status, page = 1, limit = 10 } = req.query;

    // Build query based on role
    const query: any = {};

    if (userRole === "patient") {
      query.patientId = userId;
    } else if (userRole === "doctor") {
      query.doctorId = userId;
    }

    if (status) {
      query.status = status;
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const appointments = await Appointment.find(query)
      .populate("patientId", "name phone email profileImage")
      .populate("doctorId", "name phone email profileImage")
      .sort({ dateTime: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      data: appointments,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error("Get appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

// @desc    Get single appointment details
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    const appointment = await Appointment.findById(id)
      .populate("patientId", "name phone email profileImage address")
      .populate("doctorId", "name phone email profileImage");

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
      return;
    }

    // Check authorization
    if (
      userRole === "patient" &&
      appointment.patientId._id.toString() !== userId
    ) {
      res.status(403).json({
        success: false,
        message: "Not authorized to view this appointment",
      });
      return;
    }

    if (
      userRole === "doctor" &&
      appointment.doctorId._id.toString() !== userId
    ) {
      res.status(403).json({
        success: false,
        message: "Not authorized to view this appointment",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error: any) {
    console.error("Get appointment by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointment",
      error: error.message,
    });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private (Doctor only)
export const updateAppointmentStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = (req as any).user.userId;

    if (!["scheduled", "ongoing", "completed", "cancelled"].includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid status",
      });
      return;
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
      return;
    }

    // Only doctor can update status
    if (appointment.doctorId.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "Not authorized",
      });
      return;
    }

    appointment.status = status;
    await appointment.save();

    const updatedAppointment = await Appointment.findById(id)
      .populate("patientId", "name phone email")
      .populate("doctorId", "name phone email");

    res.status(200).json({
      success: true,
      message: "Appointment status updated",
      data: updatedAppointment,
    });
  } catch (error: any) {
    console.error("Update appointment status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update appointment",
      error: error.message,
    });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
export const cancelAppointment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body;
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
      return;
    }

    // Check authorization
    const isPatient =
      userRole === "patient" && appointment.patientId.toString() === userId;
    const isDoctor =
      userRole === "doctor" && appointment.doctorId.toString() === userId;

    if (!isPatient && !isDoctor) {
      res.status(403).json({
        success: false,
        message: "Not authorized to cancel this appointment",
      });
      return;
    }

    if (appointment.status === "completed") {
      res.status(400).json({
        success: false,
        message: "Cannot cancel completed appointment",
      });
      return;
    }

    appointment.status = "cancelled";
    appointment.cancelReason = cancelReason || "Cancelled by user";
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: appointment,
    });
  } catch (error: any) {
    console.error("Cancel appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel appointment",
      error: error.message,
    });
  }
};

// @desc    Add prescription to appointment
// @route   PUT /api/appointments/:id/prescription
// @access  Private (Doctor only)
export const addPrescription = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { medicines, labTests, notes } = req.body;
    const userId = (req as any).user.userId;

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
      return;
    }

    if (appointment.doctorId.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "Not authorized",
      });
      return;
    }

    appointment.prescription = {
      medicines: medicines || [],
      labTests: labTests || [],
      notes: notes || "",
    };

    // Auto-complete appointment when prescription is added
    if (appointment.status === "ongoing") {
      appointment.status = "completed";
    }

    await appointment.save();

    const updatedAppointment = await Appointment.findById(id)
      .populate("patientId", "name phone email")
      .populate("doctorId", "name phone email");

    res.status(200).json({
      success: true,
      message: "Prescription added successfully",
      data: updatedAppointment,
    });
  } catch (error: any) {
    console.error("Add prescription error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add prescription",
      error: error.message,
    });
  }
};
