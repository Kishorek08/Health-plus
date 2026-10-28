import React, { useState } from 'react';
import { 
  Search, ShieldAlert, Stethoscope, 
  CheckCircle, Sparkles, Volume2, BookOpen, ChevronRight, Activity 
} from 'lucide-react';
import { Disease, Language } from '../types';
import { DISEASES_DATABASE } from '../data/diseasesData';
import { translations } from '../translations';
import { AiMedicalService } from '../services/aiMedicalService';

interface DiseaseKnowledgeBaseProps {
  language: Language;
  onSelectSpecialist: (specialty: string) => void;
  onAskAi: (query: string) => void;
}

export const DiseaseKnowledgeBase: React.FC<DiseaseKnowledgeBaseProps> = ({
  language,
  onSelectSpecialist,
  onAskAi
}) => {
  const t = translations[language] || translations.en;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeDiseaseModal, setActiveDiseaseModal] = useState<Disease | null>(null);

  const categories = [
    'ALL',
    'Cardiovascular',
    'Respiratory',
    'Neurological',
    'Gastroenterology',
    'Endocrinology',
    'Infectious Disease',
    'Orthopedics',
    'Dermatology',
    'Nephrology',
    'Psychiatry',
    'Otolaryngology (ENT)',
    'Ophthalmology'
  ];

  const filteredDiseases = DISEASES_DATABASE.filter(d => {
    const matchesCategory = selectedCategory === 'ALL' || d.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.keySymptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.organSystem.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSpeak = (text: string) => {
    AiMedicalService.speakText(text, language);
  };

  return (
    <div className="space-y-6">
      
      {/* HERO BANNER */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Clinical Reference Library</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t.kbTitle}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            {t.kbSubtitle}
          </p>
        </div>

        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* SEARCH & CATEGORY FILTER BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t.kbSearchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              {t.actionCancel}
            </button>
          )}
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat === 'ALL' ? t.kbAllCategories : cat}
            </button>
          ))}
        </div>
      </div>

      {/* DISEASES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDiseases.map(disease => {
          const isEmergency = disease.severity.includes('Emergency') || disease.severity.includes('Critical');
          return (
            <div
              key={disease.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 ${
                isEmergency ? 'border-red-200 hover:border-red-400' : 'border-slate-200 hover:border-blue-400'
              }`}
            >
              <div className="space-y-3">
                {/* Header Tag & Severity Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {disease.category}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isEmergency
                      ? 'bg-red-100 text-red-700 animate-pulse'
                      : disease.severity === 'Severe'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {disease.severity}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                    {disease.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center space-x-1">
                    <Activity className="w-3 h-3 text-slate-400" />
                    <span>System: {disease.organSystem}</span>
                  </p>
                </div>

                {/* Overview */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {disease.overview}
                </p>

                {/* Key Symptoms Chips */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {t.kbKeySymptoms}:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {disease.keySymptoms.slice(0, 3).map((sym, i) => (
                      <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {sym}
                      </span>
                    ))}
                    {disease.keySymptoms.length > 3 && (
                      <span className="text-[10px] font-bold text-blue-600 px-1 py-0.5">
                        +{disease.keySymptoms.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Specialist Recommendation */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px] font-medium">Specialist:</span>
                  <span className="font-bold text-slate-900 text-[11px] flex items-center space-x-1">
                    <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                    <span>{disease.recommendedSpecialist}</span>
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveDiseaseModal(disease)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold text-slate-700 transition flex items-center justify-center space-x-1"
                >
                  <span>{t.viewFullDetails}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onAskAi(`Tell me about ${disease.name}, its symptoms, treatment, and which doctor to consult.`)}
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition"
                  title={t.askAiBot}
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* FULL DISEASE DETAIL MODAL */}
      {activeDiseaseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex justify-between items-start border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-600 text-white px-2.5 py-0.5 rounded-full">
                    {activeDiseaseModal.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    System: {activeDiseaseModal.organSystem}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {activeDiseaseModal.name}
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSpeak(`${activeDiseaseModal.name}. ${activeDiseaseModal.overview}. Recommended specialist is ${activeDiseaseModal.recommendedSpecialist}. First aid: ${activeDiseaseModal.firstAidAdvice}`)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-xl transition"
                  title="Read Aloud (Text-to-Speech)"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveDiseaseModal(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs text-slate-800">
              
              {/* Overview */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {t.kbOverview}
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {activeDiseaseModal.overview}
                </p>
              </div>

              {/* Red-Flag Warning */}
              {activeDiseaseModal.emergencySigns && activeDiseaseModal.emergencySigns.length > 0 && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl space-y-1">
                  <span className="font-bold text-red-800 text-xs flex items-center space-x-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>{t.kbEmergencyAlert}</span>
                  </span>
                  <ul className="text-red-700 text-xs space-y-0.5 list-disc pl-5 font-medium">
                    {activeDiseaseModal.emergencySigns.map((sign, i) => (
                      <li key={i}>{sign}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Symptoms */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  {t.kbKeySymptoms}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {activeDiseaseModal.keySymptoms.map((sym, i) => (
                    <div key={i} className="p-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      <span className="font-semibold text-slate-800">{sym}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* First-Aid & Self-Care */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1">
                <span className="font-bold text-emerald-900 text-xs flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{t.kbFirstAid}</span>
                </span>
                <p className="text-emerald-800 text-xs font-medium leading-relaxed">
                  {activeDiseaseModal.firstAidAdvice}
                </p>
              </div>

              {/* Diagnostic Tests */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {t.kbDiagnosticTests}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeDiseaseModal.diagnosticTests.map((test, i) => (
                    <span key={i} className="bg-slate-100 text-slate-800 font-semibold px-2.5 py-1 rounded-lg text-xs">
                      {test}
                    </span>
                  ))}
                </div>
              </div>

              {/* Prevention */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {t.kbPrevention}
                </span>
                <ul className="text-xs text-slate-600 space-y-1 list-disc pl-5">
                  {activeDiseaseModal.prevention.map((prev, i) => (
                    <li key={i}>{prev}</li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Modal Bottom Actions */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  const spec = activeDiseaseModal.recommendedSpecialist;
                  setActiveDiseaseModal(null);
                  onSelectSpecialist(spec);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl shadow-md shadow-blue-600/25 transition text-xs flex items-center justify-center space-x-2"
              >
                <Stethoscope className="w-4 h-4" />
                <span>{t.kbConsultSpecialist} ({activeDiseaseModal.recommendedSpecialist})</span>
              </button>

              <button
                onClick={() => {
                  const query = `What should a patient do if diagnosed with ${activeDiseaseModal.name}?`;
                  setActiveDiseaseModal(null);
                  onAskAi(query);
                }}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition text-xs flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>{t.askAiBot}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
