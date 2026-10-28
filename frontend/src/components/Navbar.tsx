import React, { useState, useRef, useEffect } from 'react';
import { 
  Activity, PhoneCall, LogOut, 
  ShieldCheck, ChevronDown, Scan, Check
} from 'lucide-react';
import { Language, UserRole } from '../types';
import { translations } from '../translations';
import { AiMedicalService } from '../services/aiMedicalService';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  userName: string;
  onEmergencyClick: () => void;
  onRadiologyClick?: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  userRole,
  onRoleChange,
  userName,
  onEmergencyClick,
  onRadiologyClick,
  onSignOut,
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const roleMenuRef = useRef<HTMLDivElement>(null);

  // Click Outside to Dismiss Role Switcher Menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setRoleMenuOpen(false);
      }
    };
    if (roleMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [roleMenuOpen]);

  const roles: { id: UserRole; label: string; desc: string; dotColor: string }[] = [
    {
      id: 'patient',
      label: t.rolePatient,
      desc: 'Health Records, Prescriptions, ABHA & Alarms',
      dotColor: 'bg-blue-400'
    },
    {
      id: 'doctor',
      label: t.roleDoctor,
      desc: 'OPD Queue, E-Prescriptions & AI Voice Scribe',
      dotColor: 'bg-emerald-400'
    },
    {
      id: 'admin',
      label: t.roleAdmin,
      desc: 'Bed Telemetry, ICU Monitor & Billing Center',
      dotColor: 'bg-purple-400'
    }
  ];

  return (
    <header className="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-40 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* LOGO & BRAND */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Activity className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight text-white">
                Health<span className="text-blue-400">Pulse</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 px-2 py-0.5 rounded-full shadow-sm">
                ULTRA PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              {t.brandTagline}
            </p>
          </div>
        </div>

        {/* TOP-RIGHT CONTROLS TOOLBAR */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          
          {/* 1. AI RADIOLOGY VIEWER BUTTON */}
          {onRadiologyClick && (
            <button
              onClick={() => {
                AiMedicalService.playChime('click');
                onRadiologyClick();
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 hover:border-cyan-500/50 text-cyan-300 text-xs font-semibold rounded-xl shadow-sm transition active:scale-95 cursor-pointer backdrop-blur-md"
              title="Diagnostic Imaging & Radiology AI Heatmap Viewer"
            >
              <Scan className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline font-bold">AI Radiology</span>
            </button>
          )}

          {/* 2. EMERGENCY SOS BUTTON (REFINED ENTERPRISE STYLE) */}
          <button
            onClick={() => {
              AiMedicalService.playChime('click');
              onEmergencyClick();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 hover:border-rose-400/60 text-rose-300 hover:text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95 cursor-pointer"
            title="24/7 Immediate Emergency Dispatch Hotline"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline font-extrabold">{t.emergencySOS}</span>
          </button>

          {/* 3. LUXURY 4-LANGUAGE SELECTOR (HIGH-DEF VECTOR FLAGS & NATIVE SCRIPTS) */}
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
            variant="glass"
          />

          {/* 4. ROLE SWITCHER DROPDOWN */}
          <div ref={roleMenuRef} className="relative">
            <button
              onClick={() => {
                AiMedicalService.playChime('click');
                setRoleMenuOpen(!roleMenuOpen);
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-150 cursor-pointer bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 border-slate-700/80 hover:border-slate-600 shadow-sm backdrop-blur-md ${
                roleMenuOpen ? 'ring-2 ring-blue-500/50 border-blue-400' : ''
              }`}
              title="Switch Portal Role"
            >
              <span className={`w-2 h-2 rounded-full ${
                userRole === 'doctor' ? 'bg-emerald-400 shadow-emerald-400/50 shadow-sm' :
                userRole === 'admin' ? 'bg-purple-400 shadow-purple-400/50 shadow-sm' :
                'bg-blue-400 shadow-blue-400/50 shadow-sm'
              }`} />
              <span className="capitalize">{t[userRole === 'patient' ? 'rolePatient' : userRole === 'doctor' ? 'roleDoctor' : 'roleAdmin']}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${roleMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/90 rounded-2xl shadow-2xl p-1.5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right text-xs">
                <div className="px-3 py-2 border-b border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400 flex justify-between items-center">
                  <span>{t.switchRole}</span>
                  <span className="text-cyan-400 font-mono">Multi-Portal</span>
                </div>
                
                <div className="py-1 space-y-0.5">
                  {roles.map(r => {
                    const isCurrent = userRole === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          AiMedicalService.playChime('click');
                          onRoleChange(r.id);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl font-medium flex items-center justify-between transition duration-150 cursor-pointer ${
                          isCurrent
                            ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-900/40'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${r.dotColor} flex-shrink-0`} />
                          <div>
                            <div className="font-bold text-xs capitalize text-white">
                              {r.label}
                            </div>
                            <div className={`text-[10px] line-clamp-1 ${isCurrent ? 'text-blue-100' : 'text-slate-400'}`}>
                              {r.desc}
                            </div>
                          </div>
                        </div>

                        {isCurrent && (
                          <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 ml-2">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 5. USER DEMOGRAPHIC BADGE */}
          <div className="hidden lg:flex items-center space-x-2.5 pl-2.5 border-l border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
              {userName.charAt(0)}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-200 truncate max-w-[100px]">{userName}</div>
              <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="capitalize">{userRole}</span>
              </div>
            </div>
          </div>

          {/* 6. SIGN OUT BUTTON */}
          <button
            onClick={() => {
              AiMedicalService.playChime('click');
              onSignOut();
            }}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition cursor-pointer"
            title={t.signOut}
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};