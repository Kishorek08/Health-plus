export type Language = 'en' | 'es' | 'fr';

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  fee: number;
  availableSlots: string[];
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  date: string;
  diagnosis: string;
  items: PrescriptionItem[];
  instructions?: string;
  issuedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  time: string;
  symptoms: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  queuePosition?: number;
  estimatedWaitMins?: number;
  attachedFile?: string;
  prescription?: Prescription;
}