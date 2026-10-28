import { TriageEvaluation, Language } from '../types';
import { DISEASES_DATABASE } from '../data/diseasesData';

export class AiMedicalService {
  /**
   * Sound synthesis using browser Web Audio API
   */
  static playChime(type: 'success' | 'alert' | 'alarm' | 'click' = 'success') {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'success') {
        // Melodic two-tone chime (E5 -> A5)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain1.gain.setValueAtTime(0.2, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.35);
      } else if (type === 'alarm') {
        // Pulsing urgent alarm chime
        const now = ctx.currentTime;
        [0, 0.2, 0.4].forEach((delay) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(880, now + delay);
          gain.gain.setValueAtTime(0.25, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.15);
        });
      } else if (type === 'alert') {
        // Warning sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(330, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {
      // Audio autoplay may be muted until user interaction; fail gracefully
    }
  }

  /**
   * Text-to-speech engine using Web Speech API
   */
  static speakText(text: string, lang: Language = 'en') {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const langCodeMap: Record<Language, string> = {
        en: 'en-US',
        ta: 'ta-IN',
        hi: 'hi-IN',
        de: 'de-DE'
      };
      
      utterance.lang = langCodeMap[lang] || 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech synth errors
    }
  }

  /**
   * Stop current speech
   */
  static stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Deep clinical triage algorithm
   */
  static evaluateSymptoms(userInput: string, _lang: Language = 'en'): TriageEvaluation {
    const raw = userInput.toLowerCase();

    // 1. Check for Critical Emergency Red-Flags
    const emergencyTriggers = [
      'crushing chest pain', 'chest pain radiating', 'left arm pain', 'heart attack',
      'sudden numbness', 'face drooping', 'arm weakness', 'slurred speech', 'stroke',
      'can\'t breathe', 'cannot breathe', 'severe breathlessness', 'choking', 'cyanosis',
      'unconscious', 'fainted and not waking', 'anaphylaxis', 'throat closing',
      'status epilepticus', 'seizure lasting > 5 mins', 'vomiting blood', 'hematemesis',
      'coughing blood', 'severe allergic reaction'
    ];

    const hasRedFlag = emergencyTriggers.some(trigger => raw.includes(trigger));

    if (hasRedFlag) {
      this.playChime('alert');
      return {
        urgency: 'Emergency',
        urgencyScore: 10,
        recommendedSpecialty: raw.includes('speech') || raw.includes('drooping') || raw.includes('numb')
          ? 'Emergency Stroke Neurology'
          : 'Emergency Cardiology / Trauma Care',
        matchedConditions: [
          {
            name: raw.includes('droop') || raw.includes('stroke') ? 'Acute Ischemic Stroke' : 'Acute Coronary Syndrome (Myocardial Infarction)',
            probability: 95,
            reason: 'Critical high-acuity presentation matching immediate life-threatening criteria.'
          }
        ],
        clinicalAdvice: 'IMMEDIATE EMERGENCY ACTION REQUIRED: Do not attempt to drive yourself. Dial emergency services (108 / 112) immediately. Sit or lie in a comfortable semi-reclined position. Keep airway clear.',
        emergencyRedFlags: [
          'High risk of acute myocardial infarction or cerebrovascular event',
          'Immediate hospital transport indicated within the golden hour'
        ],
        suggestedTests: ['Emergency ECG', 'Cardiac Biomarkers (Troponin I/T)', 'Brain CT Scan', 'Arterial Blood Gas'],
        isRedFlag: true
      };
    }

    // 2. Score against Diseases Database
    const matched = DISEASES_DATABASE.map(disease => {
      let score = 0;
      const matchedSymptoms: string[] = [];

      // Check disease name match
      if (raw.includes(disease.name.toLowerCase())) {
        score += 35;
      }

      // Check symptoms match
      disease.keySymptoms.forEach(sym => {
        const words = sym.toLowerCase().split(/[\s,()]+/);
        let matchCount = 0;
        words.forEach(w => {
          if (w.length > 3 && raw.includes(w)) matchCount++;
        });
        if (matchCount >= 1) {
          score += 15 * matchCount;
          matchedSymptoms.push(sym);
        }
      });

      // Severity weighting
      if (disease.severity.includes('Emergency')) score *= 1.2;
      if (disease.severity.includes('Severe')) score *= 1.1;

      return {
        disease,
        score,
        matchedSymptoms
      };
    })
    .filter(item => item.score > 10)
    .sort((a, b) => b.score - a.score);

    if (matched.length > 0) {
      const topMatch = matched[0];
      const urgency = topMatch.disease.severity === 'Critical / Emergency'
        ? 'Emergency'
        : topMatch.disease.severity === 'Severe'
        ? 'Urgent'
        : topMatch.disease.severity === 'Moderate'
        ? 'Routine'
        : 'Self-Care';

      return {
        urgency,
        urgencyScore: urgency === 'Emergency' ? 9 : urgency === 'Urgent' ? 7 : urgency === 'Routine' ? 5 : 3,
        recommendedSpecialty: topMatch.disease.recommendedSpecialist,
        matchedConditions: matched.slice(0, 3).map(m => ({
          name: m.disease.name,
          probability: Math.min(94, Math.max(45, Math.round((m.score / (matched[0].score || 1)) * 88))),
          reason: `Matches symptoms: ${m.matchedSymptoms.slice(0, 2).join(', ') || 'Clinical presentation'}`
        })),
        clinicalAdvice: topMatch.disease.firstAidAdvice,
        emergencyRedFlags: topMatch.disease.emergencySigns,
        suggestedTests: topMatch.disease.diagnosticTests,
        isRedFlag: urgency === 'Emergency'
      };
    }

    // 3. Fallback General Evaluation
    return {
      urgency: 'Routine',
      urgencyScore: 4,
      recommendedSpecialty: 'General Physician / Internal Medicine',
      matchedConditions: [
        {
          name: 'General Medical Symptom Evaluation',
          probability: 70,
          reason: 'Symptoms warrant comprehensive primary clinical checkup.'
        }
      ],
      clinicalAdvice: 'Maintain hydration, monitor vital signs (temperature and pulse), and schedule a consultation with a General Physician for clinical evaluation.',
      emergencyRedFlags: [
        'Persistent high fever > 102°F lasting > 3 days',
        'Sudden severe unbearable pain or loss of consciousness',
        'Breathing difficulties or severe vomiting'
      ],
      suggestedTests: ['Complete Blood Count (CBC)', 'Basic Metabolic Panel', 'Routine Urine Examination'],
      isRedFlag: false
    };
  }

  /**
   * Contextual medical assistant chat responder
   */
  static generateBotResponse(userInput: string, lang: Language = 'en'): { text: string; triage?: TriageEvaluation } {
    const raw = userInput.toLowerCase();

    // Check if user is asking for triage / symptom checking
    const triageKeywords = ['pain', 'ache', 'fever', 'cough', 'dizzy', 'headache', 'swelling', 'bleed', 'vomit', 'rash', 'symptom', 'breath', 'sore', 'pressure', 'itching'];
    const isTriage = triageKeywords.some(k => raw.includes(k));

    if (isTriage) {
      const triage = this.evaluateSymptoms(userInput, lang);
      let responseText = '';

      if (triage.isRedFlag) {
        responseText = `🚨 **CRITICAL TRIAGE ALERT**: The symptoms described strongly indicate a potential medical emergency. \n\n**Immediate Specialty**: ${triage.recommendedSpecialty}\n**Immediate Action**: Please do not delay. Dial emergency services (108 / 112) or proceed to the nearest emergency room immediately. \n\n**First-Aid Guidance**: ${triage.clinicalAdvice}`;
      } else {
        responseText = `🩺 **Clinical Triage Summary**:\nBased on your reported symptoms, our clinical engine recommends scheduling a consultation with a **${triage.recommendedSpecialty}**.\n\n**Top Differential Matches**:\n${triage.matchedConditions.map(c => `• **${c.name}** (~${c.probability}% match) - ${c.reason}`).join('\n')}\n\n**Recommended Next Steps**:\n${triage.clinicalAdvice}\n\n**Diagnostic Investigations Usually Advised**:\n${triage.suggestedTests.join(', ')}`;
      }

      return { text: responseText, triage };
    }

    // Prescription download queries
    if (raw.includes('prescription') || raw.includes('pdf') || raw.includes('download') || raw.includes('print')) {
      return {
        text: '📄 **Accessing Your Prescriptions & PDF Printouts**:\n\n1. Navigate to the **"E-Prescriptions & Rx Vault"** tab in the sidebar.\n2. Click the **"Print / Save as PDF"** button next to your desired prescription.\n3. A hospital-grade official document with QR code and doctor signature will render.\n4. Click the blue **"Print / Save PDF"** button on top to print physically or save directly as a PDF on your device!'
      };
    }

    // Language switch queries
    if (raw.includes('language') || raw.includes('tamil') || raw.includes('hindi') || raw.includes('german') || raw.includes('translate')) {
      return {
        text: '🌐 **Multilingual Support Available**:\nHealthPulse Ultra is fully translated into **English (EN)**, **Tamil (தமிழ்)**, **Hindi (हिन्दी)**, and **German (Deutsch)**!\n\nYou can switch languages at any moment using the language dropdown located in the top-right corner of the header navbar.'
      };
    }

    // Medication queries
    if (raw.includes('medicine') || raw.includes('medication') || raw.includes('alarm') || raw.includes('reminder') || raw.includes('pill')) {
      return {
        text: '⏰ **Smart Medication Alarms & Adherence**:\n\n• Open the **"Medication Alarms"** tab to manage your daily dosage schedule.\n• The portal uses real-time Web Audio chimes to alert you when it is time to take your pills.\n• Clicking **"Mark as Taken"** tracks your daily adherence streak and plays a confirmation chime!'
      };
    }

    // Emergency queries
    if (raw.includes('emergency') || raw.includes('ambulance') || raw.includes('hospital') || raw.includes('108') || raw.includes('112')) {
      return {
        text: '🚨 **Emergency Protocols**:\n\n• Click the red **"EMERGENCY SOS"** button in the header bar.\n• Access 24x7 National Ambulance (108), Unified Emergency (112), and Cardiac Helplines (1066).\n• You can also trigger the **Live Ambulance Dispatcher** with real-time GPS tracking!'
      };
    }

    // Default polite conversational reply
    return {
      text: `Hello! I am **MediPulse AI**, your comprehensive clinical assistant.\n\nI can help you with:\n1. **Symptom Triage & Disease Diagnosis**: Describe any symptoms you or your family are experiencing.\n2. **Doctor Appointments**: Guide you to the right medical specialist for your condition.\n3. **Prescriptions & PDF Downloads**: Help you view, print, or forward digital prescriptions to pharmacies.\n4. **Disease Information**: Explain causes, diagnostics, and prevention for over 50+ diseases.\n5. **Medication & Drug Interactions**: Clarify dosage and safety precautions.\n\nHow can I assist your health today?`
    };
  }
}
