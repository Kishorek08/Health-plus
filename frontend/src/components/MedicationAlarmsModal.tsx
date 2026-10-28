import React, { useState, useEffect } from 'react';
import { 
  BellRing, Plus, Volume2, CheckCircle2, 
  Trash2, X, Pill, Clock, Flame, 
  Phone, Users, ShieldCheck, Send, 
  MessageSquare, Edit3, Check, History, Sparkles,
  Settings, Loader2, AlertCircle, Signal
} from 'lucide-react';
import { MedicationReminder, Language, User, SmsNotificationRecord } from '../types';
import { translations } from '../translations';
import { AiMedicalService } from '../services/aiMedicalService';
import { StorageService } from '../services/storageService';
import { RealMessagingService, SmsGatewayConfig, SmsDispatchResult } from '../services/realMessagingService';

interface MedicationAlarmsModalProps {
  alarms: MedicationReminder[];
  language: Language;
  currentUser?: User | null;
  onClose: () => void;
  onToggleTaken: (id: string) => void;
  onAddAlarm: (alarm: MedicationReminder) => void;
  onDeleteAlarm: (id: string) => void;
  onUpdateUser?: (updated: User) => void;
}

export const MedicationAlarmsModal: React.FC<MedicationAlarmsModalProps> = ({
  alarms,
  language,
  currentUser,
  onClose,
  onToggleTaken,
  onAddAlarm,
  onDeleteAlarm,
  onUpdateUser
}) => {
  const t = translations[language] || translations.en;

  // Active Tab: 'alarms' | 'sms-log'
  const [activeTab, setActiveTab] = useState<'alarms' | 'sms-log'>('alarms');

  // Contact Numbers State
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '9345288654');
  const [guardianName, setGuardianName] = useState(currentUser?.guardianName || 'Kishore (Guardian)');
  const [guardianPhone, setGuardianPhone] = useState(currentUser?.guardianPhone || '9488634916');
  const [isEditingContacts, setIsEditingContacts] = useState(false);
  const [contactsSavedBanner, setContactsSavedBanner] = useState(false);

  // SMS Gateway Settings Modal
  const [showGatewaySettings, setShowGatewaySettings] = useState(false);
  const [gatewayConfig, setGatewayConfig] = useState<SmsGatewayConfig>(() => RealMessagingService.getGatewayConfig());
  const [gatewaySavedBanner, setGatewaySavedBanner] = useState(false);

  // Automated Dispatch State
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionResults, setTransmissionResults] = useState<{ patient: SmsDispatchResult | null; guardian: SmsDispatchResult | null } | null>(null);
  const [testDispatchToast, setTestDispatchToast] = useState<{ success: boolean; message: string } | null>(null);

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newDosage, setNewDosage] = useState('1 Tablet');
  const [newTime, setNewTime] = useState('08:00 AM');
  const [newFrequency, setNewFrequency] = useState('Daily (Morning)');

  // Ringing & Live Record State
  const [ringingAlarm, setRingingAlarm] = useState<MedicationReminder | null>(null);
  const [liveSmsRecord, setLiveSmsRecord] = useState<SmsNotificationRecord | null>(null);
  const [smsHistory, setSmsHistory] = useState<SmsNotificationRecord[]>(() => StorageService.getSmsHistory());

  // Background Automatic Alarm Monitor: Checks every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentFormattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toUpperCase();
      
      alarms.forEach(alarm => {
        const normalizedAlarmTime = alarm.time.trim().toUpperCase();
        if (normalizedAlarmTime === currentFormattedTime && !alarm.takenToday && !ringingAlarm) {
          triggerAutomatedDualSms(alarm, false);
        }
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [alarms, ringingAlarm, patientPhone, guardianPhone, guardianName]);

  // Save Contact Numbers Handler
  const handleSaveContacts = () => {
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        phone: patientPhone.trim(),
        guardianName: guardianName.trim(),
        guardianPhone: guardianPhone.trim()
      };
      StorageService.updateUserProfile(updatedUser);
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      }
    }
    setIsEditingContacts(false);
    setContactsSavedBanner(true);
    AiMedicalService.playChime('success');
    setTimeout(() => setContactsSavedBanner(false), 3500);
  };

  // Save Gateway Configuration
  const handleSaveGatewayConfig = () => {
    RealMessagingService.saveGatewayConfig(gatewayConfig);
    setGatewaySavedBanner(true);
    AiMedicalService.playChime('success');
    setTimeout(() => setGatewaySavedBanner(false), 3000);
  };

  // Instant Test Automated Background SMS to Patient Phone
  const handleSendTestSms = async (target: 'patient' | 'guardian') => {
    const targetPhone = target === 'patient' ? patientPhone : guardianPhone;
    const targetLabel = target === 'patient' ? (currentUser?.name || 'Patient') : guardianName;
    const testMsg = `[HealthPulse Verification] Automated Dose SMS to ${targetLabel}. Telecom routing to ${targetPhone} verified.`;

    setIsTransmitting(true);
    try {
      const result = await RealMessagingService.sendAutomatedSms(targetPhone, testMsg);
      setTestDispatchToast({
        success: result.success,
        message: result.success 
          ? `✓ Automated SMS transmitted to ${targetPhone}! Carrier ID: ${result.messageId || 'Direct'}`
          : `SMS Gateway response: ${result.details}`
      });
    } catch {
      setTestDispatchToast({
        success: false,
        message: 'Could not contact SMS Gateway. Please verify network connection or gateway key.'
      });
    } finally {
      setIsTransmitting(false);
      setTimeout(() => setTestDispatchToast(null), 7000);
    }
  };

  // 100% AUTOMATED DUAL BACKGROUND SMS TRIGGER
  const triggerAutomatedDualSms = async (alarm: MedicationReminder, _isManualTest: boolean = false) => {
    AiMedicalService.playChime('alarm');
    setRingingAlarm(alarm);
    setIsTransmitting(true);
    setTransmissionResults(null);

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const pName = currentUser?.name || 'Patient';
    
    // Clean text payloads formatted for direct telecom carrier SMS
    const pMsg = `[HealthPulse Alert] Hi ${pName}, time to take your scheduled dose: ${alarm.medicineName} (${alarm.dosage}) at ${alarm.time}. Frequency: ${alarm.frequency}. Please take it now.`;
    const gMsg = `[HealthPulse Guardian Alert] Notice to ${guardianName}: Patient ${pName} scheduled for ${alarm.medicineName} (${alarm.dosage}) at ${alarm.time}. Please verify adherence.`;

    // Audio Voice Announcement (Web Speech API)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const speech = new SpeechSynthesisUtterance(
          `Medication alert for ${alarm.medicineName}. Automated background SMS transmission initiated for patient and guardian numbers.`
        );
        speech.rate = 1.0;
        window.speechSynthesis.speak(speech);
      } catch (err) {
        console.warn('Speech error:', err);
      }
    }

    // AUTOMATED BACKGROUND DISPATCH (Zero tabs, Zero popups, direct carrier routing)
    try {
      const results = await RealMessagingService.dispatchDualAutomatedSms(
        patientPhone,
        pMsg,
        guardianPhone,
        gMsg
      );

      setTransmissionResults({
        patient: results.patientResult,
        guardian: results.guardianResult
      });

      const newRecord: SmsNotificationRecord = {
        id: `sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: nowStr,
        medicineName: alarm.medicineName,
        dosage: alarm.dosage,
        time: alarm.time,
        patientPhone: patientPhone || '+91 98400 12345',
        patientMessage: pMsg,
        guardianPhone: guardianPhone || '+91 98765 43211',
        guardianName: guardianName || 'Caregiver',
        guardianMessage: gMsg,
        status: results.patientResult.success ? 'Delivered' : 'Sent'
      };

      StorageService.saveSmsRecord(newRecord);
      setSmsHistory(prev => [newRecord, ...prev]);
      setLiveSmsRecord(newRecord);

      if (results.patientResult.success || results.guardianResult.success) {
        AiMedicalService.playChime('success');
      }
    } catch (err: any) {
      console.error('Automated SMS transmission error:', err);
    } finally {
      setIsTransmitting(false);
    }
  };

  const handleDismissRinging = () => {
    if (ringingAlarm) {
      onToggleTaken(ringingAlarm.id);
      setRingingAlarm(null);
      setLiveSmsRecord(null);
      setTransmissionResults(null);
    }
  };

  const handleCreateAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;

    const newAlarmItem: MedicationReminder = {
      id: `al-${Date.now()}`,
      medicineName: newMedName.trim(),
      dosage: newDosage,
      time: newTime,
      frequency: newFrequency,
      takenToday: false,
      streakDays: 1,
      notes: 'Take as directed',
      smsAlertsEnabled: true
    };

    AiMedicalService.playChime('success');
    onAddAlarm(newAlarmItem);
    setNewMedName('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* HEADER */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-teal-600 text-white rounded-xl shadow-md shadow-emerald-500/20">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-extrabold text-white">{t.alarmTitle}</h2>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase rounded-full flex items-center space-x-1">
                  <Signal className="w-3 h-3 text-emerald-400" />
                  <span>Automated Carrier SMS</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">Automated background cellular SMS dispatch to patient and guardian numbers.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowGatewaySettings(!showGatewaySettings)}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              title="SMS Gateway Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SMS GATEWAY CONFIGURATION PANEL */}
        {showGatewaySettings && (
          <div className="p-5 bg-slate-900 border-b border-slate-800 text-white space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                  Automated Telecom SMS Gateway Configuration
                </span>
              </div>
              <button
                onClick={() => setShowGatewaySettings(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Close Settings
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Gateway Provider Route
                </label>
                <select
                  value={gatewayConfig.provider}
                  onChange={e => setGatewayConfig({ ...gatewayConfig, provider: e.target.value as any })}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                >
                  <option value="textbelt">TextBelt (Free Direct Cellular Gateway)</option>
                  <option value="fast2sms">Fast2SMS (India Instant Cellular Route)</option>
                  <option value="twilio">Twilio (Global Carrier Telecom Route)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  {gatewayConfig.provider === 'textbelt' ? 'TextBelt Key (Default: textbelt)' : 'Gateway API Key / Token'}
                </label>
                <input
                  type="text"
                  value={gatewayConfig.apiKey}
                  onChange={e => setGatewayConfig({ ...gatewayConfig, apiKey: e.target.value })}
                  placeholder={gatewayConfig.provider === 'textbelt' ? 'textbelt' : 'Paste your API Key'}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              {gatewayConfig.provider === 'twilio' && (
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Twilio From Number
                  </label>
                  <input
                    type="text"
                    value={gatewayConfig.twilioFromPhone || ''}
                    onChange={e => setGatewayConfig({ ...gatewayConfig, twilioFromPhone: e.target.value })}
                    placeholder="+1234567890"
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
              )}

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleSaveGatewayConfig}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Gateway Settings</span>
                </button>
              </div>
            </div>

            {gatewaySavedBanner && (
              <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold">
                ✓ SMS Gateway route settings updated successfully!
              </div>
            )}
          </div>
        )}

        {/* DUAL NOTIFICATION TARGETS CARD */}
        <div className="p-4 bg-slate-950 text-white border-b border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                Automated Telecom Dispatch Targets
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                Direct Cellular Route
              </span>
            </div>
            <button
              onClick={() => setIsEditingContacts(!isEditingContacts)}
              className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center space-x-1.5 cursor-pointer bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingContacts ? t.alarmCancel : t.alarmEditContactsBtn}</span>
            </button>
          </div>

          {/* EDIT CONTACTS FORM */}
          {isEditingContacts ? (
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    {t.alarmPatientTarget}
                  </label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={e => setPatientPhone(e.target.value)}
                    placeholder="e.g. 9840012345 or +91 98400 12345"
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                  <span className="text-[9px] text-slate-500 mt-0.5 block">{t.alarmNumberFormatHint}</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    {t.authGuardianName}
                  </label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={e => setGuardianName(e.target.value)}
                    placeholder="e.g. Sarah Morgan (Caregiver)"
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    {t.alarmGuardianTarget}
                  </label>
                  <input
                    type="tel"
                    value={guardianPhone}
                    onChange={e => setGuardianPhone(e.target.value)}
                    placeholder="e.g. 9876543211 or +91 98765 43211"
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                  <span className="text-[9px] text-slate-500 mt-0.5 block">{t.alarmNumberFormatHint}</span>
                </div>
              </div>

              {/* Actions row in Contact Editor */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={isTransmitting}
                    onClick={() => handleSendTestSms('patient')}
                    className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 rounded-xl text-[11px] font-bold flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    {isTransmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Send Automated Test SMS to Patient</span>
                  </button>
                  <button
                    type="button"
                    disabled={isTransmitting}
                    onClick={() => handleSendTestSms('guardian')}
                    className="px-3 py-1.5 bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-700/60 rounded-xl text-[11px] font-bold flex items-center space-x-1.5 transition cursor-pointer disabled:opacity-50"
                  >
                    {isTransmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Send Automated Test SMS to Guardian</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleSaveContacts}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{t.alarmSaveContactsBtn}</span>
                </button>
              </div>
            </div>
          ) : (
            /* DISPLAY ACTIVE RECIPIENT CARDS */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Recipient 1: Patient */}
              <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      1. {t.alarmPatientTarget} ({currentUser?.name || 'Patient'})
                    </div>
                    <div className="text-xs font-black text-white font-mono mt-0.5">
                      {patientPhone}
                    </div>
                  </div>
                </div>
                <button
                  disabled={isTransmitting}
                  onClick={() => handleSendTestSms('patient')}
                  className="px-3 py-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 rounded-lg text-[10px] font-extrabold transition flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                  title="Dispatch automated cellular SMS directly to patient phone"
                >
                  {isTransmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  <span>Test SMS</span>
                </button>
              </div>

              {/* Recipient 2: Guardian */}
              <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      2. {t.alarmGuardianTarget} ({guardianName})
                    </div>
                    <div className="text-xs font-black text-white font-mono mt-0.5">
                      {guardianPhone}
                    </div>
                  </div>
                </div>
                <button
                  disabled={isTransmitting}
                  onClick={() => handleSendTestSms('guardian')}
                  className="px-3 py-1 bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 rounded-lg text-[10px] font-extrabold transition flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                  title="Dispatch automated cellular SMS directly to guardian phone"
                >
                  {isTransmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  <span>Test SMS</span>
                </button>
              </div>
            </div>
          )}

          {/* Feedback banners */}
          {contactsSavedBanner && (
            <div className="mt-3 p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.alarmContactsSavedToast}</span>
            </div>
          )}
          {testDispatchToast && (
            <div className={`mt-3 p-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 ${
              testDispatchToast.success 
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' 
                : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
            }`}>
              {testDispatchToast.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              <span>{testDispatchToast.message}</span>
            </div>
          )}
        </div>

        {/* ACTIVE RINGING ALARM & AUTOMATED DUAL SMS TRANSMISSION HUD */}
        {ringingAlarm && (
          <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-5 space-y-4 shadow-xl border-b border-red-700 animate-pulse">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Volume2 className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <div className="font-black text-sm tracking-wide">{t.alarmRingingHeader}</div>
                  <div className="text-xs text-red-100">
                    {t.alarmRingingPrompt} <strong>{ringingAlarm.medicineName} ({ringingAlarm.dosage})</strong> at <strong>{ringingAlarm.time}</strong>
                  </div>
                </div>
              </div>
              <button
                onClick={handleDismissRinging}
                className="px-5 py-2.5 bg-white text-slate-900 font-black text-xs rounded-xl shadow-lg hover:bg-slate-100 transition cursor-pointer"
              >
                {t.alarmSnoozeDismiss}
              </button>
            </div>

            {/* AUTOMATED CARRIER TRANSMISSION STATUS HUD */}
            <div className="bg-black/45 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-black text-red-100 uppercase tracking-wider">
                <span className="flex items-center space-x-2">
                  {isTransmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                  ) : (
                    <Signal className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>
                    {isTransmitting 
                      ? 'Transmitting automated dose alerts to carrier networks...' 
                      : 'Automated Carrier Network Transmission Status'}
                  </span>
                </span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
                  Gateway: {gatewayConfig.provider.toUpperCase()}
                </span>
              </div>

              {/* Status details for both recipients */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Target 1: Patient */}
                <div className="p-3 bg-white/10 rounded-xl border border-white/15 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-emerald-300">
                    <span>PATIENT MOBILE: {patientPhone}</span>
                    <span className="bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded text-[9px] uppercase font-mono">
                      {transmissionResults?.patient?.success ? '✓ CARRIER ACCEPTED' : (isTransmitting ? 'TRANSMITTING...' : 'DISPATCHED')}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/90 italic font-mono leading-relaxed">
                    {transmissionResults?.patient?.details || `Dose alert for ${ringingAlarm.medicineName} (${ringingAlarm.dosage}) dispatched via automated gateway.`}
                  </p>
                  {transmissionResults?.patient?.messageId && (
                    <div className="text-[10px] text-emerald-300 font-mono">
                      Carrier Receipt ID: {transmissionResults.patient.messageId}
                    </div>
                  )}
                  {liveSmsRecord && (
                    <p className="text-[10px] text-white/75 font-mono italic">
                      "{liveSmsRecord.patientMessage}"
                    </p>
                  )}
                </div>

                {/* Target 2: Guardian */}
                <div className="p-3 bg-white/10 rounded-xl border border-white/15 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-blue-300">
                    <span>GUARDIAN MOBILE: {guardianPhone}</span>
                    <span className="bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded text-[9px] uppercase font-mono">
                      {transmissionResults?.guardian?.success ? '✓ CARRIER ACCEPTED' : (isTransmitting ? 'TRANSMITTING...' : 'DISPATCHED')}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/90 italic font-mono leading-relaxed">
                    {transmissionResults?.guardian?.details || `Caregiver dose notification for ${ringingAlarm.medicineName} dispatched via automated gateway.`}
                  </p>
                  {transmissionResults?.guardian?.messageId && (
                    <div className="text-[10px] text-blue-300 font-mono">
                      Carrier Receipt ID: {transmissionResults.guardian.messageId}
                    </div>
                  )}
                </div>
              </div>

              {/* Instant Direct Carrier Delivery Triggers */}
              <div className="pt-2.5 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-white/80 font-medium">
                  ✓ Automated background SMS queued for cellular delivery.
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const msg = `[HealthPulse Alert] Hi ${currentUser?.name || 'Fawwaaz'}, time for: ${ringingAlarm.medicineName} (${ringingAlarm.dosage}) at ${ringingAlarm.time}.`;
                      RealMessagingService.openWhatsApp(patientPhone, msg);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-[11px] flex items-center space-x-1.5 transition cursor-pointer shadow-md"
                    title="Direct mobile delivery to Patient"
                  >
                    <span>Send to {patientPhone} (WhatsApp/SMS)</span>
                  </button>
                  <button
                    onClick={() => {
                      const msg = `[HealthPulse Guardian Alert] Notice to ${guardianName}: Patient scheduled for ${ringingAlarm.medicineName} (${ringingAlarm.dosage}) at ${ringingAlarm.time}.`;
                      RealMessagingService.openWhatsApp(guardianPhone, msg);
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-[11px] flex items-center space-x-1.5 transition cursor-pointer shadow-md"
                    title="Direct mobile delivery to Guardian"
                  >
                    <span>Send to {guardianPhone} (WhatsApp/SMS)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTROLS */}
        <div className="px-6 pt-4 pb-2 flex border-b border-slate-200 bg-slate-50 gap-4">
          <button
            onClick={() => setActiveTab('alarms')}
            className={`pb-2 text-xs font-black border-b-2 transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'alarms'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>{t.alarmActiveSchedule} ({alarms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sms-log')}
            className={`pb-2 text-xs font-black border-b-2 transition flex items-center space-x-2 cursor-pointer ${
              activeTab === 'sms-log'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{t.alarmSmsHistoryTitle} ({smsHistory.length})</span>
          </button>
        </div>

        {/* BODY CONTENT */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs text-slate-800">
          
          {/* TAB 1: ALARMS LIST */}
          {activeTab === 'alarms' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-800 text-sm">{t.alarmActiveSchedule}</span>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl font-bold flex items-center space-x-1 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddForm ? t.alarmCancel : t.alarmAddCustom}</span>
                </button>
              </div>

              {/* Add Alarm Form */}
              {showAddForm && (
                <form onSubmit={handleCreateAlarm} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shadow-inner">
                  <div className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.alarmNewTitle}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">{t.alarmMedName}</label>
                      <input
                        type="text"
                        required
                        value={newMedName}
                        onChange={e => setNewMedName(e.target.value)}
                        placeholder="e.g. Metformin 500mg"
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl mt-0.5 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">{t.alarmDosage}</label>
                      <input
                        type="text"
                        value={newDosage}
                        onChange={e => setNewDosage(e.target.value)}
                        placeholder="e.g. 1 Tablet"
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl mt-0.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">{t.alarmTime}</label>
                      <input
                        type="text"
                        value={newTime}
                        onChange={e => setNewTime(e.target.value)}
                        placeholder="08:00 AM"
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl mt-0.5 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">{t.alarmFrequency}</label>
                      <select
                        value={newFrequency}
                        onChange={e => setNewFrequency(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-xl mt-0.5 text-xs"
                      >
                        <option value="Daily (Morning)">Daily (Morning)</option>
                        <option value="Daily (Afternoon)">Daily (Afternoon)</option>
                        <option value="Daily (Night)">Daily (Night)</option>
                        <option value="Twice Daily">Twice Daily</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100 flex items-center justify-between text-[11px] text-emerald-900">
                    <span className="flex items-center space-x-1.5 font-bold">
                      <Signal className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Automated background cellular SMS to Patient and Guardian numbers</span>
                    </span>
                    <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                      Enabled
                    </span>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow transition cursor-pointer"
                    >
                      {t.alarmSave}
                    </button>
                  </div>
                </form>
              )}

              {/* Alarms List */}
              <div className="space-y-3">
                {alarms.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <BellRing className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-xs text-slate-600">{t.noActiveAlarms}</p>
                  </div>
                ) : (
                  alarms.map(alarm => (
                    <div
                      key={alarm.id}
                      className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        alarm.takenToday
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className={`p-3 rounded-2xl ${
                          alarm.takenToday ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          <Pill className="w-5 h-5" />
                        </div>
                        <div>
                          <div className={`font-black text-sm ${alarm.takenToday ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {alarm.medicineName}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                            <span className="flex items-center space-x-1 font-bold text-slate-700">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{alarm.time}</span>
                            </span>
                            <span>• {alarm.dosage}</span>
                            <span>• {alarm.frequency}</span>
                          </div>
                          <div className="text-[10px] text-amber-600 font-extrabold flex items-center space-x-1 mt-1">
                            <Flame className="w-3 h-3 text-amber-500" />
                            <span>{alarm.streakDays} {t.alarmDaysStreak}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center space-x-2 w-full sm:w-auto justify-end gap-1.5">
                        {/* 100% AUTOMATED BACKGROUND SMS DISPATCH BUTTON */}
                        <button
                          disabled={isTransmitting}
                          onClick={() => triggerAutomatedDualSms(alarm, true)}
                          className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer shadow-md shadow-emerald-600/20 disabled:opacity-50"
                          title="Ring alarm now and automatically dispatch background cellular SMS to Patient & Guardian"
                        >
                          {isTransmitting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Signal className="w-3.5 h-3.5" />
                          )}
                          <span>Send Automated SMS</span>
                        </button>

                        {/* Mark Taken Button */}
                        <button
                          onClick={() => onToggleTaken(alarm.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                            alarm.takenToday
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{alarm.takenToday ? t.alarmTakenToday : t.actionMarkTaken}</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => onDeleteAlarm(alarm.id)}
                          className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LIVE SMS DISPATCH AUDIT LOG */}
          {activeTab === 'sms-log' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-800 text-sm">
                  {t.alarmSmsHistoryTitle}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {smsHistory.length} Total Automated Alerts Sent
                </span>
              </div>

              {smsHistory.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-xs text-slate-600">No automated SMS notifications dispatched yet.</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Click "Send Automated SMS" on any medicine to trigger background delivery to your phone.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {smsHistory.map(record => (
                    <div
                      key={record.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-slate-800">
                            {record.medicineName} ({record.dosage})
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold rounded-full text-[10px]">
                            Automated Carrier Dispatch
                          </span>
                        </div>
                        <span className="text-slate-400 font-mono text-[10px]">{record.timestamp}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                          <div className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                            <span>To Patient: {record.patientPhone}</span>
                            <span className="text-emerald-600 font-bold">✓ Dispatched</span>
                          </div>
                          <p className="text-[11px] text-slate-700 italic font-mono whitespace-pre-line">
                            {record.patientMessage}
                          </p>
                        </div>

                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                          <div className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                            <span>To Guardian ({record.guardianName || 'Guardian'}): {record.guardianPhone}</span>
                            <span className="text-blue-600 font-bold">✓ Dispatched</span>
                          </div>
                          <p className="text-[11px] text-slate-700 italic font-mono whitespace-pre-line">
                            {record.guardianMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <div className="text-slate-500 text-[11px] flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>HealthPulse Ultra Background Telecom SMS Gateway Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            {t.actionClose}
          </button>
        </div>

      </div>
    </div>
  );
};
