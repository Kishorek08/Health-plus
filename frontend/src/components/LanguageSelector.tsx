import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { Language } from '../types';
import { AiMedicalService } from '../services/aiMedicalService';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  className?: string;
  variant?: 'glass' | 'solid';
}

interface LanguageOption {
  code: Language;
  nativeName: string;
  englishName: string;
  region: string;
  shortCode: string;
  flagNode: React.ReactNode;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  className = '',
  variant = 'glass'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // High-Definition Vector Flags for Crisp Cross-Platform Rendering
  const FlagUK = (
    <svg viewBox="0 0 60 30" className="w-5 h-3.5 rounded-[3px] shadow-sm flex-shrink-0 object-cover">
      <clipPath id="uk-clip"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
      <clipPath id="uk-diag"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
      <g clipPath="url(#uk-clip)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-diag)" stroke="#C8102E" strokeWidth="4"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
      </g>
    </svg>
  );

  const FlagIndia = (
    <svg viewBox="0 0 60 40" className="w-5 h-3.5 rounded-[3px] shadow-sm flex-shrink-0">
      <rect width="60" height="13.33" fill="#FF9933"/>
      <rect y="13.33" width="60" height="13.34" fill="#FFFFFF"/>
      <rect y="26.67" width="60" height="13.33" fill="#138808"/>
      <circle cx="30" cy="20" r="4.2" fill="none" stroke="#000080" strokeWidth="1"/>
      <circle cx="30" cy="20" r="1.2" fill="#000080"/>
    </svg>
  );

  const FlagGermany = (
    <svg viewBox="0 0 60 36" className="w-5 h-3.5 rounded-[3px] shadow-sm flex-shrink-0">
      <rect width="60" height="12" fill="#000000"/>
      <rect y="12" width="60" height="12" fill="#DD0000"/>
      <rect y="24" width="60" height="12" fill="#FFCC00"/>
    </svg>
  );

  const languages: LanguageOption[] = [
    {
      code: 'en',
      nativeName: 'English',
      englishName: 'English',
      region: 'Global / US / UK',
      shortCode: 'EN',
      flagNode: FlagUK
    },
    {
      code: 'ta',
      nativeName: 'தமிழ்',
      englishName: 'Tamil',
      region: 'தமிழ்நாடு / இந்தியா',
      shortCode: 'TA',
      flagNode: FlagIndia
    },
    {
      code: 'hi',
      nativeName: 'हिन्दी',
      englishName: 'Hindi',
      region: 'भारत',
      shortCode: 'HI',
      flagNode: FlagIndia
    },
    {
      code: 'de',
      nativeName: 'Deutsch',
      englishName: 'German',
      region: 'Deutschland',
      shortCode: 'DE',
      flagNode: FlagGermany
    }
  ];

  const activeLang = languages.find(l => l.code === currentLanguage) || languages[0];

  // Click Outside to Dismiss
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    AiMedicalService.playChime('click');
    onLanguageChange(code);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => {
          AiMedicalService.playChime('click');
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`group flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500/50 ${
          variant === 'glass'
            ? 'bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 hover:border-blue-400/50 shadow-sm backdrop-blur-md'
            : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 shadow-md'
        } ${isOpen ? 'ring-2 ring-blue-500/50 border-blue-400' : ''}`}
        title="Select Interface Language"
      >
        <div className="flex items-center space-x-1.5">
          <Globe className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 transition" />
          <span className="flex items-center">{activeLang.flagNode}</span>
        </div>

        <span className="font-bold tracking-tight text-white">
          {activeLang.nativeName}
        </span>

        <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-md font-extrabold border border-blue-400/20">
          {activeLang.shortCode}
        </span>

        <ChevronDown 
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-400' : ''
          }`} 
        />
      </button>

      {/* FLOATING LUXURY DROPDOWN MENU */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-64 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/90 rounded-2xl shadow-2xl p-1.5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right text-xs"
          role="menu"
          aria-orientation="vertical"
        >
          {/* Menu Title Header */}
          <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
            <span>Choose Language</span>
            <span className="text-cyan-400 font-mono">4 Localized</span>
          </div>

          <div className="py-1 space-y-0.5">
            {languages.map(lang => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl font-medium flex items-center justify-between transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-900/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                  role="menuitem"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-0.5 bg-black/30 rounded shadow-inner flex items-center justify-center">
                      {lang.flagNode}
                    </div>

                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-extrabold text-sm leading-tight text-white">
                          {lang.nativeName}
                        </span>
                        <span className={`text-[10px] font-mono px-1 rounded ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {lang.shortCode}
                        </span>
                      </div>
                      <div className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {lang.englishName} • <span className="opacity-75">{lang.region}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Micro Footer Notice */}
          <div className="px-3 py-1.5 bg-slate-950/60 rounded-xl border border-slate-800/70 text-[10px] text-slate-400 flex items-center justify-between mt-1">
            <span>Instant Hot-Swap</span>
            <span className="text-emerald-400 font-bold">100% Translated</span>
          </div>

        </div>
      )}

    </div>
  );
};