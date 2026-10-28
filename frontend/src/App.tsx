import { useState, useEffect } from 'react';
import { 
  Activity, BookOpen, Bot, 
  FileText, BellRing, Building2, 
  PhoneCall, Bell 
} from 'lucide-react';

import { 
  Language, UserRole, User, Doctor, Appointment, 
  Prescription, MedicationReminder, HospitalBed, LabReport, HospitalInvoice 
} from './types';
import { translations } from './translations';
import { StorageService } from './services/storageService';
import { AiMedicalService } from './services/aiMedicalService';
import { MOCK_LAB_REPORTS } from './data/mockData';

// Modular Components
import { AuthPage } from './components/AuthPage';
import { Navbar } from './components/Navbar';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { DiseaseKnowledgeBase } from './components/DiseaseKnowledgeBase';
import { AiMedicalBot } from './components/AiMedicalBot';
import { PrescriptionModal } from './components/PrescriptionModal';
import { IssuePrescriptionModal } from './components/IssuePrescriptionModal';
import { TelehealthRoom } from './components/TelehealthRoom';
import { MedicationAlarmsModal } from './components/MedicationAlarmsModal';
import { EmergencyModal } from './components/EmergencyModal';
import { LabReportsModal } from './components/LabReportsModal';
import { RadiologyViewerModal } from './components/RadiologyViewerModal';

