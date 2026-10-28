import React, { useState } from 'react';
import { 
  Activity, User, Stethoscope, Building2, 
  Lock, Mail, Phone, 
  ArrowRight, ShieldCheck, Eye, EyeOff, Users, Bell 
} from 'lucide-react';
import { UserRole, Language, User as UserType, Doctor } from '../types';
import { StorageService } from '../services/storageService';
import { AiMedicalService } from '../services/aiMedicalService';
import { translations } from '../translations';
import { LanguageSelector } from './LanguageSelector';

interface AuthPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: (user: UserType) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  language,
  onLanguageChange,
  onLoginSuccess
}) => {
  const t = translations[language] || translations.en;

  // Selected Role Tab: 'patient' | 'doctor' | 'admin'
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Common Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Patient Fields
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [allergies, setAllergies] = useState('None');
  const [guardianName, setGuardianName] = useState('Sarah Morgan (Caregiver)');
  const [guardianPhone, setGuardianPhone] = useState('+91 98765 43211');

  // Doctor Fields
  const [specialty, setSpecialty] = useState('General Medicine');
  const [qualifications, setQualifications] = useState('MBBS, MD');
  const [regNumber, setRegNumber] = useState('MCI-2026-4412');
  const [hospital, setHospital] = useState('HealthPulse Super Specialty Hospital');
  const [experience, setExperience] = useState<number>(10);
  const [consultationFee, setConsultationFee] = useState<number>(700);

  // Admin Fields
  const [hospitalName, setHospitalName] = useState('HealthPulse Super Specialty Hospital');
  const [adminSecurityPin, setAdminSecurityPin] = useState('ADMIN2026');

  const specialtyOptions = [
    { value: 'Cardiologist', label: t.specCardiologist },
    { value: 'Neurologist', label: t.specNeurologist },
    { value: 'General Physician', label: t.specGeneralPhysician },
    { value: 'Pulmonologist', label: t.specPulmonologist },
    { value: 'Dermatologist', label: t.specDermatologist },
    { value: 'Orthopedic Surgeon', label: t.specOrthopedic },
    { value: 'Pediatrician', label: t.specPediatrician },
    { value: 'Gastroenterologist', label: t.specGastroenterologist }
  ];

  // Handle Quick Demo Account fill
  const handleQuickFill = (role: UserRole) => {
    AiMedicalService.playChime('click');
    setSelectedRole(role);
    setIsRegisterMode(false);
    setErrorMsg(null);

    if (role === 'patient') {
      setEmail('patient@healthpulse.com');
      setPassword('password123');
      setName('Fawwaaz');
      setPhone('9345288654');
      setGuardianName('Kishore (Guardian)');
      setGuardianPhone('9488634916');
    } else if (role === 'doctor') {
      setEmail('doctor@healthpulse.com');
      setPassword('password123');
    } else {
      setEmail('admin@healthpulse.com');
      setPassword('password123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isRegisterMode) {
      // REGISTER FLOW
      if (!name.trim() || !email.trim() || !password.trim()) {
        setErrorMsg(t.authFillRequired);
        return;
      }

      let newUser: UserType;

      if (selectedRole === 'patient') {
        newUser = {
          id: `pat-${Date.now()}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role: 'patient',
          phone: phone.trim() || '+91 98400 12345',
          guardianName: guardianName.trim() || 'Sarah Morgan (Caregiver)',
          guardianPhone: guardianPhone.trim() || '+91 98765 43211',
          age: Number(age) || 28,
          gender,
          bloodGroup,
          allergies: allergies.split(',').map(a => a.trim()).filter(Boolean)
        };
      } else if (selectedRole === 'doctor') {
        const formattedDocName = name.startsWith('Dr.') ? name.trim() : `Dr. ${name.trim()}`;
        const docObj: Doctor = {
          id: `doc-${Date.now()}`,
          name: formattedDocName,
          specialty,
          department: `${specialty} Department`,
          experience: Number(experience) || 5,
          rating: 4.9,
          reviewsCount: 1,
          consultationFee: Number(consultationFee) || 500,
          location: 'OPD Consultation Wing',
          hospital: hospital || 'HealthPulse Super Specialty Hospital',
          availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          availability: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
          image: gender === 'Female' 
            ? 'https://images.unsplash.com/photo-1594824813566-88855ce78341?auto=format&fit=crop&q=80&w=400' 
            : 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
          about: `${specialty} Specialist with ${experience} years of clinical practice.`,
          qualifications: qualifications || 'MBBS, MD',
          regNumber: regNumber || 'MCI-REG-VALID',
          isOnline: true
        };

        newUser = {
          id: docObj.id,
          name: formattedDocName,
          email: email.trim().toLowerCase(),
          password,
          role: 'doctor',
          phone: phone || '+91 98000 11111',
          specialty,
          doctorDetails: docObj
        };
      } else {
        // ADMIN
        if (!adminSecurityPin.trim()) {
          setErrorMsg(t.authEnterAdminKey);
          return;
        }
        newUser = {
          id: `adm-${Date.now()}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role: 'admin',
          phone: phone || '+91 98000 22222',
          hospitalName: hospitalName || 'HealthPulse Super Specialty Hospital'
        };
      }

      const res = StorageService.registerUser(newUser);
      if (!res.success) {
        setErrorMsg(res.message);
        return;
      }

      AiMedicalService.playChime('success');
      onLoginSuccess(newUser);
    } else {
      // LOGIN FLOW
      if (!email.trim() || !password.trim()) {
        setErrorMsg(t.authEnterBoth);
        return;
      }

      const res = StorageService.loginUser(email, password, selectedRole);
      if (!res.success || !res.user) {
        setErrorMsg(res.message);
        return;
      }

      AiMedicalService.playChime('success');
      onLoginSuccess(res.user);
    }
  };

  const getRoleLabel = (role: UserRole) => {
    if (role === 'patient') return t.authPatientTab;
    if (role === 'doctor') return t.authDoctorTab;
    return t.authAdminTab;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between font-sans relative overflow-hidden">
      
      {/* BACKGROUND DECORATIVE ELEMENTS */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* TOP HEADER WITH LANGUAGE TOGGLE */}
      <header className="p-4 sm:p-6 flex justify-between items-center max-w-7xl w-full mx-auto relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Activity className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Health<span className="text-blue-400">Pulse</span> Ultra
            </span>
            <span className="ml-2 text-[10px] font-black uppercase bg-blue-500/20 text-blue-400 border border-blue-400/30 px-2 py-0.5 rounded-full">
              Enterprise HMS
            </span>
          </div>
        </div>

        {/* Luxury Language Selector */}
        <LanguageSelector
          currentLanguage={language}
          onLanguageChange={onLanguageChange}
          variant="glass"
        />
      </header>

      {/* MAIN AUTH CARD */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          
          {/* Brand Titles */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {isRegisterMode ? t.authCreateTitle : t.authWelcomeTitle}
            </h1>
            <p className="text-xs text-slate-400">
              {t.authSubtitle}
            </p>
          </div>

          {/* 3-ROLE SEPARATE SELECTOR TABS */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            {/* Patient Tab */}
            <button
              type="button"
              onClick={() => {
                AiMedicalService.playChime('click');
                setSelectedRole('patient');
                setErrorMsg(null);
              }}
              className={`py-3 px-2 rounded-xl text-xs font-extrabold transition flex flex-col items-center space-y-1 cursor-pointer ${
                selectedRole === 'patient'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{t.authPatientTab}</span>
            </button>

            {/* Doctor Tab */}
            <button
              type="button"
              onClick={() => {
                AiMedicalService.playChime('click');
                setSelectedRole('doctor');
                setErrorMsg(null);
              }}
              className={`py-3 px-2 rounded-xl text-xs font-extrabold transition flex flex-col items-center space-y-1 cursor-pointer ${
                selectedRole === 'doctor'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>{t.authDoctorTab}</span>
            </button>

            {/* Hospital Admin Tab */}
            <button
              type="button"
              onClick={() => {
                AiMedicalService.playChime('click');
                setSelectedRole('admin');
                setErrorMsg(null);
              }}
              className={`py-3 px-2 rounded-xl text-xs font-extrabold transition flex flex-col items-center space-y-1 cursor-pointer ${
                selectedRole === 'admin'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-purple-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{t.authAdminTab}</span>
            </button>
          </div>

          {/* Quick Demo Credentials Autofill Banner */}
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>{t.authQuickFill}</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('patient')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 hover:text-white rounded-lg font-bold text-slate-300 transition cursor-pointer"
              >
                {t.authPatientTab}
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('doctor')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-lg font-bold text-slate-300 transition cursor-pointer"
              >
                {t.authDoctorTab}
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-purple-600 hover:text-white rounded-lg font-bold text-slate-300 transition cursor-pointer"
              >
                {t.authAdminTab}
              </button>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs font-bold flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* AUTH FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Common: Name (Only in Register Mode) */}
            {isRegisterMode && (
              <div>
                <label className="text-slate-300 font-bold block mb-1">
                  {selectedRole === 'doctor' ? t.authDoctorName : t.authFullName}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={selectedRole === 'doctor' ? t.authDoctorNamePlaceholder : t.authFullNamePlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Common: Email */}
            <div>
              <label className="text-slate-300 font-bold block mb-1">
                {selectedRole === 'admin' ? t.authAdminEmail : t.authEmail}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t.authEmailPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Common: Password */}
            <div>
              <label className="text-slate-300 font-bold block mb-1">{t.authPassword}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* ROLE-SPECIFIC REGISTRATION FIELDS */}
            {isRegisterMode && (
              <>
                {/* Phone */}
                <div>
                  <label className="text-slate-300 font-bold block mb-1">{t.authPhone}</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Patient Role Specifics */}
                {selectedRole === 'patient' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="text-slate-400 font-bold block mb-1 text-[11px]">{t.authAge}</label>
                      <input
                        type="number"
                        min={1}
                        max={120}
                        value={age}
                        onChange={e => setAge(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-bold block mb-1 text-[11px]">{t.authGender}</label>
                      <select
                        value={gender}
                        onChange={e => setGender(e.target.value as any)}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                      >
                        <option value="Male">{t.genderMale}</option>
                        <option value="Female">{t.genderFemale}</option>
                        <option value="Other">{t.genderOther}</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 font-bold block mb-1 text-[11px]">{t.authBloodGroup}</label>
                      <select
                        value={bloodGroup}
                        onChange={e => setBloodGroup(e.target.value)}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-3">
                      <label className="text-slate-400 font-bold block mb-1 text-[11px]">{t.authAllergies}</label>
                      <input
                        type="text"
                        value={allergies}
                        onChange={e => setAllergies(e.target.value)}
                        placeholder={t.authAllergiesPlaceholder}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>

                    {/* Guardian / Emergency Contact Information for Medication Alarms */}
                    <div className="col-span-2 sm:col-span-3 pt-3 border-t border-slate-800">
                      <div className="flex items-center space-x-1.5 text-blue-400 font-extrabold text-xs mb-2">
                        <Users className="w-3.5 h-3.5" />
                        <span>{t.authGuardianName} &amp; Dual SMS Dispatch</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-400 font-bold block mb-1 text-[11px]">{t.authGuardianName}</label>
                          <input
                            type="text"
                            value={guardianName}
                            onChange={e => setGuardianName(e.target.value)}
                            placeholder={t.authGuardianNamePlaceholder}
                            className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 font-bold block mb-1 text-[11px]">{t.authGuardianPhone}</label>
                          <div className="relative">
                            <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                            <input
                              type="tel"
                              value={guardianPhone}
                              onChange={e => setGuardianPhone(e.target.value)}
                              placeholder={t.authGuardianPhonePlaceholder}
                              className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-2.5 p-2.5 bg-blue-950/40 border border-blue-800/40 rounded-xl text-[11px] text-blue-300 flex items-start space-x-2">
                        <Bell className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>{t.authGuardianPhoneHelp}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Doctor Role Specifics */}
                {selectedRole === 'doctor' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-slate-400 font-bold block mb-1 text-[11px]">{t.authSpecialty}</label>
                      <select
                        value={specialty}
                        onChange={e => setSpecialty(e.target.value)}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                      >
                        {specialtyOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 font-bold block mb-1 text-[11px]">{t.authQualifications}</label>
                      <input
                        type="text"
                        value={qualifications}
                        onChange={e => setQualifications(e.target.value)}
                        placeholder="e.g. MBBS, MD (Cardio)"
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-bold block mb-1 text-[11px]">{t.authLicense}</label>
                      <input
                        type="text"
                        value={regNumber}
                        onChange={e => setRegNumber(e.target.value)}
                        placeholder="e.g. MCI-TN-2024-991"
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-bold block mb-1 text-[11px]">{t.authExperience}</label>
                      <input
                        type="number"
                        min={0}
                        max={60}
                        value={experience}
                        onChange={e => setExperience(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-bold block mb-1 text-[11px]">{t.authFee}</label>
                      <input
                        type="number"
                        value={consultationFee}
                        onChange={e => setConsultationFee(Number(e.target.value))}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-slate-400 font-bold block mb-1 text-[11px]">{t.authHospitalAffiliation}</label>
                      <input
                        type="text"
                        value={hospital}
                        onChange={e => setHospital(e.target.value)}
                        placeholder="HealthPulse Super Specialty Hospital"
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Admin Role Specifics */}
                {selectedRole === 'admin' && (
                  <div className="grid grid-cols-1 gap-3 pt-1">
                    <div>
                      <label className="text-slate-400 font-bold block mb-1 text-[11px]">{t.authHospitalFacility}</label>
                      <input
                        type="text"
                        value={hospitalName}
                        onChange={e => setHospitalName(e.target.value)}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-bold block mb-1 text-[11px]">{t.authSecurityKey}</label>
                      <input
                        type="text"
                        value={adminSecurityPin}
                        onChange={e => setAdminSecurityPin(e.target.value)}
                        placeholder="ADMIN2026"
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              className={`w-full py-3.5 text-white font-extrabold rounded-2xl shadow-xl transition transform active:scale-95 flex items-center justify-center space-x-2 text-sm cursor-pointer mt-4 ${
                selectedRole === 'doctor'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  : selectedRole === 'admin'
                  ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
              }`}
            >
              <span>
                {isRegisterMode 
                  ? `${t.authRegisterBtn} ${getRoleLabel(selectedRole)}` 
                  : `${t.authSignInBtn} ${getRoleLabel(selectedRole)} ${t.authPortalSuffix}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
            {isRegisterMode ? (
              <span>
                {t.authHaveAccount}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setErrorMsg(null);
                  }}
                  className="font-bold text-blue-400 hover:underline cursor-pointer ml-1"
                >
                  {t.authSignInLink}
                </button>
              </span>
            ) : (
              <span>
                {t.authNeedAccount}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setErrorMsg(null);
                  }}
                  className="font-bold text-blue-400 hover:underline cursor-pointer ml-1"
                >
                  {t.authCreateLink}
                </button>
              </span>
            )}
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="p-4 text-center text-xs text-slate-500 border-t border-slate-900 relative z-10">
        {t.authComplianceFooter}
      </footer>

    </div>
  );
};
