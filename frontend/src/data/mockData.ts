import { Doctor, Appointment, Prescription, MedicationReminder, HospitalBed, LabReport, HospitalInvoice, User } from '../types';

export const MOCK_USERS: Record<string, User> = {
  patient: {
    id: 'pat-101',
    name: 'Alex Morgan',
    email: 'alex.morgan@healthpulse.com',
    role: 'patient',
    age: 38,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+91 98765 43210',
    allergies: ['Penicillin', 'Peanuts']
  },
  doctor: {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins, MD',
    email: 'dr.jenkins@healthpulse.com',
    role: 'doctor',
    specialty: 'Cardiologist',
    phone: '+91 98401 23456',
    age: 46,
    gender: 'Female'
  },
  admin: {
    id: 'adm-01',
    name: 'Hospital Director Vance',
    email: 'admin@healthpulse.com',
    role: 'admin',
    phone: '+91 98400 11111'
  }
};

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Cardiologist',
    department: 'Cardiology & Heart Center',
    experience: 16,
    rating: 4.95,
    reviewsCount: 342,
    consultationFee: 850,
    location: 'Tower A, 4th Floor, Apollo Metro Center',
    hospital: 'HealthPulse Super Specialty Hospital',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availability: ['09:00 AM', '10:30 AM', '11:45 AM', '02:00 PM', '04:15 PM'],
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    about: 'Chief Interventional Cardiologist specializing in preventive coronary artery management, heart failure, and complex cardiac catheterization.',
    qualifications: 'MBBS, MD (General Medicine), DM (Cardiology), FACC',
    regNumber: 'MCI-TN-2008-48291',
    isOnline: true
  },
  {
    id: 'doc-2',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Neurologist',
    department: 'Neurosciences & Stroke Institute',
    experience: 14,
    rating: 4.9,
    reviewsCount: 280,
    consultationFee: 900,
    location: 'Tower B, 3rd Floor',
    hospital: 'HealthPulse Super Specialty Hospital',
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    availability: ['09:30 AM', '11:00 AM', '03:00 PM', '05:30 PM'],
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    about: 'Senior Consultant Neurologist specializing in acute ischemic stroke, chronic refractory migraines, epilepsy syndromes, and neuro-rehabilitation.',
    qualifications: 'MBBS, MD, DM (Neurology), Fellow World Stroke Org',
    regNumber: 'MCI-TN-2010-61029',
    isOnline: true
  },
  {
    id: 'doc-3',
    name: 'Dr. Priya Sundaram',
    specialty: 'General Physician',
    department: 'Internal & Preventive Medicine',
    experience: 18,
    rating: 4.98,
    reviewsCount: 512,
    consultationFee: 500,
    location: 'OPD Block, Ground Floor',
    hospital: 'HealthPulse Super Specialty Hospital',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availability: ['08:30 AM', '10:00 AM', '11:30 AM', '01:00 PM', '04:00 PM', '06:00 PM'],
    image: 'https://images.unsplash.com/photo-1594824813566-88855ce78341?auto=format&fit=crop&q=80&w=400',
    about: 'Leading Primary Care Physician with two decades of experience treating complex diabetes, viral infections, hypertension, and preventive family health.',
    qualifications: 'MBBS, MD (Internal Medicine), FACP',
    regNumber: 'MCI-TN-2005-31290',
    isOnline: true
  },
  {
    id: 'doc-4',
    name: 'Dr. Marcus Weber',
    specialty: 'Pulmonologist',
    department: 'Pulmonary & Critical Care',
    experience: 12,
    rating: 4.88,
    reviewsCount: 195,
    consultationFee: 800,
    location: 'Tower A, 2nd Floor',
    hospital: 'HealthPulse Super Specialty Hospital',
    availableDays: ['Tue', 'Thu', 'Sat'],
    availability: ['10:00 AM', '12:00 PM', '03:30 PM', '05:00 PM'],
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    about: 'Specialist in bronchial asthma management, severe COPD rehabilitation, sleep apnea diagnostic polysomnography, and post-COVID pulmonary fibrosis.',
    qualifications: 'MBBS, MD (Pulmonary Med), DNB, FCCP',
    regNumber: 'MCI-DL-2012-78190',
    isOnline: false
  },
  {
    id: 'doc-5',
    name: 'Dr. Ananya Sharma',
    specialty: 'Dermatologist',
    department: 'Dermatology & Skin Center',
    experience: 10,
    rating: 4.92,
    reviewsCount: 220,
    consultationFee: 700,
    location: 'Cosmetic & Skin Clinic, 1st Floor',
    hospital: 'HealthPulse Super Specialty Hospital',
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    availability: ['09:00 AM', '11:15 AM', '02:30 PM', '04:45 PM'],
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=400',
    about: 'Consultant Dermatologist focusing on plaque psoriasis, chronic eczema, autoimmune blistering disorders, and advanced laser dermatology.',
    qualifications: 'MBBS, MD (DVL - Dermatology, Venereology & Leprosy)',
    regNumber: 'MCI-MH-2014-99120',
    isOnline: true
  },
  {
    id: 'doc-6',
    name: 'Dr. Vikram Malhotra',
    specialty: 'Orthopedic Surgeon',
    department: 'Orthopedics & Joint Replacement',
    experience: 20,
    rating: 4.96,
    reviewsCount: 440,
    consultationFee: 950,
    location: 'Surgical Block, 5th Floor',
    hospital: 'HealthPulse Super Specialty Hospital',
    availableDays: ['Mon', 'Wed', 'Fri'],
    availability: ['11:00 AM', '01:00 PM', '04:00 PM'],
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    about: 'Pioneering robotic joint replacement surgeon specializing in minimally invasive total knee and hip arthroplasty, and sports ligament reconstruction.',
    qualifications: 'MBBS, MS (Ortho), MCh (Ortho - UK), Fellow AO Trauma',
    regNumber: 'MCI-KA-2004-18452',
    isOnline: true
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'RX-2026-8941',
    appointmentId: 'apt-101',
    patientId: 'pat-101',
    patientName: 'Alex Morgan',
    patientAge: 38,
    patientGender: 'Male',
    patientPhone: '+91 98765 43210',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins',
    doctorSpecialty: 'Cardiologist',
    doctorHospital: 'HealthPulse Super Specialty Hospital, Metro Center',
    doctorRegNo: 'MCI-TN-2008-48291',
    date: '2026-10-18',
    diagnosis: 'Stage 1 Essential Hypertension & Mild Exertional Palpitations',
    symptoms: 'Occasional morning occipital headache, palpitations after staircase climbing.',
    vitals: {
      bp: '142/92 mmHg',
      pulse: '78 bpm',
      temp: '98.4 °F',
      spo2: '99%',
      weight: '76 kg',
      sugar: '104 mg/dL (Random)'
    },
    medicines: [
      {
        id: 'rx-m1',
        name: 'Amlodipine Besylate',
        dosage: '5 mg',
        frequency: '1-0-0 (Morning)',
        timing: 'After Food',
        duration: '30 Days',
        route: 'Oral',
        instructions: 'Take daily at 8:00 AM with water. Monitor blood pressure weekly.'
      },
      {
        id: 'rx-m2',
        name: 'Metoprolol Succinate Extended-Release',
        dosage: '25 mg',
        frequency: '0-0-1 (Night)',
        timing: 'After Food',
        duration: '30 Days',
        route: 'Oral',
        instructions: 'Swallow whole, do not crush. Helps stabilize resting heart rate.'
      },
      {
        id: 'rx-m3',
        name: 'Omega-3 Fish Oil (EPA 500mg / DHA 250mg)',
        dosage: '1000 mg',
        frequency: '0-1-0 (Afternoon)',
        timing: 'With Food',
        duration: '60 Days',
        route: 'Oral',
        instructions: 'Cardioprotective lipid support.'
      }
    ],
    clinicalAdvice: 'Adhere to strict DASH dietary plan (sodium < 2.0g/day). Engage in 30 minutes of brisk walking 5 days a week. Maintain a daily blood pressure log in the HealthPulse app.',
    labTestsRecommended: [
      'Serum Electrolytes (Na+, K+, Cl-)',
      'Serum Creatinine & eGFR',
      'Lipid Profile (Fasting)',
      '12-Lead Electrocardiogram (ECG)'
    ],
    followUpDate: '2026-11-18 (After 4 Weeks)',
    qrCodeData: 'HEALTHPULSE:RX-2026-8941|DOC:SARAH-JENKINS|PAT:ALEX-MORGAN|VERIFIED-DIGITAL-SIGNATURE',
    isDispensed: false
  },
  {
    id: 'RX-2026-7210',
    appointmentId: 'apt-099',
    patientId: 'pat-101',
    patientName: 'Alex Morgan',
    patientAge: 38,
    patientGender: 'Male',
    patientPhone: '+91 98765 43210',
    doctorId: 'doc-3',
    doctorName: 'Dr. Priya Sundaram',
    doctorSpecialty: 'General Physician',
    doctorHospital: 'HealthPulse Super Specialty Hospital',
    doctorRegNo: 'MCI-TN-2005-31290',
    date: '2026-09-10',
    diagnosis: 'Acute Viral Rhinitis with Pharyngitis',
    symptoms: 'Sore throat, low grade fever, rhinorrhea and mild dry cough.',
    vitals: {
      bp: '126/80 mmHg',
      pulse: '72 bpm',
      temp: '100.2 °F',
      spo2: '98%',
      weight: '75.5 kg'
    },
    medicines: [
      {
        id: 'rx-m4',
        name: 'Paracetamol',
        dosage: '650 mg',
        frequency: '1-1-1 (TID)',
        timing: 'After Food',
        duration: '3 Days',
        route: 'Oral',
        instructions: 'Take only if temperature exceeds 99.5°F or for body ache.'
      },
      {
        id: 'rx-m5',
        name: 'Levocetirizine + Montelukast',
        dosage: '5mg / 10mg',
        frequency: '0-0-1 (Night)',
        timing: 'After Food',
        duration: '5 Days',
        route: 'Oral',
        instructions: 'Take at bedtime. May cause mild drowsiness.'
      }
    ],
    clinicalAdvice: 'Warm saline gargles 3 times a day. Hydrate with 3-4 liters of warm liquids. Rest adequately.',
    labTestsRecommended: ['Complete Blood Count (CBC) if fever persists > 4 days'],
    followUpDate: 'SOS if breathlessness or high persistent fever',
    qrCodeData: 'HEALTHPULSE:RX-2026-7210|DOC:PRIYA-SUNDARAM|PAT:ALEX-MORGAN|VERIFIED',
    isDispensed: true
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins',
    doctorSpecialty: 'Cardiologist',
    doctorHospital: 'HealthPulse Super Specialty Hospital',
    patientId: 'pat-101',
    patientName: 'Alex Morgan',
    patientAge: 38,
    patientGender: 'Male',
    date: 'Today',
    time: '10:30 AM',
    type: 'video',
    status: 'upcoming',
    symptoms: 'Routine 4-week hypertension follow-up & ECG review.',
    notes: 'Patient reports good compliance with Amlodipine 5mg.',
    queueNumber: 3
  },
  {
    id: 'apt-102',
    doctorId: 'doc-2',
    doctorName: 'Dr. Rajesh Kumar',
    doctorSpecialty: 'Neurologist',
    doctorHospital: 'HealthPulse Super Specialty Hospital',
    patientId: 'pat-101',
    patientName: 'Alex Morgan',
    patientAge: 38,
    patientGender: 'Male',
    date: 'Tomorrow',
    time: '02:00 PM',
    type: 'in-clinic',
    status: 'upcoming',
    symptoms: 'Mild recurring temporal tension headaches after screen work.',
    queueNumber: 7
  },
  {
    id: 'apt-103',
    doctorId: 'doc-3',
    doctorName: 'Dr. Priya Sundaram',
    doctorSpecialty: 'General Physician',
    doctorHospital: 'HealthPulse Super Specialty Hospital',
    patientId: 'pat-102',
    patientName: 'Samantha Green',
    patientAge: 29,
    patientGender: 'Female',
    date: 'Today',
    time: '11:15 AM',
    type: 'video',
    status: 'upcoming',
    symptoms: 'Persistent dry cough and allergic sneezing for past 1 week.',
    queueNumber: 4
  },
  {
    id: 'apt-104',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins',
    doctorSpecialty: 'Cardiologist',
    doctorHospital: 'HealthPulse Super Specialty Hospital',
    patientId: 'pat-103',
    patientName: 'David Chen',
    patientAge: 54,
    patientGender: 'Male',
    date: 'Today',
    time: '12:00 PM',
    type: 'in-clinic',
    status: 'upcoming',
    symptoms: 'Exertional dyspnea and bilateral ankle swelling review.',
    queueNumber: 5
  }
];

