import React, { useState, useEffect } from 'react';
import { Activity, PhoneCall, Globe, LogOut, X } from 'lucide-react';
import { Login } from './components/Login';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { translations, Language } from './translations';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  specialization?: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  rating: number;
  fee: number;
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
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  queuePosition: number;
  estimatedWaitMins: number;
  attachedFile?: string;
}

const DEFAULT_DOCTORS: Doctor[] = [
  { id: 'doc_1', name: 'Dr. Robert Chen', email: 'robert@healthpulse.com', specialization: 'Cardiology', rating: 4.9, fee: 80 },
  { id: 'doc_2', name: 'Dr. Emily Watson', email: 'emily@healthpulse.com', specialization: 'Neurology', rating: 4.8, fee: 95 },
  { id: 'doc_3', name: 'Dr. Marcus Vance', email: 'marcus@healthpulse.com', specialization: 'General Medicine', rating: 5.0, fee: 50 },
];

export const App: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [language, setLanguage] = useState<Language>('TA');

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    try {
      const saved = localStorage.getItem('hp_doctors');
      return saved ? JSON.parse(saved) : DEFAULT_DOCTORS;
    } catch {
      return DEFAULT_DOCTORS;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('hp_appointments');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'apt_101',
              patientId: 'usr_patient_1',
              patientName: 'Kishore',
              doctorId: 'doc_1',
              doctorName: 'Dr. Robert Chen',
              doctorSpecialty: 'Cardiology',
              date: new Date().toISOString().split('T')[0],
              time: '10:30 AM',
              symptoms: 'High Fever / Flu - Sore throat and headache',
              status: 'CONFIRMED',
              queuePosition: 2,
              estimatedWaitMins: 12,
              attachedFile: 'Blood_Test_Report.pdf',
            },
          ];
    } catch {
      return [];
    }
  });

  const t = translations[language] || {};

  useEffect(() => {
    localStorage.setItem('hp_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('hp_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLoginSuccess = (userData: UserData, authToken: string) => {
    setUser(userData);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));

    if (userData.role === 'DOCTOR') {
      const exists = doctors.some((d) => d.email === userData.email || d.id === userData.id);
      if (!exists) {
        const newDoc: Doctor = {
          id: userData.id || `doc_${Date.now()}`,
          name: userData.name.startsWith('Dr.') ? userData.name : `Dr. ${userData.name}`,
          email: userData.email,
          specialization: userData.specialization || 'General Medicine',
          rating: 5.0,
          fee: 60,
        };
        setDoctors((prev) => [...prev, newDoc]);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20">
              <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              HealthPulse
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap ml-auto">
            {/* Language Dropdown */}
            <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 shrink-0">
              <Globe className="w-4 h-4 text-slate-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent border-none text-xs font-bold focus:outline-none cursor-pointer pr-1"
              >
                <option value="TA">TA (தமிழ்)</option>
                <option value="EN">EN (English)</option>
                <option value="HI">HI (हिंदी)</option>
                <option value="ES">ES (Español)</option>
                <option value="FR">FR (Français)</option>
              </select>
            </div>

            {/* Emergency Support Button */}
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>{t.emergencySupport || 'Emergency Support'}</span>
            </button>

            {/* User Profile & Sign Out Button */}
            {user && (
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 shrink-0">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs text-white ${
                      user.role === 'DOCTOR' ? 'bg-emerald-600' : 'bg-blue-600'
                    }`}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                    <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wide">
                      {user.role === 'DOCTOR' ? t.roleDoctor || 'Doctor' : t.rolePatient || 'Patient'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.signOut || 'Sign Out'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* DASHBOARD CONTAINER */}
      <main className="flex-1">
        {!user ? (
          <Login onLoginSuccess={handleLoginSuccess} language={language} />
        ) : user.role === 'DOCTOR' ? (
          <DoctorDashboard
            user={user}
            language={language}
            appointments={appointments}
            setAppointments={setAppointments}
          />
        ) : (
          <PatientDashboard
            user={user}
            language={language}
            doctors={doctors}
            appointments={appointments}
            setAppointments={setAppointments}
          />
        )}
      </main>

      {/* EMERGENCY MODAL */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-sm w-full text-slate-900 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base flex items-center gap-2 text-red-600">
                <PhoneCall className="w-5 h-5 text-red-500 animate-pulse" />
                {t.emergencySupport || 'Emergency Support'}
              </h3>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-900 space-y-2 font-medium">
              <p className="flex items-center gap-2">
                <span>🚑</span>
                <span>
                  <strong>Hospital Hotline:</strong> 108 / 112
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span>📞</span>
                <span>
                  <strong>Care Center:</strong> +1 (800) 555-0199
                </span>
              </p>
            </div>
            <button
              onClick={() => setShowEmergencyModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;