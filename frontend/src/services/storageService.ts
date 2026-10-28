import { User, Doctor, Appointment, Prescription, MedicationReminder, HospitalBed, HospitalInvoice, SmsNotificationRecord } from '../types';

export class StorageService {
  private static USERS_KEY = 'hp_users';
  private static AUTH_KEY = 'hp_auth_user';
  private static DOCTORS_KEY = 'hp_registered_doctors';
  private static APTS_KEY = 'hp_user_appointments';
  private static RX_KEY = 'hp_user_prescriptions';
  private static ALARMS_KEY = 'hp_user_alarms';
  private static BEDS_KEY = 'hp_hospital_beds';
  private static INVOICES_KEY = 'hp_user_invoices';
  private static SMS_KEY = 'hp_sms_history';

  /**
   * Initialize default seed accounts if none exist
   * (Allows immediate testing without forcing empty screens, but user can add their own)
   */
  static initDefaults(): void {
    if (!localStorage.getItem(this.USERS_KEY)) {
      const initialUsers: User[] = [
        {
          id: 'user-pat-01',
          name: 'Fawwaaz',
          email: 'patient@healthpulse.com',
          password: 'password123',
          role: 'patient',
          phone: '9345288654',
          guardianName: 'Kishore (Guardian)',
          guardianPhone: '9488634916',
          bloodGroup: 'O+',
          age: 22,
          gender: 'Male',
          allergies: ['Dust', 'Pollen']
        },
        {
          id: 'user-doc-01',
          name: 'Dr. Sarah Jenkins',
          email: 'doctor@healthpulse.com',
          password: 'password123',
          role: 'doctor',
          specialty: 'Cardiologist',
          phone: '+91 98401 23456',
          age: 44,
          gender: 'Female',
          doctorDetails: {
            id: 'user-doc-01',
            name: 'Dr. Sarah Jenkins',
            specialty: 'Cardiologist',
            department: 'Cardiology & Heart Center',
            experience: 16,
            rating: 4.95,
            reviewsCount: 140,
            consultationFee: 800,
            location: 'Apollo Metro Center, 4th Floor',
            hospital: 'HealthPulse Super Specialty Hospital',
            availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            availability: ['09:00 AM', '11:00 AM', '02:00 PM', '04:30 PM'],
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
            about: 'Senior Cardiologist specializing in preventive heart health, hypertension, and cardiac care.',
            qualifications: 'MBBS, MD (Cardiology), FACC',
            regNumber: 'MCI-TN-2008-48291',
            isOnline: true
          }
        },
        {
          id: 'user-adm-01',
          name: 'Chief Administrator',
          email: 'admin@healthpulse.com',
          password: 'password123',
          role: 'admin',
          phone: '+91 98402 34567',
          hospitalName: 'HealthPulse Super Specialty Hospital'
        }
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(initialUsers));
    } else {
      // Backfill guardian info for any existing patients if missing
      try {
        const existingUsers = this.getUsers();
        let changed = false;
        const patched = existingUsers.map(u => {
          if (u.role === 'patient') {
            if (!u.phone || u.phone === '+91 98400 12345') { u.phone = '9345288654'; changed = true; }
            if (!u.guardianPhone || u.guardianPhone === '+91 98765 43211') { u.guardianPhone = '9488634916'; changed = true; }
            if (!u.guardianName || u.guardianName.includes('Sarah Morgan')) { u.guardianName = 'Kishore (Guardian)'; changed = true; }
            if (u.name === 'Kishore Kumar') { u.name = 'Fawwaaz'; changed = true; }
          }
          return u;
        });
        if (changed) {
          localStorage.setItem(this.USERS_KEY, JSON.stringify(patched));
          const current = this.getCurrentUser();
          if (current && current.role === 'patient') {
            const found = patched.find(p => p.id === current.id);
            if (found) this.setCurrentUser(found);
          }
        }
      } catch (e) {
        console.error('Error migrating users:', e);
      }
    }

    // Default doctors list from initial registered doctors
    if (!localStorage.getItem(this.DOCTORS_KEY)) {
      const users = this.getUsers();
      const docs: Doctor[] = users
        .filter(u => u.role === 'doctor' && u.doctorDetails)
        .map(u => u.doctorDetails as Doctor);

      if (docs.length === 0) {
        docs.push({
          id: 'user-doc-01',
          name: 'Dr. Sarah Jenkins',
          specialty: 'Cardiologist',
          department: 'Cardiology & Heart Center',
          experience: 16,
          rating: 4.95,
          reviewsCount: 140,
          consultationFee: 800,
          location: 'Metro Center, 4th Floor',
          hospital: 'HealthPulse Super Specialty Hospital',
          availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          availability: ['09:00 AM', '11:00 AM', '02:00 PM', '04:30 PM'],
          image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
          about: 'Senior Cardiologist specializing in preventive heart health and clinical cardiology.',
          qualifications: 'MBBS, MD (Cardiology)',
          regNumber: 'MCI-TN-2008-48291',
          isOnline: true
        });
      }
      localStorage.setItem(this.DOCTORS_KEY, JSON.stringify(docs));
    }

    // Initialize hospital beds if empty
    if (!localStorage.getItem(this.BEDS_KEY)) {
      const defaultBeds: HospitalBed[] = [
        { id: 'b-101', ward: 'ICU', bedNumber: 'ICU-01', status: 'Available', oxygenSupport: true },
        { id: 'b-102', ward: 'ICU', bedNumber: 'ICU-02', status: 'Occupied', patientName: 'Admitted Patient', admissionDate: '2026-10-20', doctorInCharge: 'Dr. Sarah Jenkins', oxygenSupport: true },
        { id: 'b-103', ward: 'Emergency Care', bedNumber: 'ER-01', status: 'Available', oxygenSupport: true },
        { id: 'b-104', ward: 'Emergency Care', bedNumber: 'ER-02', status: 'Cleaning', oxygenSupport: true },
        { id: 'b-105', ward: 'Cardiology Ward', bedNumber: 'CW-101', status: 'Available', oxygenSupport: false },
        { id: 'b-106', ward: 'General Ward', bedNumber: 'GW-201', status: 'Available', oxygenSupport: false },
        { id: 'b-107', ward: 'General Ward', bedNumber: 'GW-202', status: 'Available', oxygenSupport: false },
        { id: 'b-108', ward: 'Post-Surgical', bedNumber: 'PS-301', status: 'Available', oxygenSupport: true }
      ];
      localStorage.setItem(this.BEDS_KEY, JSON.stringify(defaultBeds));
    }
  }

