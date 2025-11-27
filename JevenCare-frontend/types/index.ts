// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'pharmacy';
  language: string;
  profileImage?: string;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  address: string;
  emergencyContact: string;
}

export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  experience: number;
  qualifications: string[];
  languages: string[];
  availableSlots: TimeSlot[];
  consultationFee: number;
}

// Appointment Types
export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  dateTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'video' | 'chat';
  symptoms: string;
  prescription?: Prescription;
}

// Health Record Types
export interface HealthRecord {
  id: string;
  patientId: string;
  date: string;
  type: 'lab_report' | 'prescription' | 'visit_summary';
  title: string;
  fileUrl?: string;
  notes: string;
  doctorId: string;
}

// Medicine Types
export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  price: number;
  stock: number;
  pharmacyId: string;
  description: string;
  manufacturer: string;
}

// Pharmacy Types
export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  location: {
    latitude: number;
    longitude: number;
  };
  medicines: Medicine[];
  isOpen: boolean;
}

// Helper Types
export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Prescription {
  id: string;
  medicines: {
    medicineId: string;
    name: string;
    dosage: string;
    duration: string;
    instructions: string;
  }[];
  labTests?: string[];
  notes: string;
}
