import React, { useState } from 'react';
import { 
  Calendar, Clock, Plus, Trash2, Download, 
  CheckCircle, ShieldCheck, Stethoscope, Send, X, Pill
} from 'lucide-react';
import { Appointment, PrescriptionItem, Prescription, Language } from '../types';
import { translations } from '../translations';

interface DoctorDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    specialization?: string;
  };
  language: Language;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  user,
  language,
  appointments,
  setAppointments,
}) => {
  // Safely resolve translations regardless of upper/lower case keying
  const langKey = (language ? String(language).toUpperCase() : 'EN') as Language;
  const t = translations[langKey] || translations.EN;

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [instructions, setInstructions] = useState('');
  const [medList, setMedList] = useState<PrescriptionItem[]>([
    { id: '1', medicineName: '', dosage: '', frequency: 'Once a day', duration: '5 days' }
  ]);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleAddMedRow = () => {
    setMedList([
      ...medList,
      { id: Date.now().toString(), medicineName: '', dosage: '', frequency: 'Twice a day', duration: '7 days' }
    ]);
  };

  const handleRemoveMedRow = (id: string) => {
    if (medList.length === 1) return;
    setMedList(medList.filter(m => m.id !== id));
  };

  const handleMedChange = (id: string, field: keyof PrescriptionItem, value: string) => {
    setMedList(medList.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleIssuePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    if (!diagnosis.trim()) {
      alert('Please enter a diagnosis before issuing the prescription.');
      return;
    }

    const validItems = medList.filter(m => m.medicineName.trim() !== '');
    if (validItems.length === 0) {
      alert('Please enter at least one medication name.');
      return;
    }

    const newPrescription: Prescription = {
      id: `rx_${Date.now()}`,
      appointmentId: selectedAppointment.id,
      doctorId: user.id,
      doctorName: user.name,
      patientId: selectedAppointment.patientId,
      patientName: selectedAppointment.patientName,
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      items: validItems,
      instructions,
      issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAppointments(prev => prev.map(apt => {
      if (apt.id === selectedAppointment.id) {
        return {
          ...apt,
          status: 'COMPLETED',
          prescription: newPrescription,
        };
      }
      return apt;
    }));

    showToast(`✅ ${t.prescriptionIssued || "Prescription issued"} - ${selectedAppointment.patientName}`);
    setSelectedAppointment(null);
    setDiagnosis('');
    setInstructions('');
    setMedList([{ id: '1', medicineName: '', dosage: '', frequency: 'Once a day', duration: '5 days' }]);
  };

  const handleDownloadPrescription = (apt: Appointment) => {
    if (!apt.prescription) return;
    const rx = apt.prescription;
    const content = `
============================================================
              OFFICIAL MEDICAL PRESCRIPTION
============================================================
Date: ${rx.date} | Rx ID: ${rx.id}
Doctor: ${rx.doctorName}
Patient: ${rx.patientName}
Diagnosis: ${rx.diagnosis}
------------------------------------------------------------
PRESCRIBED MEDICATIONS:
${rx.items.map((item: PrescriptionItem, idx: number) => `${idx + 1}.${item.medicineName}
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return t.statusCompleted || 'COMPLETED';
      case 'CONFIRMED':
        return t.statusConfirmed || 'CONFIRMED';
      case 'PENDING':
        return t.statusPending || 'PENDING';
      case 'CANCELLED':
        return t.statusCancelled || 'CANCELLED';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">

      {notification && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between font-bold text-xs animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-extrabold text-slate-900">{user.name}</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">{t.practicePortal || "Doctor Practice Dashboard"}</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> {t.activeLicense || "Active Medical License Verified"}
        </div>
      </div>

      {/* APPOINTMENTS LIST */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" /> {t.incomingQueue || "Scheduled Patient Consultations"}
        </h2>

        {appointments.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">{t.noAppointments || "No active appointments found"}</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {appointments.map((apt) => (
              <div key={apt.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{apt.patientName}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      apt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {getStatusLabel(apt.status)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>{t.selectReason ? t.selectReason.split('/')[0].trim() : "Symptoms"}:</strong> {apt.symptoms || apt.specialty || 'General Consultation'}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span><Calendar className="w-3 h-3 inline mr-1" />{apt.date}</span>
                    <span><Clock className="w-3 h-3 inline mr-1" />{apt.time}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {apt.prescription ? (
                    <button
                      onClick={() => handleDownloadPrescription(apt)}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-600" /> {t.viewPrescription || "View / Print Prescription"}
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedAppointment(apt)}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> {t.writePrescription || "Write Prescription"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE PRESCRIPTION MODAL */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-slate-100 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-blue-600" /> {t.prescriptionTitle || "Medical Prescription"}
                </h3>
                <p className="text-xs text-slate-500">{t.patient || "Patient"}: {selectedAppointment.patientName} ({selectedAppointment.date})</p>
              </div>
              <button onClick={() => setSelectedAppointment(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssuePrescription} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t.diagnosis || "Diagnosis / Clinical Notes"} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute Upper Respiratory Tract Infection, Mild Fever"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-800">
                    {t.medicines || "Prescribed Medicines & Dosage"} *
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedRow}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Medicine
                  </button>
                </div>

                <div className="space-y-2">
                  {medList.map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-12 sm:col-span-4">
                        <input
                          type="text"
                          placeholder="Medicine Name (e.g. Paracetamol)"
                          value={item.medicineName}
                          onChange={(e) => handleMedChange(item.id, 'medicineName', e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <input
                          type="text"
                          placeholder="Dosage (500mg)"
                          value={item.dosage}
                          onChange={(e) => handleMedChange(item.id, 'dosage', e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <select
                          value={item.frequency}
                          onChange={(e) => handleMedChange(item.id, 'frequency', e.target.value)}
                          className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs outline-none"
                        >
                          <option value="Once a day">Once a day</option>
                          <option value="Twice a day">Twice a day</option>
                          <option value="Thrice a day">Thrice a day</option>
                          <option value="As needed (PRN)">As needed (PRN)</option>
                        </select>
                      </div>
                      <div className="col-span-12 sm:col-span-2 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveMedRow(item.id)}
                          className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  {t.doctorNotes || "Doctor's Advice & Instructions"}
                </label>
                <textarea
                  rows={2}
                  placeholder="Take medicines after meals. Drink plenty of water and rest."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {t.close || "Cancel"}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" /> {t.savePrescription || "Save & Issue Prescription"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};