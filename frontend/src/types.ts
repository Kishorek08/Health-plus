export type Language = 'en' | 'ta' | 'hi' | 'de';
export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  specialty?: string;
  phone?: string;
  guardianName?: string;
  guardianPhone?: string;
  bloodGroup?: string;
  age?: number;
  gender?: string;
  allergies?: string[];
  doctorDetails?: Partial<Doctor>;
  hospitalName?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviewsCount: number;
  consultationFee: number;
  location: string;
  hospital: string;
  availableDays: string[];
  availability: string[];
  image: string;
  about: string;
  qualifications: string;
  regNumber: string;
  isOnline: boolean;
  department: string;
}

export interface PrescriptionMedicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: 'Before Food' | 'After Food' | 'With Food' | 'Anytime';
  duration: string;
  route: 'Oral' | 'Topical' | 'Inhaler' | 'Injection' | 'Drops';
  instructions: string;
}

export interface Prescription {
  id: string;
  appointmentId?: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorHospital: string;
  doctorRegNo: string;
  date: string;
  diagnosis: string;
  symptoms: string;
  vitals: {
    bp: string;
    pulse: string;
    temp: string;
    spo2: string;
    weight: string;
    sugar?: string;
  };
  medicines: PrescriptionMedicine[];
  clinicalAdvice: string;
  labTestsRecommended: string[];
  followUpDate: string;
  qrCodeData: string;
  isDispensed?: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorHospital?: string;
  patientId: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  date: string;
  time: string;
  type: 'video' | 'in-clinic';
  status: 'upcoming' | 'completed' | 'cancelled';
  symptoms: string;
  notes?: string;
  prescription?: Prescription;
  queueNumber?: number;
}

export interface MedicationReminder {
  id: string;
  medicineName: string;
  dosage: string;
  time: string;
  frequency: string;
  takenToday: boolean;
  streakDays: number;
  notes?: string;
  smsAlertsEnabled?: boolean;
}

export interface SmsNotificationRecord {
  id: string;
  timestamp: string;
  medicineName: string;
  dosage: string;
  time: string;
  patientPhone: string;
  patientMessage: string;
  guardianPhone: string;
  guardianName?: string;
  guardianMessage: string;
  status: 'Delivered' | 'Sent';
}

export interface Disease {
  id: string;
  name: string;
  category: string;
  organSystem: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical / Emergency';
  overview: string;
  keySymptoms: string[];
  riskFactors: string[];
  recommendedSpecialist: string;
  emergencySigns: string[];
  diagnosticTests: string[];
  firstAidAdvice: string;
  prevention: string[];
}

export interface TriageEvaluation {
  urgency: 'Emergency' | 'Urgent' | 'Routine' | 'Self-Care';
  urgencyScore: number; // 1 to 10
  recommendedSpecialty: string;
  matchedConditions: { name: string; probability: number; reason: string }[];
  clinicalAdvice: string;
  emergencyRedFlags: string[];
  suggestedTests: string[];
  isRedFlag: boolean;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  triage?: TriageEvaluation;
  suggestedPrompts?: string[];
}

export interface HospitalBed {
  id: string;
  ward: 'ICU' | 'Emergency Care' | 'Cardiology Ward' | 'General Ward' | 'Pediatrics' | 'Post-Surgical';
  bedNumber: string;
  status: 'Occupied' | 'Available' | 'Cleaning' | 'Reserved';
  patientName?: string;
  admissionDate?: string;
  doctorInCharge?: string;
  oxygenSupport: boolean;
}

export interface LabReport {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  category: string;
  date: string;
  doctorName: string;
  status: 'Normal' | 'Abnormal' | 'Borderline';
  results: {
    parameter: string;
    value: string;
    unit: string;
    normalRange: string;
    status: 'Normal' | 'High' | 'Low';
  }[];
  doctorNotes: string;
}

export interface HospitalInvoice {
  id: string;
  patientName: string;
  date: string;
  doctorName: string;
  consultationFee: number;
  medicationFee: number;
  labFee: number;
  tax: number;
  insuranceCovered: number;
  totalPayable: number;
  status: 'Paid' | 'Pending' | 'Insurance Processing';
}
