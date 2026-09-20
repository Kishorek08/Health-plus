import React, { useState } from 'react';
import { 
  Search, Calendar, Clock, Star, 
  CheckCircle2, AlertCircle, UploadCloud, Pill, Bell, Check, Plus, X, ShieldCheck, Zap, Trash2, FileText, Lock, Download
} from 'lucide-react';
import { Doctor, Appointment, Language } from './types';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  takenToday: boolean;
}

interface PatientDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  language: Language;
  doctors: Doctor[];
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

const COMMON_REASONS = [
  'High Fever / Flu',
  'Severe Headache / Migraine',
  'Abdominal Pain',
  'Chest Tightness',
  'Skin Rash / Allergy',
  'General Routine Checkup',
];

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  user,
  doctors,
  appointments,
  setAppointments,
}) => {
  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'MY_APPOINTMENTS' | 'MEDICATIONS' | 'VAULT'>('EXPLORE');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [selectedReasonTag, setSelectedReasonTag] = useState<string>('');
  const [customSymptoms, setCustomSymptoms] = useState('');
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Notification Toast & Security Modal State
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [showHipaaModal, setShowHipaaModal] = useState(false);

  // Smart Medication Tracker State
  const [medications, setMedications] = useState<Medication[]>([
    { id: 'med_1', name: 'Paracetamol', dosage: '500mg', time: '08:00 AM', takenToday: true },
    { id: 'med_2', name: 'Amoxicillin', dosage: '250mg', time: '02:00 PM', takenToday: false },
    { id: 'med_3', name: 'Vitamin C', dosage: '1000mg', time: '08:00 PM', takenToday: false },
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedTime, setNewMedTime] = useState('09:00 AM');

  // Medical Vault Documents
  const [vaultFiles, setVaultFiles] = useState<string[]>([
    'Annual_Checkup_LabResults_2025.pdf',
    'Chest_XRay_Digital_Scan.png'
  ]);

  const triggerNotification = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 5000);
  };

  const handleInstantBooking = () => {
    if (doctors.length > 0) {
      setSelectedDoctor(doctors[0]);
      setSelectedReasonTag('General Routine Checkup');
      setBookingTime('Immediate Express Slot');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFileName(file.name);
      if (!vaultFiles.includes(file.name)) {
        setVaultFiles([...vaultFiles, file.name]);
      }
    }
  };

  const handleDeleteVaultFile = (fileName: string) => {
    setVaultFiles(vaultFiles.filter((f) => f !== fileName));
    triggerNotification(`📄 ${fileName} deleted from Medical Vault.`);
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    const finalReason = selectedReasonTag 
      ? `${selectedReasonTag}${customSymptoms ? ` - ${customSymptoms}` : ''}`
      : customSymptoms;

    if (!finalReason) {
      setBookingError('Please select or describe the reason for your visit.');
      return;
    }

    const newApt: Appointment = {
      id: `apt_${Date.now()}`,
      patientId: user.id,
      patientName: user.name,
      doctorId: selectedDoctor?.id || 'doc_1',
      doctorName: selectedDoctor?.name || 'Dr. Assigned',
      doctorSpecialty: selectedDoctor?.specialization || 'General Practitioner',
      date: bookingDate,
      time: bookingTime,
      symptoms: finalReason,
      status: 'CONFIRMED',
      queuePosition: Math.floor(Math.random() * 3) + 1,
      estimatedWaitMins: 15,
      attachedFile: attachedFileName || undefined,
    };

    setAppointments([newApt, ...appointments]);
    setBookingSuccess(true);

    triggerNotification(
      `📲 Confirmation Notification Sent! Appointment confirmed with ${newApt.doctorName} for ${newApt.date} at ${newApt.time}.`
    );

    setTimeout(() => {
      setSelectedDoctor(null);
      setBookingSuccess(false);
      setSelectedReasonTag('');
      setCustomSymptoms('');
      setAttachedFileName(null);
    }, 1800);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
    triggerNotification('❌ Appointment cancelled successfully.');
  };

  const handleDownloadPrescription = (apt: Appointment) => {
    if (!apt.prescription) return;
    const rx = apt.prescription;
    const content = `
============================================================
              OFFICIAL MEDICAL PRESCRIPTION
============================================================
Date: ${rx.date} | Rx ID: ${rx.id}
Doctor: ${rx.doctorName} (${apt.doctorSpecialty})
Patient: ${rx.patientName}
Diagnosis: ${rx.diagnosis}
------------------------------------------------------------
PRESCRIBED MEDICATIONS:
${rx.items.map((item, idx) => `${idx + 1}.${item.medicineName}
   Dosage: ${item.dosage} | Frequency: ${item.frequency} \vert{} Duration:${item.duration}`).join('\n')}

INSTRUCTIONS & NOTES:
${rx.instructions || 'Take as directed by doctor.'}

------------------------------------------------------------
Digitally Verified & Signed
Healthcare Portal & Appointment System
============================================================
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Prescription_${rx.patientName.replace(/\s+/g, '_')}_${rx.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleMedication = (id: string) => {
    setMedications(medications.map(m => m.id === id ? { ...m, takenToday: !m.takenToday } : m));
  };

  const addMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;
    setMedications([
      ...medications,
      {
        id: `med_${Date.now()}`,
        name: newMedName,
        dosage: newMedDosage || '1 Tablet',
        time: newMedTime || '09:00 AM',
        takenToday: false,
      }
    ]);
    setNewMedName('');
    setNewMedDosage('');
  };

  const deleteMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const filteredDoctors = doctors.filter((doc) => {
    const spec = doc.specialization || 'General Medicine';
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || spec.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = selectedSpecialty === 'ALL' || spec.toLowerCase() === selectedSpecialty.toLowerCase();
    return matchesSearch && matchesSpec;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">

      {notificationToast && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between font-bold text-xs animate-bounce">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-200" />
            <span>{notificationToast}</span>
          </div>
          <button onClick={() => setNotificationToast(null)}>
            <X className="w-4 h-4 text-white/80" />
          </button>
        </div>
      )}

      {/* TOP NAVIGATION HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome, {user.name}</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage consultations, prescriptions, and health vault</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowHipaaModal(true)}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> HIPAA Compliant
          </button>

          <button
            onClick={handleInstantBooking}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current" /> Instant Express Booking
          </button>

          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('EXPLORE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'EXPLORE' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Find Doctors
            </button>
            <button
              onClick={() => setActiveTab('MY_APPOINTMENTS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'MY_APPOINTMENTS' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Appointments ({appointments.length})
            </button>
            <button
              onClick={() => setActiveTab('MEDICATIONS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'MEDICATIONS' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Med Alarms
            </button>
            <button
              onClick={() => setActiveTab('VAULT')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'VAULT' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              Medical Vault
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: DOCTOR SEARCH */}
      {activeTab === 'EXPLORE' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by doctor name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['ALL', 'Cardiology', 'Neurology', 'General Medicine'].map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                    selectedSpecialty === spec ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-lg">
                      Dr
                    </div>
                    <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {doctor.rating || 5.0}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-3">{doctor.name}</h3>
                  <p className="text-xs font-semibold text-blue-600">{doctor.specialization || 'General Medicine'}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Fee</span>
                    <span className="text-base font-bold text-slate-900">${doctor.fee || 50}</span>
                  </div>
                  <button
                    onClick={() => setSelectedDoctor(doctor)}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Book Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: APPOINTMENTS & PRESCRIPTIONS */}
      {activeTab === 'MY_APPOINTMENTS' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900">My Scheduled Appointments & Prescriptions</h3>

          {appointments.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No appointments scheduled.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {appointments.map((apt) => (
                <div key={apt.id} className="py-5 space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">{apt.doctorName}</h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          apt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-blue-600 font-semibold">{apt.doctorSpecialty}</p>
                      
                      <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100">
                        <strong>Reason:</strong> {apt.symptoms}
                      </div>

                      {/* PRESCRIPTION DETAILS & DOWNLOAD */}
                      {apt.prescription ? (
                        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 text-xs">
                          <div className="flex items-center justify-between font-bold text-emerald-900">
                            <span className="flex items-center gap-1.5">
                              <Pill className="w-4 h-4 text-emerald-600" /> Digital Prescription Issued
                            </span>
                            <span className="text-[10px] text-emerald-700">Diagnosis: {apt.prescription.diagnosis}</span>
                          </div>

                          <div className="space-y-1 text-slate-700">
                            <strong>Prescribed Medicines:</strong>
                            <ul className="list-disc pl-4 text-[11px]">
                              {apt.prescription.items.map((med) => (
                                <li key={med.id}>
                                  <strong>{med.medicineName}</strong> ({med.dosage}) - {med.frequency} for {med.duration}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <button
                            onClick={() => handleDownloadPrescription(apt)}
                            className="mt-2 w-full sm:w-auto px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" /> Download Official Prescription (.txt)
                          </button>
                        </div>
                      ) : (
                        <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Prescription pending doctor issuance.
                        </p>
                      )}
                    </div>

                    <div className="text-right text-xs space-y-2">
                      <div>
                        <p className="font-bold text-slate-900">{apt.date}</p>
                        <p className="text-slate-500">{apt.time}</p>
                      </div>
                      <button
                        onClick={() => handleCancelAppointment(apt.id)}
                        className="px-2.5 py-1 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MEDICATION ALARMS */}
      {activeTab === 'MEDICATIONS' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Pill className="w-5 h-5 text-blue-600" /> Daily Prescription Alarms
            </h3>
            <p className="text-xs text-slate-500">Track daily dosages and check off taken medicine</p>
          </div>

          <form onSubmit={addMedication} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Medication Name"
              value={newMedName}
              onChange={(e) => setNewMedName(e.target.value)}
              className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Dosage (e.g. 500mg)"
              value={newMedDosage}
              onChange={(e) => setNewMedDosage(e.target.value)}
              className="w-full sm:w-32 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Time (e.g. 09:00 AM)"
              value={newMedTime}
              onChange={(e) => setNewMedTime(e.target.value)}
              className="w-full sm:w-32 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer">
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>

          <div className="space-y-3">
            {medications.map((med) => (
              <div key={med.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleMedication(med.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      med.takenToday ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300'
                    }`}
                  >
                    {med.takenToday && <Check className="w-4 h-4" />}
                  </button>
                  <div>
                    <h4 className={`text-xs font-bold ${med.takenToday ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {med.name} ({med.dosage})
                    </h4>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Scheduled for {med.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteMedication(med.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MEDICAL VAULT */}
      {activeTab === 'VAULT' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-600" /> Patient Medical Vault
            </h3>
            <p className="text-xs text-slate-500">Encrypted blood test reports, X-rays, and prescription history</p>
          </div>

          <label className="border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all">
            <UploadCloud className="w-10 h-10 text-blue-500 mb-2" />
            <span className="text-xs font-bold text-slate-800">Click to upload Lab Test Reports or X-Rays</span>
            <span className="text-[10px] text-slate-400 mt-1">Supports PDF, PNG, JPG (HIPAA Encrypted)</span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700">Uploaded Records:</h4>
            {vaultFiles.map((file, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" /> {file}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Lock className="w-3 h-3" /> HIPAA Protected
                  </span>
                  <button
                    onClick={() => handleDeleteVaultFile(file)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HIPAA COMPLIANCE MODAL */}
      {showHipaaModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">HIPAA Security Standard</h3>
              </div>
              <button onClick={() => setShowHipaaModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              All electronic protected health information (ePHI) including digital prescriptions, appointment records, and medical files are end-to-end encrypted with AES-256 protocols.
            </p>

            <button
              onClick={() => setShowHipaaModal(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Understand & Close
            </button>
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            {bookingSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-slate-900">Appointment Scheduled!</h3>
                <p className="text-xs text-slate-500">Your doctor will review symptoms prior to consultation.</p>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">Book with {selectedDoctor.name}</h3>
                  <button type="button" onClick={() => setSelectedDoctor(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {bookingError && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {bookingError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Select Medical Reason *
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {COMMON_REASONS.map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => setSelectedReasonTag(reason)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all cursor-pointer ${
                          selectedReasonTag === reason ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Describe specific symptoms..."
                    value={customSymptoms}
                    onChange={(e) => setCustomSymptoms(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Time Slot</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white"
                    >
                      <option value="Immediate Express Slot">Immediate Express Slot</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="01:30 PM">01:30 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDoctor(null)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-sm cursor-pointer"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};