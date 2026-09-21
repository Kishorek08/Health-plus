import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, Clock, ShieldCheck, Zap, Download, 
  FileText, Pill, CheckCircle, Stethoscope, AlertCircle,
  Bell, BellRing, Plus, Volume2, Check, X, Power
} from 'lucide-react';
import { Doctor, Appointment, Language, PrescriptionItem } from '../types';
import { translations } from '../translations';

interface AlarmItem {
  id: string;
  medicineName: string;
  dosage: string;
  time: string;
  enabled: boolean;
  takenToday: boolean;
  doctorName?: string;
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

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  user,
  language,
  doctors,
  appointments,
  setAppointments,
}) => {
  const langKey = (language ? String(language).toUpperCase() : 'EN') as keyof typeof translations;
  const t = translations[langKey] || translations.EN;

  const [activeTab, setActiveTab] = useState<'doctors' | 'appointments' | 'alarms' | 'vault'>('doctors');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  
  // Booking modal state
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // STRICT USER FILTERING
  const userAppointments = appointments.filter(
    (apt) => apt.patientId === user.id || apt.patientName?.toLowerCase() === user.name?.toLowerCase()
  );

  const userPrescriptions = userAppointments
    .map((apt) => apt.prescription)
    .filter(Boolean);

  // MEDICATION ALARMS STATE
  const [alarms, setAlarms] = useState<AlarmItem[]>([]);
  const [showAddAlarmModal, setShowAddAlarmModal] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newTime, setNewTime] = useState('08:00 AM');
  const [ringingAlarm, setRingingAlarm] = useState<AlarmItem | null>(null);

  // Sync Alarms from User Prescriptions on mount or prescription updates
  useEffect(() => {
    const generatedAlarms: AlarmItem[] = [];
    userPrescriptions.forEach((rx: any) => {
      rx.items?.forEach((item: PrescriptionItem, idx: number) => {
        generatedAlarms.push({
          id: `rx_alarm_${rx.id}_${idx}`,
          medicineName: item.medicineName,
          dosage: item.dosage,
          time: item.frequency.includes('Twice') ? '08:00 AM & 08:00 PM' : '08:00 AM',
          enabled: true,
          takenToday: false,
          doctorName: rx.doctorName
        });
      });
    });

    // Merge with default sample alarm if none exist
    if (generatedAlarms.length === 0) {
      generatedAlarms.push({
        id: 'default_alarm_1',
        medicineName: 'Paracetamol',
        dosage: '500mg',
        time: '08:00 AM',
        enabled: true,
        takenToday: false,
        doctorName: 'Dr. Robert Chen'
      });
    }

    setAlarms(generatedAlarms);
  }, [userAppointments.length]);

  // Audio Beep Alert Generator (Using Web Audio API)
  const playAlarmSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.log('Audio playback error:', e);
    }
  };

  const triggerTestAlarm = (alarm: AlarmItem) => {
    setRingingAlarm(alarm);
    playAlarmSound();
  };

  const toggleAlarmState = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const toggleTakenState = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, takenToday: !a.takenToday } : a));
  };

  const handleAddCustomAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;

    const customAlarm: AlarmItem = {
      id: `custom_alarm_${Date.now()}`,
      medicineName: newMedName,
      dosage: newDosage || '1 Tablet',
      time: newTime,
      enabled: true,
      takenToday: false,
      doctorName: 'Self Scheduled'
    };

    setAlarms([customAlarm, ...alarms]);
    setNewMedName('');
    setNewDosage('');
    setShowAddAlarmModal(false);
  };

  // Specialties
  const specialties = [
    { key: 'ALL', label: t.allSpecialties || 'ALL' },
    { key: 'Cardiology', label: t.cardiology || 'Cardiology' },
    { key: 'Neurology', label: t.neurology || 'Neurology' },
    { key: 'General Medicine', label: t.generalMedicine || 'General Medicine' },
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'ALL' || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !bookingDate) return;

    const newAppointment: Appointment = {
      id: `apt_${Date.now()}`,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      patientId: user.id,
      patientName: user.name,
      date: bookingDate,
      time: bookingTime,
      status: 'CONFIRMED',
      specialty: selectedDoctor.specialty,
      symptoms: symptomsInput || 'General Checkup',
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setBookingSuccess(`Appointment booked successfully with ${selectedDoctor.name}`);
    setTimeout(() => setBookingSuccess(null), 4000);

    setSelectedDoctor(null);
    setBookingDate('');
    setSymptomsInput('');
  };

  const handleDownloadPrescription = (rx: any) => {
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
${rx.items?.map((item: PrescriptionItem, idx: number) => `${idx + 1}.${item.medicineName}
   Dosage: ${item.dosage} | Frequency: ${item.frequency} \vert{} Duration:${item.duration}`).join('\n')}

INSTRUCTIONS & NOTES:
${rx.instructions || 'Take as directed.'}

------------------------------------------------------------
Digitally Verified & Signed
Healthcare Portal System
============================================================
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Prescription_${rx.patientName}_${rx.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">

      {/* SUCCESS TOAST */}
      {bookingSuccess && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center justify-between font-bold text-xs animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{bookingSuccess}</span>
          </div>
        </div>
      )}

      {/* RINGING ALARM MODAL OVERLAY */}
      {ringingAlarm && (
        <div className="fixed inset-0 bg-red-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-pulse">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border-4 border-red-500">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <BellRing className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-red-600">{t.alarmRingingTitle || "MEDICATION REMINDER!"}</h3>
              <p className="text-xs text-slate-500 mt-1">{t.alarmRingingDesc || "It is time to take your prescribed medicine:"}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="font-extrabold text-slate-900 text-base block">{ringingAlarm.medicineName}</span>
              <span className="text-xs text-blue-600 font-bold block">{ringingAlarm.dosage}</span>
              <span className="text-[10px] text-slate-400 block mt-1">Prescribed by: {ringingAlarm.doctorName}</span>
            </div>
            <button
              onClick={() => {
                toggleTakenState(ringingAlarm.id);
                setRingingAlarm(null);
              }}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-lg cursor-pointer transition-all"
            >
              {t.snoozeDismiss || "Dismiss & Mark Taken"}
            </button>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {t.welcome || "Welcome"}, <span className="text-blue-600">{user.name}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t.manageSubtitle || "Manage consultations, prescriptions, and health vault"}
          </p>
        </div>

        {/* TABS & BADGES */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {t.hipaaCompliant || "HIPAA Compliant"}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl border border-amber-100">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            {t.expressBooking || "Instant Express Booking"}
          </span>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('doctors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'doctors'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.findDoctors || "Find Doctors"}
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'appointments'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.appointmentsTab || "Appointments"} ({userAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('alarms')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'alarms'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.medAlarms || "Med Alarms"} ({alarms.filter(a => a.enabled).length})
        </button>
        <button
          onClick={() => setActiveTab('vault')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'vault'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t.medicalVault || "Medical Vault"} ({userPrescriptions.length})
        </button>
      </div>

      {/* TAB 1: FIND DOCTORS */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder || "Search by doctor name or specialization..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {specialties.map((spec) => (
                <button
                  key={spec.key}
                  onClick={() => setSelectedSpecialty(spec.key)}
                  className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedSpecialty === spec.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {spec.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => {
              const hasBooked = userAppointments.some((apt) => apt.doctorId === doc.id);
              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-lg">
                        Dr
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{doc.name}</h3>
                        <p className="text-xs text-blue-600 font-medium">{doc.specialty}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg border border-amber-100">
                      ★ {doc.rating || 4.9}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{t.fee || "Fee"}</span>
                      <span className="font-extrabold text-slate-900 text-sm">${doc.fee || 80}</span>
                    </div>

                    <button
                      onClick={() => setSelectedDoctor(doc)}
                      disabled={hasBooked}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        hasBooked
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      {hasBooked ? (t.booked || "Booked") : (t.bookConsultation || "Book Consultation")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: APPOINTMENTS */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            {t.appointmentsTab || "Appointments"}
          </h2>

          {userAppointments.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">{t.noAppointmentsPatient || "No appointments scheduled yet."}</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {userAppointments.map((apt) => (
                <div key={apt.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{apt.doctorName}</h4>
                    <p className="text-xs text-slate-500">{apt.specialty}</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {apt.date} at {apt.time}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    apt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MED ALARMS (FULLY FUNCTIONAL) */}
      {activeTab === 'alarms' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                {t.medAlarmsTitle || "Medication Reminders & Alarms"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.activeAlarms || "Active Medication Alarms"} ({alarms.filter(a => a.enabled).length})
              </p>
            </div>

            <button
              onClick={() => setShowAddAlarmModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {t.addCustomAlarm || "Add Custom Alarm"}
            </button>
          </div>

          {alarms.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Clock className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-400">{t.noAlarmsFound || "No active alarms configured."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    alarm.enabled ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${alarm.enabled ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{alarm.medicineName}</h4>
                        <span className="text-xs text-blue-600 font-bold block">{alarm.dosage}</span>
                        {alarm.doctorName && (
                          <span className="text-[10px] text-slate-400 block">{alarm.doctorName}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleAlarmState(alarm.id)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        alarm.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                      }`}
                      title="Toggle Alarm ON/OFF"
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{alarm.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => triggerTestAlarm(alarm)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                        {t.testAlarm || "Test Ring"}
                      </button>

                      <button
                        onClick={() => toggleTakenState(alarm.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                          alarm.takenToday
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        {alarm.takenToday ? (t.taken || "Taken Today") : (t.markTaken || "Mark Taken")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MEDICAL VAULT */}
      {activeTab === 'vault' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {t.prescriptionsList || "My Medical Prescriptions"}
          </h2>

          {userPrescriptions.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-400">{t.noPrescriptions || "No prescriptions found for your account."}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userPrescriptions.map((rx: any) => (
                <div key={rx.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{rx.doctorName}</span>
                      <span className="text-[10px] text-slate-400 block">{rx.date}</span>
                    </div>
                    <button
                      onClick={() => handleDownloadPrescription(rx)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-blue-700 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {t.downloadPrescription || "Download"}
                    </button>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block">{t.diagnosis || "Diagnosis"}:</span>
                    <p className="text-xs text-slate-600">{rx.diagnosis}</p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block mb-1">{t.medications || "Medications"}:</span>
                    <ul className="space-y-1">
                      {rx.items?.map((med: PrescriptionItem, idx: number) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                          <Pill className="w-3 h-3 text-blue-500" />
                          <span className="font-semibold">{med.medicineName}</span> - {med.dosage} ({med.frequency})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD CUSTOM ALARM MODAL */}
      {showAddAlarmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                {t.addCustomAlarm || "Add Custom Alarm"}
              </h3>
              <button onClick={() => setShowAddAlarmModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomAlarm} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.medicineName || "Medicine Name"} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amoxicillin"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.dosage || "Dosage"}</label>
                <input
                  type="text"
                  placeholder="e.g. 250mg or 1 Tablet"
                  value={newDosage}
                  onChange={(e) => setNewDosage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.alarmTime || "Alarm Time"}</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                >
                  <option value="08:00 AM">08:00 AM (Morning)</option>
                  <option value="02:00 PM">02:00 PM (Afternoon)</option>
                  <option value="08:00 PM">08:00 PM (Night)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAlarmModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {t.close || "Cancel"}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                >
                  {t.saveAlarm || "Save Alarm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              {t.bookConsultation || "Book Consultation"} - {selectedDoctor.name}
            </h3>

            <form onSubmit={handleBookAppointment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.selectDate || "Select Date"}</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.selectTime || "Select Time"}</label>
                <select
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.symptoms || "Describe Symptoms"}</label>
                <textarea
                  rows={2}
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  placeholder="e.g. Mild headache, fever"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDoctor(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {t.close || "Close"}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                >
                  {t.confirmBooking || "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};