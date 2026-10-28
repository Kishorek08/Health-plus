import React, { useState } from 'react';
import { 
  Calendar, Clock, Video, FileText, Plus, 
  CheckCircle2, Stethoscope, Printer, Scan 
} from 'lucide-react';
import { Appointment, Prescription, Doctor, Language } from '../types';
import { translations } from '../translations';

interface DoctorDashboardProps {
  doctor: Doctor;
  language: Language;
  appointments: Appointment[];
  prescriptions: Prescription[];
  onStartVideoCall: (apt: Appointment) => void;
  onOpenIssuePrescription: (patientName?: string, appointmentId?: string) => void;
  onViewPrescription: (rx: Prescription) => void;
  onCompleteAppointment: (aptId: string) => void;
  onOpenRadiology?: () => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  doctor,
  language,
  appointments,
  prescriptions,
  onStartVideoCall,
  onOpenIssuePrescription,
  onViewPrescription,
  onCompleteAppointment,
  onOpenRadiology
}) => {
  const t = translations[language] || translations.en;
  const [activeTab, setActiveTab] = useState<'queue' | 'prescriptions'>('queue');

  const doctorAppointments = appointments.filter(
    a => a.doctorId === doctor.id || a.doctorName.includes(doctor.name)
  );

  const doctorPrescriptions = prescriptions.filter(
    p => p.doctorId === doctor.id || p.doctorName.includes(doctor.name)
  );

  return (
    <div className="space-y-6">
      
      {/* DOCTOR BANNER */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>{t.clinicalSuite}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t.welcomeBack}, {doctor.name}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            {doctor.specialty} • {doctor.hospital} • Reg: {doctor.regNumber}
          </p>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          {onOpenRadiology && (
            <button
              onClick={onOpenRadiology}
              className="px-4 py-3 bg-emerald-600/50 hover:bg-emerald-600 border border-emerald-400/40 text-white font-extrabold text-xs rounded-2xl shadow transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Scan className="w-4 h-4 text-cyan-300" />
              <span>AI Radiology</span>
            </button>
          )}

          <button
            onClick={() => onOpenIssuePrescription()}
            className="px-5 py-3 bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-xs rounded-2xl shadow-lg transition flex items-center space-x-2 transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>{t.actionIssuePrescription}</span>
          </button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{doctorAppointments.length}</div>
            <div className="text-xs text-slate-500 font-medium">{t.statActiveAppointments}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{doctorPrescriptions.length}</div>
            <div className="text-xs text-slate-500 font-medium">{t.statPrescriptions} ({t.issuedBadge})</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">HD Ready</div>
            <div className="text-xs text-slate-500 font-medium">{t.telehealthClinic}</div>
          </div>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('queue')}
          className={`pb-3 px-4 font-bold text-xs transition border-b-2 cursor-pointer ${
            activeTab === 'queue'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {t.patientQueueTab} ({doctorAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`pb-3 px-4 font-bold text-xs transition border-b-2 cursor-pointer ${
            activeTab === 'prescriptions'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {t.prescriptionArchiveTab} ({doctorPrescriptions.length})
        </button>
      </div>

      {/* TAB 1: CONSULTATION QUEUE */}
      {activeTab === 'queue' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-base text-slate-900">{t.todaysScheduleTitle}</h3>
          </div>

          <div className="space-y-3">
            {doctorAppointments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-xs text-slate-600">{t.noAppointmentsQueue}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{t.noAppointmentsQueueSub}</p>
              </div>
            ) : (
              doctorAppointments.map((apt, idx) => (
                <div
                  key={apt.id}
                  className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition hover:bg-slate-100/60"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-sm">
                      #{apt.queueNumber || idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                        <span>{apt.patientName}</span>
                        <span className="text-[10px] font-semibold text-slate-500">
                          ({apt.patientAge || 38} {t.ageLabel}, {apt.patientGender === 'Female' ? t.genderFemale : apt.patientGender === 'Other' ? t.genderOther : t.genderMale})
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {t.chiefComplaints}: <strong className="text-slate-700">{apt.symptoms || 'General Checkup'}</strong>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{apt.date} {t.atTime} {apt.time}</span>
                        <span>• {t.mode}: <strong className="capitalize">{apt.type}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
                    {apt.type === 'video' && (
                      <button
                        onClick={() => onStartVideoCall(apt)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>{t.startVideoCall}</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenIssuePrescription(apt.patientName, apt.id)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.actionIssuePrescription}</span>
                    </button>

                    <button
                      onClick={() => onCompleteAppointment(apt.id)}
                      className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
                      title={t.markComplete}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ISSUED PRESCRIPTIONS */}
      {activeTab === 'prescriptions' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-base text-slate-900">{t.issuedPrescriptionsTitle}</h3>
          </div>

          <div className="space-y-3">
            {doctorPrescriptions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-xs text-slate-600">{t.noDoctorPrescriptions}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{t.noDoctorPrescriptionsSub}</p>
              </div>
            ) : (
              doctorPrescriptions.map(rx => (
              <div
                key={rx.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-blue-700">{rx.id}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-bold text-slate-900">{rx.patientName}</span>
                    <span className="text-slate-500 text-[11px]">({rx.date})</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-1">
                    {t.diagnosisLabel}: <strong>{rx.diagnosis}</strong>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {t.medicinesLabel}: {rx.medicines.map(m => m.name).join(', ')}
                  </div>
                </div>

                <button
                  onClick={() => onViewPrescription(rx)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold rounded-xl shadow-sm transition flex items-center space-x-1.5 flex-shrink-0 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.actionPrintPdf}</span>
                </button>
              </div>
            )))}
          </div>
        </div>
      )}

    </div>
  );
};
