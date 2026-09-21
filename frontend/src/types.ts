export type Language = 'EN' | 'TA' | 'HI' | 'ES' | 'FR' | 'en' | 'ta' | 'hi' | 'es' | 'fr';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience?: string | number;
  rating?: number;
  image?: string;
  availableSlots?: string[];
  location?: string;
  consultationFee?: number;
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  id: string;
  date: string;
  doctorName: string;
  items: PrescriptionItem[];
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  specialty?: string;
  date: string;
  time: string;
  status: 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED';
  queuePosition?: number;
  estimatedWaitMinutes?: number;
  prescription?: Prescription;
}