export default function App() {
  // 1. Language State (en, ta, hi, de)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('hp_lang');
    return (saved as Language) || 'en';
  });

  // 2. Auth Session: Current Logged-in User
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    StorageService.initDefaults();
    return StorageService.getCurrentUser();
  });

  // 3. Current User Role
  const userRole: UserRole = currentUser?.role || 'patient';

  // 4. Navigation Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'knowledge-base' | 'ai-bot' | 'doctors' | 'appointments' | 'prescriptions' | 'alarms' | 'admin'>('dashboard');

  // 5. Data Collections (Loaded from StorageService - Real User-Generated Data)
  const [doctors, setDoctors] = useState<Doctor[]>(() => StorageService.getDoctors());
  const [appointments, setAppointments] = useState<Appointment[]>(() => StorageService.getAppointments());
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => StorageService.getPrescriptions());
  const [alarms, setAlarms] = useState<MedicationReminder[]>(() => StorageService.getAlarms());
  const [beds, setBeds] = useState<HospitalBed[]>(() => StorageService.getBeds());
  const [invoices, setInvoices] = useState<HospitalInvoice[]>(() => StorageService.getInvoices());
  const [labReports] = useState<LabReport[]>(MOCK_LAB_REPORTS);

  // 6. Active Modals State
  const [activeVideoCall, setActiveVideoCall] = useState<Appointment | null>(null);
  const [viewingPrescription, setViewingPrescription] = useState<Prescription | null>(null);
  const [showIssuePrescriptionModal, setShowIssuePrescriptionModal] = useState(false);
  const [selectedPatientForRx, setSelectedPatientForRx] = useState<string>('Alex Morgan');
  const [selectedAptIdForRx, setSelectedAptIdForRx] = useState<string | undefined>(undefined);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showAlarmsModal, setShowAlarmsModal] = useState(false);
  const [showLabsModal, setShowLabsModal] = useState(false);
  const [showRadiologyModal, setShowRadiologyModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [aiExternalQuery, setAiExternalQuery] = useState<string | null>(null);

  // Sync Language
  useEffect(() => {
    localStorage.setItem('hp_lang', language);
  }, [language]);

  const t = translations[language] || translations.en;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Login Success Handler
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    // Refresh user-specific data from storage
    setDoctors(StorageService.getDoctors());
    setAppointments(StorageService.getAppointments());
    setPrescriptions(StorageService.getPrescriptions());
    setAlarms(StorageService.getAlarms());
    setBeds(StorageService.getBeds());
    setInvoices(StorageService.getInvoices());
    setActiveTab('dashboard');
    showToast(`Signed in successfully as ${user.name} (${user.role.toUpperCase()})`);
  };

  // Sign Out Handler
  const handleSignOut = () => {
    AiMedicalService.playChime('click');
    StorageService.logout();
    setCurrentUser(null);
    showToast('Signed out of health portal.');
  };

  // Switch role handler (allows testing other portal modes directly if desired)
  const handleRoleChange = (role: UserRole) => {
    AiMedicalService.playChime('click');
    // Find or switch to a registered account with that role
    const users = StorageService.getUsers();
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      StorageService.setCurrentUser(targetUser);
      setCurrentUser(targetUser);
    } else {
      if (currentUser) {
        const updated = { ...currentUser, role };
        StorageService.setCurrentUser(updated);
        setCurrentUser(updated);
      }
    }
    setActiveTab('dashboard');
    showToast(`Switched view to ${role.toUpperCase()} Portal`);
  };

  // Switch language handler
  const handleLanguageChange = (lang: Language) => {
    AiMedicalService.playChime('click');
    setLanguage(lang);
    showToast(`Language switched to ${lang === 'ta' ? 'தமிழ்' : lang === 'hi' ? 'हिन्दी' : lang === 'de' ? 'Deutsch' : 'English'}`);
  };

  // Book appointment handler (Patient)
  const handleBookDoctor = (doc: Doctor) => {
    if (!currentUser) return;
    AiMedicalService.playChime('success');
    
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialty: doc.specialty,
      doctorHospital: doc.hospital,
      patientId: currentUser.id,
      patientName: currentUser.name,
      patientAge: currentUser.age || 28,
      patientGender: currentUser.gender || 'Male',
      date: 'Tomorrow',
      time: '11:00 AM',
      type: 'video',
      status: 'upcoming',
      symptoms: 'Scheduled teleconsultation with specialist',
      queueNumber: appointments.length + 1
    };

    StorageService.saveAppointment(newApt);
    setAppointments([newApt, ...appointments]);
    showToast(`Consultation confirmed with ${doc.name}!`);
    setActiveTab('dashboard');
  };

  // Save new prescription handler (Doctor View)
  const handleSavePrescription = (newRx: Prescription) => {
    StorageService.savePrescription(newRx);
    setPrescriptions([newRx, ...prescriptions]);
    setInvoices(StorageService.getInvoices());
    showToast(t.rxIssueSuccess);
    setViewingPrescription(newRx);
  };

  // Toggle alarm taken handler
  const handleToggleAlarm = (id: string) => {
    const updated = alarms.map(al => {
      if (al.id === id) {
        const nextState = !al.takenToday;
        if (nextState) {
          AiMedicalService.playChime('success');
          showToast(t.alarmTakenNotification);
        }
        return {
          ...al,
          takenToday: nextState,
          streakDays: nextState ? al.streakDays + 1 : Math.max(1, al.streakDays - 1)
        };
      }
      return al;
    });

    setAlarms(updated);
    StorageService.saveAlarms(updated);
  };

  // Send Prescription to Pharmacy
  const handleSendToPharmacy = (rx: Prescription) => {
    AiMedicalService.playChime('success');
    showToast(`Prescription ${rx.id} securely forwarded to pharmacy for home delivery!`);
  };

  // Auto Add prescribed medicines to alarms
  const handleAddRxToAlarms = (rx: Prescription) => {
    AiMedicalService.playChime('success');
    const newAlarms: MedicationReminder[] = rx.medicines.map((m, idx) => ({
      id: `al-rx-${Date.now()}-${idx}`,
      medicineName: `${m.name} (${m.dosage})`,
      dosage: m.dosage,
      time: idx === 0 ? '08:00 AM' : idx === 1 ? '01:30 PM' : '09:00 PM',
      frequency: m.frequency,
      takenToday: false,
      streakDays: 1,
      notes: m.instructions
    }));

    const merged = [...newAlarms, ...alarms];
    setAlarms(merged);
    StorageService.saveAlarms(merged);
    showToast(`Added ${newAlarms.length} medicines to your reminder alarms!`);
  };

  // Bed status update (Admin View)
  const handleUpdateBedStatus = (bedId: string, status: HospitalBed['status']) => {
    const updated = beds.map(b => b.id === bedId ? { ...b, status } : b);
    setBeds(updated);
    StorageService.saveBeds(updated);
    showToast(`Bed status updated to ${status}`);
  };

  // Determine current active doctor profile for Doctor View
  const activeDoctorProfile: Doctor = (currentUser?.doctorDetails as Doctor) || doctors[0] || {
    id: currentUser?.id || 'doc-1',
    name: currentUser?.name || 'Dr. Medical Practitioner',
    specialty: currentUser?.specialty || 'General Medicine',
    department: 'Outpatient Clinical Department',
    experience: 12,
    rating: 4.9,
    reviewsCount: 15,
    consultationFee: 700,
    location: 'Clinical Consulting Room 102',
    hospital: 'HealthPulse Super Specialty Hospital',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availability: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    about: 'Consultant physician specializing in primary healthcare and clinical management.',
    qualifications: 'MBBS, MD',
    regNumber: 'MCI-REG-VALID',
    isOnline: true
  };

  // ---------------------------------------------------------------------------
  // IF USER IS NOT LOGGED IN -> RENDER DEDICATED 3-ROLE AUTHENTICATION PAGE
  // ---------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <AuthPage
        language={language}
        onLanguageChange={handleLanguageChange}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Navigation Items according to role
  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: Activity },
    { id: 'knowledge-base', label: t.navKnowledgeBase, icon: BookOpen },
    { id: 'ai-bot', label: t.navAiDoctor, icon: Bot, badge: 'AI' },
    { id: 'prescriptions', label: t.navPrescriptions, icon: FileText },
    { id: 'alarms', label: t.navMedAlarms, icon: BellRing },
    ...(userRole === 'admin' ? [{ id: 'admin', label: t.navBedManagement, icon: Building2 }] : [])
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 border border-slate-700 animate-bounce print:hidden">
          <Bell className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* HEADER NAVBAR */}
      <Navbar
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        userRole={userRole}
        onRoleChange={handleRoleChange}
        userName={currentUser.name}
        onEmergencyClick={() => setShowEmergencyModal(true)}
        onRadiologyClick={() => setShowRadiologyModal(true)}
        onSignOut={handleSignOut}
      />

      {/* MAIN CONTAINER */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-4 gap-6 print:block print:p-0">
        
        {/* SIDEBAR NAVIGATION - HIDDEN DURING PRINT */}
        <aside className="md:col-span-1 space-y-4 print:hidden">
          
          {/* Active User Demographic Profile Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 leading-tight">{currentUser.name}</h3>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-0.5 uppercase tracking-wider">
                  {t[currentUser.role === 'patient' ? 'rolePatient' : currentUser.role === 'doctor' ? 'roleDoctor' : 'roleAdmin']} {t.accountType}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 space-y-1">
              <div>{t.emailLabel}: <strong className="text-slate-700">{currentUser.email}</strong></div>
              <div>{t.phoneLabel}: <strong className="text-slate-700">{currentUser.phone || '+91 98400 12345'}</strong></div>
              {currentUser.role === 'patient' && (
                <div>{t.bloodLabel}: <strong className="text-red-600">{currentUser.bloodGroup || 'O+'}</strong> • {t.ageLabel}: <strong>{currentUser.age || 28}</strong></div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="bg-white p-2.5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    AiMedicalService.playChime('click');
                    setActiveTab(item.id as any);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Emergency Call Box */}
          <div className="bg-gradient-to-br from-red-600 to-rose-700 text-white p-5 rounded-3xl shadow-lg space-y-2">
            <div className="flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span className="font-extrabold text-xs uppercase tracking-wider">{t.emergency247}</span>
            </div>
            <p className="text-[11px] text-red-100">
              {t.emergencyDial}
            </p>
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="w-full py-2 bg-white text-red-700 hover:bg-red-50 rounded-xl font-black text-xs shadow transition mt-1 cursor-pointer"
            >
              {t.actionDispatchAmbulance}
            </button>
          </div>

        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="md:col-span-3 space-y-6 print:col-span-4 print:p-0">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {userRole === 'patient' && (
                <PatientDashboard
                  user={currentUser}
                  language={language}
                  doctors={doctors}
                  appointments={appointments}
                  prescriptions={prescriptions}
                  alarms={alarms}
                  labReports={labReports}
                  onStartVideoCall={apt => setActiveVideoCall(apt)}
                  onBookDoctor={handleBookDoctor}
                  onViewPrescription={rx => setViewingPrescription(rx)}
                  onToggleAlarm={handleToggleAlarm}
                  onOpenAlarmsModal={() => setShowAlarmsModal(true)}
                  onOpenLabsModal={() => setShowLabsModal(true)}
                  onOpenAiBot={() => setActiveTab('ai-bot')}
                  onOpenKnowledgeBase={() => setActiveTab('knowledge-base')}
                />
              )}

              {userRole === 'doctor' && (
                <DoctorDashboard
                  doctor={activeDoctorProfile}
                  language={language}
                  appointments={appointments}
                  prescriptions={prescriptions}
                  onStartVideoCall={apt => setActiveVideoCall(apt)}
                  onOpenIssuePrescription={(patientName, aptId) => {
                    setSelectedPatientForRx(patientName || 'Registered Patient');
                    setSelectedAptIdForRx(aptId);
                    setShowIssuePrescriptionModal(true);
                  }}
                  onViewPrescription={rx => setViewingPrescription(rx)}
                  onCompleteAppointment={aptId => {
                    StorageService.updateAppointmentStatus(aptId, 'completed');
                    setAppointments(StorageService.getAppointments());
                    showToast('Appointment completed.');
                  }}
                  onOpenRadiology={() => setShowRadiologyModal(true)}
                />
              )}

              {userRole === 'admin' && (
                <AdminDashboard
                  beds={beds}
                  invoices={invoices}
                  doctors={doctors}
                  language={language}
                  onUpdateBedStatus={handleUpdateBedStatus}
                />
              )}
            </>
          )}

          {/* TAB: DISEASE KNOWLEDGE BASE */}
          {activeTab === 'knowledge-base' && (
            <DiseaseKnowledgeBase
              language={language}
              onSelectSpecialist={spec => {
                showToast(`Filtered specialists for ${spec}`);
                setActiveTab('dashboard');
              }}
              onAskAi={query => {
                setAiExternalQuery(query);
                setActiveTab('ai-bot');
              }}
            />
          )}

          {/* TAB: AI BOT & SMART TRIAGE */}
          {activeTab === 'ai-bot' && (
            <AiMedicalBot
              language={language}
              onBookSpecialist={spec => {
                showToast(`Matching you with available ${spec}...`);
                setActiveTab('dashboard');
              }}
              onEmergencyTrigger={() => setShowEmergencyModal(true)}
              externalQuery={aiExternalQuery}
              onClearExternalQuery={() => setAiExternalQuery(null)}
            />
          )}

          {/* TAB: E-PRESCRIPTIONS */}
          {activeTab === 'prescriptions' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">{t.navPrescriptions}</h2>
                  <p className="text-xs text-slate-500">
                    {t.prescriptionsSubtitle}
                  </p>
                </div>

                {userRole === 'doctor' && (
                  <button
                    onClick={() => {
                      setSelectedPatientForRx('Patient Name');
                      setShowIssuePrescriptionModal(true);
                    }}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow transition cursor-pointer"
                  >
                    + {t.actionIssuePrescription}
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {prescriptions.length === 0 ? (
                  <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-sm text-slate-700">{t.vaultTitle}</p>
                    <p className="text-xs text-slate-400 mt-1">{t.vaultSubtitle}</p>
                  </div>
                ) : (
                  prescriptions.map(rx => (
                    <div
                      key={rx.id}
                      className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition hover:bg-slate-100/60"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {rx.id}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{rx.diagnosis}</span>
                        </div>
                        <div className="text-xs text-slate-600">
                          {t.rolePatient}: <strong>{rx.patientName}</strong> • {t.thPhysician}: <strong>{rx.doctorName}</strong> ({rx.doctorSpecialty})
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {t.thDate}: {rx.date} • {t.drugsLabel}: {rx.medicines.map(m => m.name).join(', ')}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                        <button
                          onClick={() => setViewingPrescription(rx)}
                          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{t.actionPrintPdf}</span>
                        </button>

                        <button
                          onClick={() => handleSendToPharmacy(rx)}
                          className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-1 cursor-pointer"
                          title="Send to Pharmacy"
                        >
                          <span>{t.orderRx}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: ALARMS */}
          {activeTab === 'alarms' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">{t.navMedAlarms}</h2>
                  <p className="text-xs text-slate-500">{t.alarmSubtitle}</p>
                </div>
                <button
                  onClick={() => setShowAlarmsModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  {t.openAlarmManager}
                </button>
              </div>

              {alarms.length === 0 ? (
                <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <BellRing className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-sm text-slate-700">{t.noActiveAlarms}</p>
                  <button
                    onClick={() => setShowAlarmsModal(true)}
                    className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    {t.addFirstAlarm}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {alarms.map(alarm => (
                    <div key={alarm.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-slate-900">{alarm.medicineName}</div>
                        <div className="text-xs text-slate-500">{alarm.dosage} {t.atTime} {alarm.time}</div>
                        <div className="text-[10px] text-amber-600 font-bold mt-1">{t.streak}: {alarm.streakDays} {t.daysUnit}</div>
                      </div>
                      <button
                        onClick={() => handleToggleAlarm(alarm.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                          alarm.takenToday ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {alarm.takenToday ? t.takenCheck : t.actionMarkTaken}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ADMIN (BED MANAGEMENT) */}
          {activeTab === 'admin' && (
            <AdminDashboard
              beds={beds}
              invoices={invoices}
              doctors={doctors}
              language={language}
              onUpdateBedStatus={handleUpdateBedStatus}
            />
          )}

        </main>
      </div>

      {/* ===================================================================== */}
      {/* MODAL DIALOGS                                                         */}
      {/* ===================================================================== */}

      {/* 1. PRINTABLE PRESCRIPTION MODAL */}
      {viewingPrescription && (
        <PrescriptionModal
          prescription={viewingPrescription}
          language={language}
          onClose={() => setViewingPrescription(null)}
          onSendToPharmacy={handleSendToPharmacy}
          onAddToAlarms={handleAddRxToAlarms}
        />
      )}

      {/* 2. ISSUE PRESCRIPTION MODAL (DOCTOR) */}
      {showIssuePrescriptionModal && (
        <IssuePrescriptionModal
          doctor={activeDoctorProfile}
          language={language}
          defaultPatientName={selectedPatientForRx}
          defaultAppointmentId={selectedAptIdForRx}
          onClose={() => setShowIssuePrescriptionModal(false)}
          onSavePrescription={handleSavePrescription}
        />
      )}

      {/* 3. TELEHEALTH HD VIDEO ROOM */}
      {activeVideoCall && (
        <TelehealthRoom
          appointment={activeVideoCall}
          language={language}
          onClose={() => setActiveVideoCall(null)}
          onOpenPrescriptionWriter={() => {
            setSelectedPatientForRx(activeVideoCall.patientName);
            setSelectedAptIdForRx(activeVideoCall.id);
            setShowIssuePrescriptionModal(true);
          }}
        />
      )}

      {/* 4. MEDICATION ALARMS MODAL */}
      {showAlarmsModal && (
        <MedicationAlarmsModal
          alarms={alarms}
          language={language}
          currentUser={currentUser}
          onClose={() => setShowAlarmsModal(false)}
          onToggleTaken={handleToggleAlarm}
          onAddAlarm={newAl => {
            const merged = [newAl, ...alarms];
            setAlarms(merged);
            StorageService.saveAlarms(merged);
          }}
          onDeleteAlarm={id => {
            const filtered = alarms.filter(a => a.id !== id);
            setAlarms(filtered);
            StorageService.saveAlarms(filtered);
          }}
          onUpdateUser={updated => {
            setCurrentUser(updated);
            StorageService.updateUserProfile(updated);
          }}
        />
      )}

      {/* 5. EMERGENCY SOS MODAL */}
      {showEmergencyModal && (
        <EmergencyModal
          language={language}
          onClose={() => setShowEmergencyModal(false)}
        />
      )}

      {/* 6. DIAGNOSTIC LAB REPORTS MODAL */}
      {showLabsModal && (
        <LabReportsModal
          reports={labReports}
          language={language}
          onClose={() => setShowLabsModal(false)}
        />
      )}

      {/* 7. AI RADIOLOGY & DIAGNOSTIC SCAN VIEWER MODAL */}
      {showRadiologyModal && (
        <RadiologyViewerModal
          language={language}
          onClose={() => setShowRadiologyModal(false)}
          onAttachToChart={findings => showToast(findings)}
        />
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 px-4 text-center text-xs space-y-2 mt-auto print:hidden">
        <div className="flex items-center justify-center space-x-2">
          <Activity className="w-4 h-4 text-blue-500" />
          <span className="font-bold text-white">{t.brandName}</span>
        </div>
        <p className="text-[11px] text-slate-500">
          {t.footerCompliance}
        </p>
      </footer>

    </div>
  );
}
