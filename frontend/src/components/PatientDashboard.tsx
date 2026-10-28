import React, { useState } from 'react';
import { 
  Calendar, Video, FileText, Pill, 
  MapPin, Printer, Bot, 
  FlaskConical, Flame, Stethoscope,
  CreditCard, ShieldCheck, Download, ChevronDown, ChevronUp, QrCode,
  Signal
} from 'lucide-react';
import { 
  User, Doctor, Appointment, Prescription, 
  MedicationReminder, LabReport, Language 
} from '../types';
import { translations } from '../translations';
import { RealMessagingService } from '../services/realMessagingService';

interface PatientDashboardProps {
  user: User;
  language: Language;
  doctors: Doctor[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  alarms: MedicationReminder[];
  labReports: LabReport[];
  onStartVideoCall: (apt: Appointment) => void;
  onBookDoctor: (doc: Doctor) => void;
  onViewPrescription: (rx: Prescription) => void;
  onToggleAlarm: (alarmId: string) => void;
  onOpenAlarmsModal: () => void;
  onOpenLabsModal: () => void;
  onOpenAiBot: () => void;
  onOpenKnowledgeBase: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  user,
  language,
  doctors,
  appointments,
  prescriptions,
  alarms,
  labReports,
  onStartVideoCall,
  onBookDoctor,
  onViewPrescription,
  onToggleAlarm,
  onOpenAlarmsModal,
  onOpenLabsModal,
  onOpenAiBot,
  onOpenKnowledgeBase
}) => {
  const t = translations[language] || translations.en;
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [showAbhaCard, setShowAbhaCard] = useState(false);
  const [dashboardSmsToast, setDashboardSmsToast] = useState<string | null>(null);

  const abhaNumber = '91-4821-7712-4091';
  const abhaAddress = `${user.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'patient'}@abdm`;

  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming');
  const userPrescriptions = prescriptions.filter(p => p.patientId === user.id || p.patientName.includes(user.name));
  const activeAlarms = alarms.slice(0, 3);

  const specialties = [
    { key: 'ALL', label: t.allSpecialties },
    { key: 'Cardiologist', label: t.specCardiologist },
    { key: 'Neurologist', label: t.specNeurologist },
    { key: 'General Physician', label: t.specGeneralPhysician },
    { key: 'Pulmonologist', label: t.specPulmonologist },
    { key: 'Dermatologist', label: t.specDermatologist },
    { key: 'Orthopedic Surgeon', label: t.specOrthopedic }
  ];

  const filteredDoctors = doctors.filter(doc => 
    selectedSpecialty === 'ALL' || doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* WELCOME BANNER */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <span>{t.verifiedMedicalRecord}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t.welcomeBack}, {user.name}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            {t.bloodGroupLabel}: <strong>{user.bloodGroup || 'O+'}</strong> • {t.allergiesLabel}: <strong>{user.allergies && user.allergies.length > 0 ? user.allergies.join(', ') : t.noneRecorded}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => setShowAbhaCard(!showAbhaCard)}
            className="px-3.5 py-2.5 bg-blue-500/30 hover:bg-blue-500/50 text-white border border-blue-300/40 font-bold text-xs rounded-2xl shadow transition flex items-center space-x-1.5 cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-cyan-300" />
            <span>ABHA Card</span>
            {showAbhaCard ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onOpenAiBot}
            className="px-4 py-2.5 bg-white hover:bg-blue-50 text-blue-900 font-extrabold text-xs rounded-2xl shadow-lg transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-blue-600" />
            <span>{t.navAiDoctor}</span>
          </button>
        </div>
      </div>

      {/* ABHA DIGITAL HEALTH IDENTITY CARD (AYUSHMAN BHARAT) */}
      {showAbhaCard && (
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 rounded-3xl border border-blue-500/30 shadow-2xl space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm">{t.abhaCardTitle}</h3>
                <p className="text-[11px] text-slate-400">{t.abhaCardSubtitle}</p>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.abhaDownloadBtn}</span>
            </button>
          </div>

          {/* PHYSICAL-STYLE DIGITAL CARD */}
          <div className="max-w-md mx-auto bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900 rounded-2xl p-5 shadow-2xl border-2 border-amber-500/40 relative overflow-hidden">
            {/* National Tricolor Top Stripe */}
            <div className="absolute top-0 left-0 right-0 h-2 flex">
              <div className="flex-1 bg-amber-500"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-emerald-600"></div>
            </div>

            {/* Header info */}
            <div className="flex justify-between items-start pt-1 pb-3 border-b border-slate-300">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 block">
                  National Digital Health Mission
                </span>
                <span className="text-[9px] text-slate-500 font-bold">Government of India • ABHA Smart ID</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-blue-800 text-white flex items-center justify-center font-black text-[10px]">
                🇮🇳
              </div>
            </div>

            {/* Card Body with Photo and Data */}
            <div className="py-4 flex gap-4 items-center">
              {/* Patient Photo Avatar */}
              <div className="w-20 h-24 rounded-xl bg-slate-800 text-white flex flex-col items-center justify-center border-2 border-slate-300 flex-shrink-0 shadow-inner overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-blue-600/40 text-blue-200 flex items-center justify-center font-bold text-lg">
                  {user.name.charAt(0)}
                </div>
                <span className="text-[9px] text-slate-300 font-mono mt-1 font-bold">VERIFIED</span>
              </div>

              {/* Patient Details */}
              <div className="space-y-1 flex-1 text-xs">
                <div className="font-black text-sm text-slate-900 leading-tight">{user.name}</div>
                <div className="text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-500">{t.authGender}:</span> {user.gender || 'Male'} • <span className="font-semibold text-slate-500">{t.bloodGroupLabel}:</span> {user.bloodGroup || 'O+'}
                </div>
                <div className="text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-500">{t.abhaAddress}:</span> <span className="font-mono text-blue-700 font-bold">{abhaAddress}</span>
                </div>
                <div className="pt-1">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">{t.abhaIdNumber}</span>
                  <span className="text-base font-black tracking-wider text-slate-950 font-mono">{abhaNumber}</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="p-1.5 bg-white rounded-lg border border-slate-300 shadow-sm">
                  <QrCode className="w-14 h-14 text-slate-900" />
                </div>
                <span className="text-[8px] text-slate-500 font-mono mt-0.5">SCAN OPD</span>
              </div>
            </div>

            {/* Bottom Security Strip */}
            <div className="pt-2 border-t border-slate-300 flex justify-between items-center text-[9px] text-slate-500 font-semibold">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>HMIS ABHA-L3 Compliant</span>
              </span>
              <span>Valid Pan-India Hospital OPD Fast-Track</span>
            </div>
          </div>
        </div>
      )}

      {/* QUICK STATS WIDGETS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Next Appointment */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{upcomingAppointments.length}</div>
            <div className="text-xs text-slate-500 font-semibold">{t.statActiveAppointments}</div>
          </div>
        </div>

        {/* E-Prescriptions */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{userPrescriptions.length}</div>
            <div className="text-xs text-slate-500 font-semibold">{t.statPrescriptions}</div>
          </div>
        </div>

        {/* Medication Adherence */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">14 {t.daysUnit}</div>
            <div className="text-xs text-slate-500 font-semibold">{t.statAdherenceStreak} 🔥</div>
          </div>
        </div>

        {/* Lab Reports */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">{labReports.length}</div>
            <div className="text-xs text-slate-500 font-semibold">{t.navLabReports}</div>
          </div>
        </div>

      </div>

      {/* UPCOMING APPOINTMENT CALLOUT */}
      {upcomingAppointments.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-base text-slate-900">{t.nextUpcomingConsult}</h3>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{t.waitingRoomOpen}</span>
            </span>
          </div>

          <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <div className="font-extrabold text-base text-slate-900">{upcomingAppointments[0].doctorName}</div>
                <div className="text-xs text-slate-500">
                  {upcomingAppointments[0].doctorSpecialty} • {upcomingAppointments[0].date} {t.atTime} {upcomingAppointments[0].time}
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  {t.reasonLabel}: <strong>{upcomingAppointments[0].symptoms}</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartVideoCall(upcomingAppointments[0])}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center space-x-2 transform active:scale-95 cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>{t.actionJoinVideo}</span>
            </button>
          </div>
        </div>
      )}

      {/* DUAL SECTION: PRESCRIPTIONS & MEDICATION ALARMS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PRESCRIPTION VAULT */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">{t.navPrescriptions}</h3>
              <p className="text-xs text-slate-500">{t.prescriptionsSubtitle}</p>
            </div>
          </div>

          <div className="space-y-3">
            {userPrescriptions.length === 0 ? (
              <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-xs text-slate-600">{t.noPrescriptions}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{t.noPrescriptionsSub}</p>
              </div>
            ) : (
              userPrescriptions.map(rx => (
                <div
                  key={rx.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 transition hover:bg-slate-100/60"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-bold text-xs text-blue-700">{rx.id}</span>
                      <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">{rx.diagnosis}</h4>
                      <p className="text-[11px] text-slate-500">
                        {t.prescribedBy} <strong>{rx.doctorName}</strong> {t.onDate} {rx.date}
                      </p>
                    </div>

                    <button
                      onClick={() => onViewPrescription(rx)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5 flex-shrink-0 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{t.actionPrintPdf}</span>
                    </button>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t.drugsLabel}</span>
                    <div className="text-slate-700">
                      {rx.medicines.map((m, i) => (
                        <span key={i} className="inline-block bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold mr-1.5 mb-1">
                          {m.name} ({m.dosage})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* DAILY MEDICATION REMINDERS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-slate-900">{t.navMedAlarms}</h3>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-black rounded-full uppercase">
                  Dual SMS
                </span>
              </div>
              <p className="text-xs text-slate-500">{t.alarmsSubtitle}</p>
            </div>
            <button
              onClick={onOpenAlarmsModal}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              {t.manageAlarms}
            </button>
          </div>

          {/* DUAL SMS NOTIFICATION TARGETS PILL */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50/60 rounded-2xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center space-x-2 text-blue-900 font-extrabold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{t.alarmDualSmsTitle} Active</span>
            </div>
            <div className="text-[10px] text-blue-800 font-mono font-bold flex flex-wrap items-center gap-2">
              <span className="bg-white/80 px-2 py-0.5 rounded-lg border border-blue-200">
                Patient: {user.phone || '9345288654'}
              </span>
              <span className="bg-white/80 px-2 py-0.5 rounded-lg border border-blue-200">
                Guardian: {user.guardianPhone || '9488634916'}
              </span>
            </div>
          </div>

          {/* DASHBOARD SMS STATUS FEEDBACK TOAST */}
          {dashboardSmsToast && (
            <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
              <Signal className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{dashboardSmsToast}</span>
            </div>
          )}

          <div className="space-y-3">
            {activeAlarms.length === 0 ? (
              <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Pill className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-xs text-slate-600">{t.noAlarms}</p>
                <button
                  onClick={onOpenAlarmsModal}
                  className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  {t.addReminder}
                </button>
              </div>
            ) : (
              activeAlarms.map(al => (
                <div
                  key={al.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl ${al.takenToday ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`font-bold ${al.takenToday ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {al.medicineName}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {al.dosage} {t.atTime} <strong>{al.time}</strong> • {al.frequency}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={async () => {
                        const msg = `[HealthPulse Alert] Hi ${user.name}, it is time for: ${al.medicineName} (${al.dosage}) at ${al.time}. Frequency: ${al.frequency}.`;
                        const targetPhone = user.phone || '9345288654';
                        setDashboardSmsToast(`Transmitting automated cellular SMS to ${targetPhone}...`);
                        const res = await RealMessagingService.sendAutomatedSms(targetPhone, msg);
                        setDashboardSmsToast(res.success ? `✓ SMS sent to ${targetPhone}! (Carrier ID: ${res.messageId || 'Direct'})` : `Carrier Gateway: ${res.details}`);
                        setTimeout(() => setDashboardSmsToast(null), 6000);
                      }}
                      className="p-1.5 text-emerald-700 hover:bg-emerald-100 bg-emerald-50 rounded-xl border border-emerald-200 transition cursor-pointer flex items-center space-x-1"
                      title="Send automated background cellular SMS directly to patient phone"
                    >
                      <Signal className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[10px] font-extrabold hidden sm:inline">Send SMS</span>
                    </button>
                    <button
                      onClick={() => onToggleAlarm(al.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition text-xs cursor-pointer ${
                        al.takenToday
                          ? 'bg-emerald-600 text-white shadow'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {al.takenToday ? t.takenCheck : t.actionMarkTaken}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 flex justify-between items-center text-xs">
            <button
              onClick={onOpenLabsModal}
              className="text-slate-600 hover:text-blue-600 font-bold flex items-center space-x-1 cursor-pointer"
            >
              <FlaskConical className="w-4 h-4 text-purple-600" />
              <span>{t.viewLabReportsBtn} ({labReports.length}) &rarr;</span>
            </button>
            <button
              onClick={onOpenKnowledgeBase}
              className="text-slate-600 hover:text-blue-600 font-bold flex items-center space-x-1 cursor-pointer"
            >
              <span>{t.exploreDiseaseDb} &rarr;</span>
            </button>
          </div>
        </div>

      </div>

      {/* FIND & BOOK DOCTORS DIRECTORY */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">{t.navDoctors}</h3>
            <p className="text-xs text-slate-500">{t.doctorsDirectorySubtitle}</p>
          </div>

          {/* Specialty Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {specialties.map(spec => (
              <button
                key={spec.key}
                onClick={() => setSelectedSpecialty(spec.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedSpecialty === spec.key
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {spec.label}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.length === 0 ? (
            <div className="col-span-1 md:col-span-3 p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Stethoscope className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-xs text-slate-600">{t.noDoctorsFound}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{t.noDoctorsFoundSub}</p>
            </div>
          ) : (
            filteredDoctors.map(doc => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
              <div className="space-y-3">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{doc.name}</h4>
                    <p className="text-xs font-bold text-blue-600">{doc.specialty}</p>
                    <p className="text-[10px] text-slate-500">{doc.experience} {t.yearsExp} • ⭐ {doc.rating} ({doc.reviewsCount})</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {doc.about}
                </p>

                <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{doc.location}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">{t.consultation}</span>
                  <span className="text-base font-black text-slate-900">₹{doc.consultationFee}</span>
                </div>

                <button
                  onClick={() => onBookDoctor(doc)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                >
                  {t.actionBookConsult}
                </button>
              </div>

            </div>
          )))}
        </div>
      </div>

    </div>
  );
};
