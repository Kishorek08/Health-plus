import React, { useState } from 'react';
import { Bot, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

export const AiSymptomChecker = ({ onSelectSpecialty }: { onSelectSpecialty: (spec: string) => void }) => {
  const [symptoms, setSymptoms] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ specialty: string; urgency: 'Low' | 'Moderate' | 'High'; advice: string } | null>(null);

  const handleAnalyze = () => {
    if (!symptoms.trim()) return;
    setAnalyzing(true);

    setTimeout(() => {
      const lower = symptoms.toLowerCase();
      let res: { specialty: string; urgency: 'Low' | 'Moderate' | 'High'; advice: string } = {
        specialty: 'General Medicine',
        urgency: 'Low',
        advice: 'Schedule a regular checkup with a General Practitioner.',
      };

      if (lower.includes('chest') || lower.includes('heart') || lower.includes('pressure')) {
        res = {
          specialty: 'Cardiology',
          urgency: 'High',
          advice: 'Seek urgent evaluation. Consult a Cardiologist immediately if pain spreads to arm or jaw.',
        };
      } else if (lower.includes('headache') || lower.includes('dizzy') || lower.includes('numb')) {
        res = {
          specialty: 'Neurology',
          urgency: 'Moderate',
          advice: 'Recommend neurological evaluation for recurring neurological symptoms.',
        };
      }

      setResult(res);
      setAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl">
      <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
        <Sparkles className="w-4 h-4" /> Smart Triage Assistant
      </div>
      <h3 className="text-xl font-bold">Unsure which specialist to choose?</h3>
      <p className="text-xs text-slate-300 mt-1">Describe your symptoms below and our smart triage will match you with the right specialist.</p>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g. Sudden severe migraine and blurred vision..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-slate-400 text-xs border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {analyzing ? 'Analyzing...' : 'Analyze'} <Bot className="w-4 h-4" />
        </button>
      </div>

      {result && (
        <div className="mt-4 p-4 rounded-2xl bg-white/10 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
          <div>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-1 ${
              result.urgency === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {result.urgency} Urgency Level
            </span>
            <p className="text-sm font-bold text-white">Recommended: {result.specialty}</p>
            <p className="text-xs text-slate-300 mt-0.5">{result.advice}</p>
          </div>

          <button
            onClick={() => onSelectSpecialty(result.specialty)}
            className="px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all flex items-center gap-1 cursor-pointer"
          >
            Find {result.specialty} Doctors <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};