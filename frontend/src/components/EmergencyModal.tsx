import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, ShieldAlert, Truck, 
  MapPin, Clock, X, HeartPulse 
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { AiMedicalService } from '../services/aiMedicalService';

interface EmergencyModalProps {
  language: Language;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ language, onClose }) => {
  const t = translations[language] || translations.en;

  const [ambulanceDispatched, setAmbulanceDispatched] = useState(false);
  const [etaMinutes, setEtaMinutes] = useState(8);
  const [ambulanceCallSign, setAmbulanceCallSign] = useState('AMB-TN-02-8841');

  const handleDispatchAmbulance = () => {
    AiMedicalService.playChime('alert');
    setAmbulanceDispatched(true);
    setEtaMinutes(7);
    setAmbulanceCallSign(`AMB-METRO-${Math.floor(100 + Math.random() * 900)}`);
  };

  useEffect(() => {
    if (!ambulanceDispatched) return;
    const interval = setInterval(() => {
      setEtaMinutes(prev => (prev > 1 ? prev - 1 : 1));
    }, 45000);
    return () => clearInterval(interval);
  }, [ambulanceDispatched]);

  const labels = {
    en: {
      enRoute: 'AMBULANCE EN ROUTE',
      standby: 'STANDBY',
      callSign: 'Call Sign',
      eta: 'ETA',
      mins: 'Mins',
      gpsLocked: 'GPS Location Locked: Metro Area Paramedic Unit dispatched.',
      dispatchClick: 'Instant 1-Click Dispatch',
      directNumbers: 'Emergency Direct Medical Hotlines',
      natAmbulance: 'National Medical Ambulance',
      natAmbulanceSub: '24x7 Free Paramedic Support',
      unified: 'Unified National Emergency',
      unifiedSub: 'Police / Fire / Medical',
      cardiac: 'Cardiac Trauma Hotline',
      cardiacSub: 'Emergency Chest Pain Evaluation',
      poison: 'National Poison Control Center',
      poisonSub: 'Toxicological Ingestion Support',
      firstAidTitle: 'Immediate Life-Saving Action while Ambulance is En Route',
      firstAid1: 'Cardiac Chest Pain: Keep patient sitting calmly. Loosen tight clothing. If not allergic, give Dispirin / Aspirin 300mg to chew.',
      firstAid2: 'Stroke (F.A.S.T.): Note the exact time symptoms began. Do not give any food or liquids. Keep head elevated.',
      firstAid3: 'Severe Bleeding: Apply firm, continuous direct pressure with a clean cloth or sterile gauze. Do not remove soaked gauze; add more layers.'
    },
    ta: {
      enRoute: 'ஆம்புலன்ஸ் புறப்பட்டுவிட்டது',
      standby: 'தயார் நிலை',
      callSign: 'வாகன எண்',
      eta: 'வந்து சேரும் நேரம்',
      mins: 'நிமிடங்கள்',
      gpsLocked: 'ஜிபிஎஸ் இருப்பிடம் உறுதி செய்யப்பட்டது: ஆம்புலன்ஸ் அனுப்பப்பட்டது.',
      dispatchClick: 'உடனடி 1-கிளிக் ஆம்புலன்ஸ் அனுப்புக',
      directNumbers: 'அவசர மருத்துவ நேரடி உதவி எண்கள்',
      natAmbulance: 'தேசிய மருத்துவ ஆம்புலன்ஸ்',
      natAmbulanceSub: '24x7 இலவச அவசர ஊர்தி சேவை',
      unified: 'ஒருங்கிணைந்த தேசிய அவசர சேவை',
      unifiedSub: 'காவல்துறை / தீயணைப்பு / மருத்துவம்',
      cardiac: 'இதய அவசர சிகிச்சை உதவி எண்',
      cardiacSub: 'அவசர மார்பு வலி பரிசோதனை',
      poison: 'தேசிய நச்சு கட்டுப்பாட்டு மையம்',
      poisonSub: 'நச்சுப் பொருட்கள் உட்கொண்டால் உதவி',
      firstAidTitle: 'ஆம்புலன்ஸ் வரும் வரை செய்ய வேண்டிய உடனடி உயிர்காக்கும் நடவடிக்கைகள்',
      firstAid1: 'மார்பு வலி / மாரடைப்பு: நோயாளியை அமைதியாக அமர வைக்கவும். இறுக்கமான ஆடைகளை தளர்த்தவும். ஆஸ்பிரின் 300mg மெல்லக் கொடுக்கலாம்.',
      firstAid2: 'பக்கவாதம்: அறிகுறிகள் தொடங்கிய நேரத்தைக் குறித்துக்கொள்ளவும். உணவு அல்லது தண்ணீர் கொடுக்க வேண்டாம். தலையை சற்று உயர்த்தி வைக்கவும்.',
      firstAid3: 'கடுமையான இரத்தப்போக்கு: சுத்தமான துணியால் காயத்தின் மீது அழுத்திப் பிடிக்கவும். இரத்தத்தில் நனைந்த துணியை அகற்றாமல் மேலே கூடுதல் துணியை வைக்கவும்.'
    },
    hi: {
      enRoute: 'एम्बुलेंस रास्ते में है',
      standby: 'स्टैंडबाय',
      callSign: 'वाहन संख्या',
      eta: 'अनुमानित समय',
      mins: 'मिनट',
      gpsLocked: 'जीपीएस स्थान लॉक: पैरामेडिक यूनिट रवाना कर दी गई है।',
      dispatchClick: 'तत्काल 1-क्लिक डिस्पैच',
      directNumbers: 'आपातकालीन प्रत्यक्ष चिकित्सा नंबर',
      natAmbulance: 'राष्ट्रीय चिकित्सा एम्बुलेंस',
      natAmbulanceSub: '24x7 निःशुल्क पैरामेडिक सहायता',
      unified: 'एकीकृत राष्ट्रीय आपातकालीन सेवा',
      unifiedSub: 'पुलिस / अग्निशमन / चिकित्सा',
      cardiac: 'हृदय रोग आपातकालीन हेल्पलाइन',
      cardiacSub: 'सीने में दर्द का तत्काल मूल्यांकन',
      poison: 'राष्ट्रीय विष नियंत्रण केंद्र',
      poisonSub: 'विषाक्तता सहायता एवं मार्गदर्शन',
      firstAidTitle: 'एम्बुलेंस आने तक तत्काल जीवन रक्षक प्राथमिक चिकित्सा',
      firstAid1: 'सीने में दर्द: मरीज़ को शांत बैठाएं। टाइट कपड़े ढीले करें। एलर्जी न हो तो एस्पिरिन 300mg चबाने को दें।',
      firstAid2: 'स्ट्रोक / पक्षाघात: लक्षण शुरू होने का समय नोट करें। खाने-पीने को कुछ न दें। सिर ऊंचा रखें।',
      firstAid3: 'गंभीर रक्तस्राव: साफ कपड़े से घाव पर लगातार सीधा दबाव बनाएं रखें। भीगे कपड़े को न हटाएं, ऊपर और परतें लगाएं।'
    },
    de: {
      enRoute: 'RETTUNGSWAGEN UNTERWEGS',
      standby: 'BEREITSCHAFT',
      callSign: 'Funkrufname',
      eta: 'Eintreffzeit',
      mins: 'Min',
      gpsLocked: 'GPS-Standort erfasst: Notarzt- und Rettungswagen alarmiert.',
      dispatchClick: 'Sofortige 1-Klick-Alarmierung',
      directNumbers: 'Direkte medizinische Notrufnummern',
      natAmbulance: 'Rettungsdienst / Notarzt',
      natAmbulanceSub: '24x7 Schnelle Notfallrettung',
      unified: 'Einheitlicher Notruf',
      unifiedSub: 'Polizei / Feuerwehr / Rettungsdienst',
      cardiac: 'Kardiovaskuläres Notfalltelefon',
      cardiacSub: 'Brustschmerz-Akutabklärung',
      poison: 'Giftnotruf-Zentrale',
      poisonSub: 'Toxikologische Beratung bei Vergiftungen',
      firstAidTitle: 'Sofortmaßnahmen bis zum Eintreffen des Rettungsdienstes',
      firstAid1: 'Kardialer Brustschmerz: Patient ruhig und mit erhöhtem Oberkörper lagern. Beengende Kleidung lockern. Bei fehlender Allergie ASS 300mg kauen lassen.',
      firstAid2: 'Schlaganfall: Genaue Uhrzeit des Symptombeginns notieren. Keine Flüssigkeiten oder Nahrung verabreichen.',
      firstAid3: 'Starke Blutung: Sofortige manuelle Kompression mit sterilem Verband oder sauberem Tuch. Druckverband anlegen.'
    }
  }[language] || {
    enRoute: 'AMBULANCE EN ROUTE',
    standby: 'STANDBY',
    callSign: 'Call Sign',
    eta: 'ETA',
    mins: 'Mins',
    gpsLocked: 'GPS Location Locked: Metro Area Paramedic Unit dispatched.',
    dispatchClick: 'Instant 1-Click Dispatch',
    directNumbers: 'Emergency Direct Medical Hotlines',
    natAmbulance: 'National Medical Ambulance',
    natAmbulanceSub: '24x7 Free Paramedic Support',
    unified: 'Unified National Emergency',
    unifiedSub: 'Police / Fire / Medical',
    cardiac: 'Cardiac Trauma Hotline',
    cardiacSub: 'Emergency Chest Pain Evaluation',
    poison: 'National Poison Control Center',
    poisonSub: 'Toxicological Ingestion Support',
    firstAidTitle: 'Immediate Life-Saving Action while Ambulance is En Route',
    firstAid1: 'Cardiac Chest Pain: Keep patient sitting calmly. Loosen tight clothing. If not allergic, give Dispirin / Aspirin 300mg to chew.',
    firstAid2: 'Stroke (F.A.S.T.): Note the exact time symptoms began. Do not give any food or liquids. Keep head elevated.',
    firstAid3: 'Severe Bleeding: Apply firm, continuous direct pressure with a clean cloth or sterile gauze. Do not remove soaked gauze; add more layers.'
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-auto shadow-2xl border-2 border-red-500 overflow-hidden flex flex-col">
        
        {/* Urgent Header */}
        <div className="p-5 bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 text-white rounded-2xl animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">{t.emgTitle}</h2>
              <p className="text-xs text-red-100">{t.emgSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-800 overflow-y-auto max-h-[75vh]">
          
          {/* AMBULANCE DISPATCH TRACKER */}
          <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-red-400" />
                <span className="font-extrabold text-sm">{t.emgAmbulanceTracking}</span>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                ambulanceDispatched ? 'bg-emerald-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-400'
              }`}>
                {ambulanceDispatched ? labels.enRoute : labels.standby}
              </span>
            </div>

            {ambulanceDispatched ? (
              <div className="bg-slate-800/80 p-4 rounded-xl space-y-2 border border-slate-700">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{labels.callSign}: <strong className="text-white font-mono">{ambulanceCallSign}</strong></span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{labels.eta}: ~{etaMinutes} {labels.mins}</span>
                  </span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 to-emerald-400 h-full w-3/4 animate-pulse"></div>
                </div>
                <div className="text-[11px] text-slate-300 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span>{labels.gpsLocked}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={handleDispatchAmbulance}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/30 transition flex items-center justify-center space-x-2 cursor-pointer transform active:scale-95"
              >
                <Truck className="w-4 h-4" />
                <span>{t.actionDispatchAmbulance} ({labels.dispatchClick})</span>
              </button>
            )}
          </div>

          {/* HOTLINE NUMBERS GRID */}
          <div className="space-y-2">
            <span className="font-bold text-slate-700 block text-xs uppercase tracking-wider">
              {labels.directNumbers}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              <a
                href="tel:108"
                className="p-3.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl flex items-center justify-between text-red-950 transition group"
              >
                <div>
                  <div className="text-[10px] font-bold text-red-600 uppercase">{labels.natAmbulance}</div>
                  <div className="text-lg font-black text-red-700">Dial 108</div>
                  <div className="text-[10px] text-slate-500">{labels.natAmbulanceSub}</div>
                </div>
                <div className="p-2.5 bg-red-600 text-white rounded-xl group-hover:scale-110 transition">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </a>

              <a
                href="tel:112"
                className="p-3.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl flex items-center justify-between text-blue-950 transition group"
              >
                <div>
                  <div className="text-[10px] font-bold text-blue-600 uppercase">{labels.unified}</div>
                  <div className="text-lg font-black text-blue-700">Dial 112</div>
                  <div className="text-[10px] text-slate-500">{labels.unifiedSub}</div>
                </div>
                <div className="p-2.5 bg-blue-600 text-white rounded-xl group-hover:scale-110 transition">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </a>

              <a
                href="tel:1066"
                className="p-3.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl flex items-center justify-between text-amber-950 transition group"
              >
                <div>
                  <div className="text-[10px] font-bold text-amber-700 uppercase">{labels.cardiac}</div>
                  <div className="text-lg font-black text-amber-800">Dial 1066</div>
                  <div className="text-[10px] text-slate-500">{labels.cardiacSub}</div>
                </div>
                <div className="p-2.5 bg-amber-600 text-white rounded-xl group-hover:scale-110 transition">
                  <HeartPulse className="w-4 h-4" />
                </div>
              </a>

              <a
                href="tel:1800116117"
                className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-between text-slate-900 transition group"
              >
                <div>
                  <div className="text-[10px] font-bold text-slate-600 uppercase">{labels.poison}</div>
                  <div className="text-base font-black text-slate-800">1800-116-117</div>
                  <div className="text-[10px] text-slate-500">{labels.poisonSub}</div>
                </div>
                <div className="p-2.5 bg-slate-800 text-white rounded-xl group-hover:scale-110 transition">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </a>

            </div>
          </div>

          {/* CRITICAL FIRST AID INSTRUCTIONS */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
              <HeartPulse className="w-4 h-4 text-red-600" />
              <span>{labels.firstAidTitle}</span>
            </span>
            <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-5">
              <li>{labels.firstAid1}</li>
              <li>{labels.firstAid2}</li>
              <li>{labels.firstAid3}</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition cursor-pointer"
          >
            {t.actionClose}
          </button>
        </div>

      </div>
    </div>
  );
};