export const INITIAL_ALARMS: MedicationReminder[] = [
  {
    id: 'al-1',
    medicineName: 'Amlodipine Besylate (5mg)',
    dosage: '1 Tablet',
    time: '08:00 AM',
    frequency: 'Daily (Morning)',
    takenToday: true,
    streakDays: 14,
    notes: 'Take with full glass of water after breakfast'
  },
  {
    id: 'al-2',
    medicineName: 'Omega-3 Fish Oil',
    dosage: '1 Softgel',
    time: '01:30 PM',
    frequency: 'Daily (Afternoon)',
    takenToday: false,
    streakDays: 12,
    notes: 'Take directly after lunch'
  },
  {
    id: 'al-3',
    medicineName: 'Metoprolol Succinate ER (25mg)',
    dosage: '1 Tablet',
    time: '09:00 PM',
    frequency: 'Daily (Night)',
    takenToday: false,
    streakDays: 14,
    notes: 'Do not miss. Keeps nocturnal heart rhythm stable'
  }
];

export const MOCK_HOSPITAL_BEDS: HospitalBed[] = [
  { id: 'b-101', ward: 'ICU', bedNumber: 'ICU-01', status: 'Occupied', patientName: 'Robert Vance (62M)', admissionDate: '2026-10-19', doctorInCharge: 'Dr. Sarah Jenkins', oxygenSupport: true },
  { id: 'b-102', ward: 'ICU', bedNumber: 'ICU-02', status: 'Occupied', patientName: 'Maria Garcia (71F)', admissionDate: '2026-10-20', doctorInCharge: 'Dr. Marcus Weber', oxygenSupport: true },
  { id: 'b-103', ward: 'ICU', bedNumber: 'ICU-03', status: 'Available', oxygenSupport: true },
  { id: 'b-104', ward: 'Emergency Care', bedNumber: 'ER-01', status: 'Occupied', patientName: 'Kevin Patel (24M)', admissionDate: '2026-10-21', doctorInCharge: 'Dr. Priya Sundaram', oxygenSupport: true },
  { id: 'b-105', ward: 'Emergency Care', bedNumber: 'ER-02', status: 'Cleaning', oxygenSupport: true },
  { id: 'b-106', ward: 'Emergency Care', bedNumber: 'ER-03', status: 'Available', oxygenSupport: true },
  { id: 'b-107', ward: 'Cardiology Ward', bedNumber: 'CW-201', status: 'Occupied', patientName: 'Anita Roy (58F)', admissionDate: '2026-10-18', doctorInCharge: 'Dr. Sarah Jenkins', oxygenSupport: false },
  { id: 'b-108', ward: 'Cardiology Ward', bedNumber: 'CW-202', status: 'Available', oxygenSupport: false },
  { id: 'b-109', ward: 'General Ward', bedNumber: 'GW-301', status: 'Occupied', patientName: 'Suresh Kumar (45M)', admissionDate: '2026-10-20', doctorInCharge: 'Dr. Priya Sundaram', oxygenSupport: false },
  { id: 'b-110', ward: 'General Ward', bedNumber: 'GW-302', status: 'Available', oxygenSupport: false },
  { id: 'b-111', ward: 'General Ward', bedNumber: 'GW-303', status: 'Reserved', patientName: 'Eleanor White (33F)', admissionDate: '2026-10-21', doctorInCharge: 'Dr. Vikram Malhotra', oxygenSupport: false },
  { id: 'b-112', ward: 'Post-Surgical', bedNumber: 'PS-401', status: 'Occupied', patientName: 'Johnathan Cole (67M)', admissionDate: '2026-10-19', doctorInCharge: 'Dr. Vikram Malhotra', oxygenSupport: true }
];

