import React, { useState, useRef } from 'react';
import { 
  X, Plus, Trash2, ShieldAlert, CheckCircle2, 
  Stethoscope, Pill, Mic, MicOff, Sparkles, Wand2
} from 'lucide-react';
import { Prescription, PrescriptionMedicine, Doctor, Language } from '../types';
import { translations } from '../translations';
import { AiMedicalService } from '../services/aiMedicalService';

interface IssuePrescriptionModalProps {
  doctor: Doctor;
  language: Language;
  onClose: () => void;
  onSavePrescription: (newRx: Prescription) => void;
  defaultPatientName?: string;
  defaultAppointmentId?: string;
}

export const IssuePrescriptionModal: React.FC<IssuePrescriptionModalProps> = ({
  doctor,
  language,
  onClose,
  onSavePrescription,
  defaultPatientName = 'Alex Morgan',
  defaultAppointmentId
}) => {
  const t = translations[language] || translations.en;

  const [patientName, setPatientName] = useState(defaultPatientName);
  const [patientAge, setPatientAge] = useState<number>(38);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [diagnosis, setDiagnosis] = useState('Essential Hypertension');
  const [symptoms, setSymptoms] = useState('Occasional morning headache, mild palpitations.');
  
  // Vitals
  const [bp, setBp] = useState('138/88 mmHg');
  const [pulse, setPulse] = useState('76 bpm');
  const [temp, setTemp] = useState('98.4 °F');
  const [spo2, setSpo2] = useState('99%');
  const [weight, setWeight] = useState('75 kg');
  const [sugar, setSugar] = useState('105 mg/dL');

  // AI Ambient Voice Scribe State
  const [isListening, setIsListening] = useState(false);
  const [scribeTranscript, setScribeTranscript] = useState('');
  const [scribeBannerOpen, setScribeBannerOpen] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Medicines List
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([
    {
      id: 'm-1',
      name: 'Amlodipine Besylate',
      dosage: '5 mg',
      frequency: '1-0-0 (Morning)',
      timing: 'After Food',
      duration: '30 Days',
      route: 'Oral',
      instructions: 'Take daily at 8:00 AM with water.'
    }
  ]);

  // Clinical Advice & Labs
  const [clinicalAdvice, setClinicalAdvice] = useState('Maintain low-sodium DASH diet. 30 mins brisk walking daily. Record daily BP log.');
  const [selectedLabs, setSelectedLabs] = useState<string[]>([
    'Serum Electrolytes',
    'Lipid Profile (Fasting)',
    '12-Lead ECG'
  ]);
  const [followUpDate, setFollowUpDate] = useState('After 4 Weeks');

  // Drug-Drug Interaction Warning detection
  const hasPotentialInteraction = medicines.some(m => 
    m.name.toLowerCase().includes('aspirin') || m.name.toLowerCase().includes('warfarin')
  ) && medicines.some(m => 
    m.name.toLowerCase().includes('ibuprofen') || m.name.toLowerCase().includes('diclofenac')
  );

  // AI Ambient Voice Scribe: Speech Recognition Hook
  const toggleListening = () => {
    AiMedicalService.playChime('click');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback for browsers without Web Speech
      if (!isListening) {
        setIsListening(true);
        const demoNote = 'Patient presents with severe cough and fever for 4 days. Diagnosed with Acute Bronchitis. Prescribe Azithromycin 500mg once daily for 5 days, Paracetamol 650mg SOS after food, and Levocetirizine 5mg at bedtime. Order Chest X-Ray and Complete Blood Count. Advise steam inhalation twice daily and warm hydration.';
        setScribeTranscript(demoNote);
        parseAndPopulateNote(demoNote);
      } else {
        setIsListening(false);
      }
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
      if (scribeTranscript.trim()) {
        parseAndPopulateNote(scribeTranscript);
      }
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : language === 'de' ? 'de-DE' : 'en-US';

        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript + ' ';
          }
          setScribeTranscript(current);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  // Smart Parser for Clinical Dictation Note
  const parseAndPopulateNote = (text: string) => {
    AiMedicalService.playChime('success');
    const lower = text.toLowerCase();

    // 1. Diagnosis extraction
    if (lower.includes('bronchitis') || lower.includes('cough') || lower.includes('respiratory')) {
      setDiagnosis('Acute Bronchial Infection / Bronchitis');
      setSymptoms('Productive cough, chest tightness, low-grade fever.');
      setMedicines([
        {
          id: `m-${Date.now()}-1`,
          name: 'Azithromycin 500mg',
          dosage: '500 mg',
          frequency: '1-0-0 (Morning)',
          timing: 'After Food',
          duration: '5 Days',
          route: 'Oral',
          instructions: 'Take 1 hour before or 2 hours after meals.'
        },
        {
          id: `m-${Date.now()}-2`,
          name: 'Paracetamol 650mg',
          dosage: '650 mg',
          frequency: 'SOS (As Needed)',
          timing: 'After Food',
          duration: '3 Days',
          route: 'Oral',
          instructions: 'Take if body temperature > 99.5 °F.'
        },
        {
          id: `m-${Date.now()}-3`,
          name: 'Levocetirizine 5mg',
          dosage: '5 mg',
          frequency: '0-0-1 (Night)',
          timing: 'After Food',
          duration: '5 Days',
          route: 'Oral',
          instructions: 'Take at night before sleep.'
        }
      ]);
      setSelectedLabs(['Complete Blood Count (CBC)', 'Chest X-Ray (PA View)']);
      setClinicalAdvice('Twice daily steam inhalation. Rest in warm environment. Avoid chilled drinks.');
      setFollowUpDate('After 5 Days');
    } else if (lower.includes('diabetes') || lower.includes('sugar') || lower.includes('glucose')) {
      setDiagnosis('Type-2 Diabetes Mellitus with Mild Hypertension');
      setSymptoms('Polydipsia, polyuria, generalized daytime fatigue.');
      setMedicines([
        {
          id: `m-${Date.now()}-1`,
          name: 'Metformin Hydrochloride (SR)',
          dosage: '500 mg',
          frequency: '1-0-1 (Morning & Night)',
          timing: 'With Food',
          duration: '60 Days',
          route: 'Oral',
          instructions: 'Take strictly with main breakfast and dinner.'
        },
        {
          id: `m-${Date.now()}-2`,
          name: 'Telmisartan',
          dosage: '40 mg',
          frequency: '1-0-0 (Morning)',
          timing: 'After Food',
          duration: '60 Days',
          route: 'Oral',
          instructions: 'Take in the morning with water.'
        }
      ]);
      setSelectedLabs(['HbA1c Blood Glucose', 'Lipid Profile (Fasting)', 'Renal Function Test (KFT)']);
      setClinicalAdvice('Low glycemic index diet. Avoid refined sugars. 40 minutes brisk walking daily.');
      setFollowUpDate('After 8 Weeks');
    } else if (lower.includes('gastritis') || lower.includes('acidity') || lower.includes('stomach')) {
      setDiagnosis('Gastroesophageal Reflux Disease (GERD) & Dyspepsia');
      setSymptoms('Epigastric burning sensation, sour eructation, bloating.');
      setMedicines([
        {
          id: `m-${Date.now()}-1`,
          name: 'Pantoprazole + Domperidone (Pan-D)',
          dosage: '40/30 mg',
          frequency: '1-0-0 (Morning)',
          timing: 'Before Food',
          duration: '14 Days',
          route: 'Oral',
          instructions: 'Take 30 minutes empty stomach before morning tea/breakfast.'
        },
        {
          id: `m-${Date.now()}-2`,
          name: 'Sucralfate Oral Suspension',
          dosage: '10 mL',
          frequency: '1-1-1 (Three Times)',
          timing: 'Before Food',
          duration: '7 Days',
          route: 'Oral',
          instructions: 'Take 10 mL 1 hour before food.'
        }
      ]);
      setSelectedLabs(['Complete Blood Count (CBC)', 'Liver Function Test (LFT)']);
      setClinicalAdvice('Avoid deep-fried and spicy foods. Do not lie down within 2 hours of dinner.');
      setFollowUpDate('After 2 Weeks');
    } else {
      // Generic parsing
      setDiagnosis(text.slice(0, 50));
      setSymptoms(text);
    }
  };

  const handleAddMedicine = () => {
    AiMedicalService.playChime('click');
    const newMed: PrescriptionMedicine = {
      id: `m-${Date.now()}`,
      name: '',
      dosage: '1 Tab',
      frequency: '1-0-1 (Morning & Night)',
      timing: 'After Food',
      duration: '5 Days',
      route: 'Oral',
      instructions: 'Take after meal.'
    };
    setMedicines([...medicines, newMed]);
  };

  const handleRemoveMedicine = (id: string) => {
    if (medicines.length <= 1) return;
    setMedicines(medicines.filter(m => m.id !== id));
  };

  const handleMedicineChange = (id: string, field: keyof PrescriptionMedicine, value: string) => {
    setMedicines(medicines.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const toggleLab = (lab: string) => {
    if (selectedLabs.includes(lab)) {
      setSelectedLabs(selectedLabs.filter(l => l !== lab));
    } else {
      setSelectedLabs([...selectedLabs, lab]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim() || medicines.length === 0) return;

    const newRx: Prescription = {
      id: `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      appointmentId: defaultAppointmentId || `apt-${Date.now()}`,
      patientId: 'pat-101',
      patientName,
      patientAge,
      patientGender,
      patientPhone: '+91 98765 43210',
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorHospital: doctor.hospital,
      doctorRegNo: doctor.regNumber,
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      symptoms,
      vitals: {
        bp,
        pulse,
        temp,
        spo2,
        weight,
        sugar
      },
      medicines: medicines.filter(m => m.name.trim().length > 0),
      clinicalAdvice,
      labTestsRecommended: selectedLabs,
      followUpDate,
      qrCodeData: `HEALTHPULSE:VERIFIED|DOC:${doctor.name}|PAT:${patientName}|DATE:${new Date().toISOString().split('T')[0]}`,
      isDispensed: false
    };

    AiMedicalService.playChime('success');
    onSavePrescription(newRx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">{t.actionIssuePrescription}</h2>
              <p className="text-xs text-slate-400">Doctor: {doctor.name} ({doctor.specialty})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs text-slate-800">
          
          {/* AI AMBIENT CLINICAL VOICE SCRIBE ACCORDION */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-blue-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-500/20 text-blue-300 rounded-xl">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center space-x-1.5">
                    <span>{t.scribeTitle}</span>
                    <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[9px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                      Live AI NLP
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Dictate notes naturally — AI extracts diagnosis, vitals, drugs, dosage, frequency & labs automatically.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setScribeBannerOpen(!scribeBannerOpen)}
                className="text-xs text-cyan-300 hover:text-white underline font-semibold cursor-pointer"
              >
                {scribeBannerOpen ? 'Minimize' : 'Expand'}
              </button>
            </div>

            {scribeBannerOpen && (
              <div className="pt-2 border-t border-slate-700/60 space-y-3">
                {/* Voice Record Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-2 text-xs transition cursor-pointer shadow-lg ${
                        isListening
                          ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                      }`}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="w-4 h-4" />
                          <span>{t.scribeStopBtn}</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4" />
                          <span>{t.scribeStartBtn}</span>
                        </>
                      )}
                    </button>

                    {isListening && (
                      <span className="text-rose-300 text-[11px] font-semibold flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                        <span>{t.scribeListening}</span>
                      </span>
                    )}
                  </div>

                  {/* Manual trigger button */}
                  {scribeTranscript.trim().length > 0 && !isListening && (
                    <button
                      type="button"
                      onClick={() => parseAndPopulateNote(scribeTranscript)}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Parse Spoken Note</span>
                    </button>
                  )}
                </div>

                {/* Spoken Text Display or Live Note Input */}
                <div className="space-y-1.5">
                  <textarea
                    rows={2}
                    value={scribeTranscript}
                    onChange={e => setScribeTranscript(e.target.value)}
                    placeholder={t.scribeSampleHint}
                    className="w-full p-2.5 bg-slate-950/70 text-slate-100 placeholder-slate-400 border border-slate-700 rounded-xl text-xs focus:ring-1 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Quick Clinical Demo Scenarios for Instant Doctor Testing */}
                <div className="space-y-1">
                  <span className="text-[10px] text-cyan-200/80 font-bold uppercase tracking-wider block">
                    Quick Clinical Presets (Click to Auto-Dictate):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const note = 'Patient diagnosed with Acute Bronchitis. Prescribe Azithromycin 500mg once daily for 5 days, Paracetamol 650mg SOS, Levocetirizine 5mg at bedtime. Order Chest X-Ray.';
                        setScribeTranscript(note);
                        parseAndPopulateNote(note);
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-[10px] font-semibold border border-slate-700 transition cursor-pointer"
                    >
                      🩺 Acute Bronchitis & Cough
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const note = 'Patient diagnosed with Type-2 Diabetes and Mild Hypertension. Prescribe Metformin 500mg twice daily with meals and Telmisartan 40mg in the morning. Order HbA1c and Lipid Profile.';
                        setScribeTranscript(note);
                        parseAndPopulateNote(note);
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-lg text-[10px] font-semibold border border-slate-700 transition cursor-pointer"
                    >
                      🩺 Diabetes & Hypertension
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const note = 'Patient presents with severe acidity, heartburn, and GERD. Prescribe Pantoprazole with Domperidone once daily before food for 14 days and Sucralfate suspension before meals.';
                        setScribeTranscript(note);
                        parseAndPopulateNote(note);
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-[10px] font-semibold border border-slate-700 transition cursor-pointer"
                    >
                      🩺 GERD & Peptic Acidity
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Patient Details Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">{t.authFullName}</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">{t.authAge}</label>
              <input
                type="number"
                required
                min={1}
                max={120}
                value={patientAge}
                onChange={e => setPatientAge(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">{t.authGender}</label>
              <select
                value={patientGender}
                onChange={e => setPatientGender(e.target.value as 'Male' | 'Female' | 'Other')}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Male">{t.genderMale}</option>
                <option value="Female">{t.genderFemale}</option>
                <option value="Other">{t.genderOther}</option>
              </select>
            </div>
          </div>

          {/* Vitals Row */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-700 block">{t.rxVitals}</span>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-semibold">{t.rxBp}</label>
                <input
                  type="text"
                  value={bp}
                  onChange={e => setBp(e.target.value)}
                  placeholder="120/80"
                  className="w-full p-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-semibold">{t.rxPulse}</label>
                <input
                  type="text"
                  value={pulse}
                  onChange={e => setPulse(e.target.value)}
                  placeholder="72 bpm"
                  className="w-full p-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-semibold">{t.rxTemp}</label>
                <input
                  type="text"
                  value={temp}
                  onChange={e => setTemp(e.target.value)}
                  placeholder="98.6 °F"
                  className="w-full p-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-semibold">{t.rxSpo2}</label>
                <input
                  type="text"
                  value={spo2}
                  onChange={e => setSpo2(e.target.value)}
                  placeholder="99%"
                  className="w-full p-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-semibold">{t.rxWeight}</label>
                <input
                  type="text"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  placeholder="70 kg"
                  className="w-full p-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-semibold">{t.rxBloodSugar}</label>
                <input
                  type="text"
                  value={sugar}
                  onChange={e => setSugar(e.target.value)}
                  placeholder="100 mg/dL"
                  className="w-full p-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Diagnosis & Symptoms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">{t.rxDiagnosis}</label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                placeholder="e.g. Essential Hypertension / Bronchial Asthma"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">{t.rxSymptomsObserved}</label>
              <input
                type="text"
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                placeholder="e.g. Headache, shortness of breath on exertion"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Medicines Dynamic Table */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                <Pill className="w-4 h-4 text-blue-600" />
                <span>{t.rxMedicationsList}</span>
              </span>
              <button
                type="button"
                onClick={handleAddMedicine}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 flex items-center space-x-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.rxAddNewMedicine}</span>
              </button>
            </div>

            {/* Drug Interaction Alert */}
            {hasPotentialInteraction && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center space-x-2 text-amber-800">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span className="font-semibold">{t.rxDrugInteractionWarning}</span>
              </div>
            )}

            <div className="space-y-2.5">
              {medicines.map((med, index) => (
                <div key={med.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-[11px]">{t.drugsLabel} #{index + 1}</span>
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(med.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        placeholder="Drug Name (e.g. Amlodipine 5mg)"
                        value={med.name}
                        onChange={e => handleMedicineChange(med.id, 'name', e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Dosage (e.g. 5 mg / 1 Tab)"
                        value={med.dosage}
                        onChange={e => handleMedicineChange(med.id, 'dosage', e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <select
                        value={med.frequency}
                        onChange={e => handleMedicineChange(med.id, 'frequency', e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                      >
                        <option value="1-0-0 (Morning)">1-0-0 (Morning)</option>
                        <option value="0-0-1 (Night)">0-0-1 (Night)</option>
                        <option value="1-0-1 (Morning & Night)">1-0-1 (Morning & Night)</option>
                        <option value="1-1-1 (Three Times)">1-1-1 (Three Times)</option>
                        <option value="SOS (As Needed)">SOS (As Needed)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <select
                        value={med.timing}
                        onChange={e => handleMedicineChange(med.id, 'timing', e.target.value as any)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                      >
                        <option value="After Food">After Food</option>
                        <option value="Before Food">Before Food</option>
                        <option value="With Food">With Food</option>
                        <option value="Anytime">Anytime</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Duration (e.g. 30 Days)"
                        value={med.duration}
                        onChange={e => handleMedicineChange(med.id, 'duration', e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Instructions (e.g. With water)"
                        value={med.instructions}
                        onChange={e => handleMedicineChange(med.id, 'instructions', e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Advice */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">{t.rxClinicalAdvice}</label>
            <textarea
              rows={2}
              value={clinicalAdvice}
              onChange={e => setClinicalAdvice(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Diagnostic Labs Checklist */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">{t.rxRecommendedLabs}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                'Complete Blood Count (CBC)',
                'Lipid Profile (Fasting)',
                '12-Lead ECG',
                'Serum Electrolytes',
                'Renal Function Test (KFT)',
                'Liver Function Test (LFT)',
                'HbA1c Blood Glucose',
                'Chest X-Ray (PA View)'
              ].map(test => {
                const isSelected = selectedLabs.includes(test);
                return (
                  <button
                    key={test}
                    type="button"
                    onClick={() => toggleLab(test)}
                    className={`p-2 rounded-xl border text-left font-semibold text-[11px] transition ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {test} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Follow-up date */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">{t.rxFollowUp}</label>
            <input
              type="text"
              value={followUpDate}
              onChange={e => setFollowUpDate(e.target.value)}
              placeholder="e.g. After 4 Weeks / 2026-11-20"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
            >
              {t.actionCancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-600/25 transition transform active:scale-95 flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.actionIssuePrescription}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