  // --- USER AUTHENTICATION & MANAGEMENT ---

  static getUsers(): User[] {
    const raw = localStorage.getItem(this.USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  static registerUser(newUser: User): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === newUser.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

    // If a doctor registered, also add them to the Doctors directory
    if (newUser.role === 'doctor' && newUser.doctorDetails) {
      this.addOrUpdateDoctor(newUser.doctorDetails as Doctor);
    }

    // Set current active session
    this.setCurrentUser(newUser);
    return { success: true, message: 'Account created successfully!', user: newUser };
  }

  static loginUser(email: string, pass: string, role: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const found = users.find(u => 
      u.email.toLowerCase() === email.trim().toLowerCase() && 
      u.role.toLowerCase() === role.toLowerCase()
    );

    if (!found) {
      return { success: false, message: `No ${role.toUpperCase()} account found with this email. Please register first.` };
    }

    if (found.password && found.password !== pass) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    this.setCurrentUser(found);
    return { success: true, message: 'Logged in successfully!', user: found };
  }

  static getCurrentUser(): User | null {
    const raw = localStorage.getItem(this.AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  static setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.AUTH_KEY);
    }
  }

  static updateUserProfile(user: User): void {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    this.setCurrentUser(user);
  }

  static logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
  }

  // --- DOCTOR DIRECTORY ---

  static getDoctors(): Doctor[] {
    const raw = localStorage.getItem(this.DOCTORS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  static addOrUpdateDoctor(doc: Doctor): void {
    const docs = this.getDoctors();
    const index = docs.findIndex(d => d.id === doc.id || d.name.toLowerCase() === doc.name.toLowerCase());
    if (index >= 0) {
      docs[index] = doc;
    } else {
      docs.push(doc);
    }
    localStorage.setItem(this.DOCTORS_KEY, JSON.stringify(docs));
  }

  // --- APPOINTMENTS (ONLY REAL USER DATA) ---

  static getAppointments(): Appointment[] {
    const raw = localStorage.getItem(this.APTS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  static saveAppointment(apt: Appointment): void {
    const apts = this.getAppointments();
    apts.unshift(apt);
    localStorage.setItem(this.APTS_KEY, JSON.stringify(apts));
  }

  static updateAppointmentStatus(aptId: string, status: Appointment['status']): void {
    const apts = this.getAppointments();
    const updated = apts.map(a => a.id === aptId ? { ...a, status } : a);
    localStorage.setItem(this.APTS_KEY, JSON.stringify(updated));
  }

  // --- PRESCRIPTIONS (ONLY REAL USER DATA) ---

  static getPrescriptions(): Prescription[] {
    const raw = localStorage.getItem(this.RX_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  static savePrescription(rx: Prescription): void {
    const list = this.getPrescriptions();
    list.unshift(rx);
    localStorage.setItem(this.RX_KEY, JSON.stringify(list));

    // Also auto-generate an invoice for this prescription
    const inv: HospitalInvoice = {
      id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientName: rx.patientName,
      date: rx.date,
      doctorName: rx.doctorName,
      consultationFee: 750,
      medicationFee: rx.medicines.length * 150,
      labFee: rx.labTestsRecommended.length * 300,
      tax: 95,
      insuranceCovered: 1000,
      totalPayable: Math.max(250, 750 + rx.medicines.length * 150 + rx.labTestsRecommended.length * 300 - 1000),
      status: 'Paid'
    };
    this.saveInvoice(inv);
  }

  // --- MEDICATION ALARMS ---

  static getAlarms(): MedicationReminder[] {
    const raw = localStorage.getItem(this.ALARMS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  static saveAlarms(alarms: MedicationReminder[]): void {
    localStorage.setItem(this.ALARMS_KEY, JSON.stringify(alarms));
  }

  // --- HOSPITAL BEDS ---

  static getBeds(): HospitalBed[] {
    const raw = localStorage.getItem(this.BEDS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  static saveBeds(beds: HospitalBed[]): void {
    localStorage.setItem(this.BEDS_KEY, JSON.stringify(beds));
  }

  // --- INVOICES ---

  static getInvoices(): HospitalInvoice[] {
    const raw = localStorage.getItem(this.INVOICES_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  static saveInvoice(inv: HospitalInvoice): void {
    const list = this.getInvoices();
    list.unshift(inv);
    localStorage.setItem(this.INVOICES_KEY, JSON.stringify(list));
  }

  // --- DUAL SMS NOTIFICATION DISPATCH HISTORY ---

  static getSmsHistory(): SmsNotificationRecord[] {
    const raw = localStorage.getItem(this.SMS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  static saveSmsRecord(record: SmsNotificationRecord): void {
    const list = this.getSmsHistory();
    list.unshift(record);
    // Keep last 50 SMS records
    if (list.length > 50) list.length = 50;
    localStorage.setItem(this.SMS_KEY, JSON.stringify(list));
  }
}
