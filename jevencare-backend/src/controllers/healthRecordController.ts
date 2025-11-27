import { Request, Response } from 'express';
import HealthRecord, { IHealthRecord } from '../models/HealthRecord';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

// Helper: Upload file to Cloudinary
const uploadToCloudinary = (
  fileBuffer: Buffer,
  originalName: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'jevencare/health-records',
        resource_type: 'auto',
        public_id: `${Date.now()}-${originalName}`,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    const readableStream = Readable.from(fileBuffer);
    readableStream.pipe(uploadStream);
  });
};

// @desc    Upload health record
// @route   POST /api/records
// @access  Private (Patient only)
export const uploadHealthRecord = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const patientId = (req as any).user.userId;
    const { type, title, description, doctorId, appointmentId, date } = req.body;
    const file = req.file;

    // Validate required fields
    if (!type || !title || !description) {
      res.status(400).json({
        success: false,
        message: 'Please provide type, title, and description',
      });
      return;
    }

    let fileUrl, fileType, fileSize;

    // Upload file to Cloudinary if provided
    if (file) {
      const uploadResult = await uploadToCloudinary(file.buffer, file.originalname);
      fileUrl = uploadResult.secure_url;
      fileType = file.mimetype;
      fileSize = file.size;
    }

    // Prepare record data with proper typing
    const recordData: Partial<IHealthRecord> = {
      patientId,
      type,
      title,
      description,
      date: date ? new Date(date) : new Date(),
    };

    // Add optional fields only if they exist
    if (doctorId) recordData.doctorId = doctorId;
    if (appointmentId) recordData.appointmentId = appointmentId;
    if (fileUrl) recordData.fileUrl = fileUrl;
    if (fileType) recordData.fileType = fileType;
    if (fileSize) recordData.fileSize = fileSize;

    // Create health record
    const record = await HealthRecord.create(recordData);

    const populatedRecord = await HealthRecord.findById(record._id)
      .populate('patientId', 'name phone')
      .populate('doctorId', 'name phone');

    res.status(201).json({
      success: true,
      message: 'Health record uploaded successfully',
      data: populatedRecord,
    });
  } catch (error: any) {
    console.error('Upload health record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload health record',
      error: error.message,
    });
  }
};

// @desc    Get user's health records
// @route   GET /api/records
// @access  Private
export const getHealthRecords = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;
    const { type, page = 1, limit = 10 } = req.query;

    // Build query based on role
    const query: any = {};

    if (userRole === 'patient') {
      query.patientId = userId;
    } else if (userRole === 'doctor') {
      query.doctorId = userId;
    } else {
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return;
    }

    if (type) {
      query.type = type;
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const records = await HealthRecord.find(query)
      .populate('patientId', 'name phone email')
      .populate('doctorId', 'name phone')
      .populate('appointmentId')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await HealthRecord.countDocuments(query);

    res.status(200).json({
      success: true,
      data: records,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Get health records error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health records',
      error: error.message,
    });
  }
};

// @desc    Get single health record
// @route   GET /api/records/:id
// @access  Private
export const getHealthRecordById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    const record = await HealthRecord.findById(id)
      .populate('patientId', 'name phone email address')
      .populate('doctorId', 'name phone email')
      .populate('appointmentId');

    if (!record) {
      res.status(404).json({
        success: false,
        message: 'Health record not found',
      });
      return;
    }

    // Check authorization
    const isPatient = userRole === 'patient' && record.patientId._id.toString() === userId;
    const isDoctor = userRole === 'doctor' && record.doctorId?.toString() === userId;

    if (!isPatient && !isDoctor) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to view this record',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error: any) {
    console.error('Get health record by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health record',
      error: error.message,
    });
  }
};

// @desc    Delete health record
// @route   DELETE /api/records/:id
// @access  Private (Patient only)
export const deleteHealthRecord = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const record = await HealthRecord.findById(id);

    if (!record) {
      res.status(404).json({
        success: false,
        message: 'Health record not found',
      });
      return;
    }

    // Only patient can delete their own records
    if (record.patientId.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this record',
      });
      return;
    }

    // Delete file from Cloudinary if exists
    if (record.fileUrl) {
      const publicId = record.fileUrl.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`jevencare/health-records/${publicId}`);
      }
    }

    await HealthRecord.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Health record deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete health record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete health record',
      error: error.message,
    });
  }
};