export const MOCK_LAB_REPORTS: LabReport[] = [
  {
    id: 'LAB-2026-1092',
    patientId: 'pat-101',
    patientName: 'Alex Morgan',
    testName: 'Complete Blood Count (CBC) with Differential',
    category: 'Hematology',
    date: '2026-10-17',
    doctorName: 'Dr. Sarah Jenkins',
    status: 'Normal',
    results: [
      { parameter: 'Hemoglobin (Hb)', value: '14.8', unit: 'g/dL', normalRange: '13.5 - 17.5', status: 'Normal' },
      { parameter: 'Total Leukocyte Count (WBC)', value: '6,800', unit: '/mcL', normalRange: '4,500 - 11,000', status: 'Normal' },
      { parameter: 'Platelet Count', value: '245,000', unit: '/mcL', normalRange: '150,000 - 450,000', status: 'Normal' },
      { parameter: 'Packed Cell Volume (PCV)', value: '44.2', unit: '%', normalRange: '40 - 52', status: 'Normal' },
      { parameter: 'Neutrophils', value: '58', unit: '%', normalRange: '40 - 70', status: 'Normal' },
      { parameter: 'Lymphocytes', value: '32', unit: '%', normalRange: '20 - 45', status: 'Normal' }
    ],
    doctorNotes: 'Hematological parameters are within optimal physiological boundaries. No evidence of infection or cytopenia.'
  },
  {
    id: 'LAB-2026-1093',
    patientId: 'pat-101',
    patientName: 'Alex Morgan',
    testName: 'Lipid Panel (Fasting 12h)',
    category: 'Biochemistry',
    date: '2026-10-17',
    doctorName: 'Dr. Sarah Jenkins',
    status: 'Borderline',
    results: [
      { parameter: 'Total Cholesterol', value: '208', unit: 'mg/dL', normalRange: '< 200', status: 'High' },
      { parameter: 'HDL (Good) Cholesterol', value: '48', unit: 'mg/dL', normalRange: '> 40', status: 'Normal' },
      { parameter: 'LDL (Bad) Cholesterol', value: '134', unit: 'mg/dL', normalRange: '< 100', status: 'High' },
      { parameter: 'Triglycerides', value: '142', unit: 'mg/dL', normalRange: '< 150', status: 'Normal' },
      { parameter: 'Cholesterol / HDL Ratio', value: '4.3', unit: 'ratio', normalRange: '< 5.0', status: 'Normal' }
    ],
    doctorNotes: 'Mild borderline hypercholesterolemia. Dietary modification with low saturated fat and Omega-3 supplementation recommended before initiating statins.'
  },
  {
    id: 'LAB-2026-1094',
    patientId: 'pat-101',
    patientName: 'Alex Morgan',
    testName: 'Renal Function & Electrolytes (KFT)',
    category: 'Biochemistry',
    date: '2026-10-17',
    doctorName: 'Dr. Sarah Jenkins',
    status: 'Normal',
    results: [
      { parameter: 'Serum Creatinine', value: '0.92', unit: 'mg/dL', normalRange: '0.70 - 1.30', status: 'Normal' },
      { parameter: 'Estimated GFR (CKD-EPI)', value: '102', unit: 'mL/min/1.73m²', normalRange: '> 90', status: 'Normal' },
      { parameter: 'Blood Urea Nitrogen (BUN)', value: '14', unit: 'mg/dL', normalRange: '7 - 20', status: 'Normal' },
      { parameter: 'Serum Potassium (K+)', value: '4.2', unit: 'mEq/L', normalRange: '3.5 - 5.0', status: 'Normal' },
      { parameter: 'Serum Sodium (Na+)', value: '139', unit: 'mEq/L', normalRange: '135 - 145', status: 'Normal' }
    ],
    doctorNotes: 'Excellent baseline renal function. Safe for continuation of antihypertensive ACE/ARB or Calcium channel blocker therapy.'
  }
];

export const MOCK_INVOICES: HospitalInvoice[] = [
  {
    id: 'INV-2026-551',
    patientName: 'Alex Morgan',
    date: '2026-10-18',
    doctorName: 'Dr. Sarah Jenkins',
    consultationFee: 850,
    medicationFee: 420,
    labFee: 650,
    tax: 96,
    insuranceCovered: 1500,
    totalPayable: 516,
    status: 'Paid'
  },
  {
    id: 'INV-2026-412',
    patientName: 'Alex Morgan',
    date: '2026-09-10',
    doctorName: 'Dr. Priya Sundaram',
    consultationFee: 500,
    medicationFee: 180,
    labFee: 0,
    tax: 34,
    insuranceCovered: 500,
    totalPayable: 214,
    status: 'Paid'
  }
];
