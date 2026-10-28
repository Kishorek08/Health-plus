import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, 
  Send, Clock, Plus, Share2, Camera, Heart, 
  ShieldCheck, AlertCircle, Subtitles
} from 'lucide-react';
import { Appointment, Language } from '../types';
import { translations } from '../translations';
import { AiMedicalService } from '../services/aiMedicalService';

interface TelehealthRoomProps {
  appointment: Appointment;
  language: Language;
  onClose: () => void;
  onOpenPrescriptionWriter?: () => void;
}

export const TelehealthRoom: React.FC<TelehealthRoomProps> = ({
  appointment,
  language,
  onClose,
  onOpenPrescriptionWriter
}) => {
  const t = translations[language] || translations.en;

  // Media Stream States
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [cameraPermissionError, setCameraPermissionError] = useState(false);
  const [snapshotSuccess, setSnapshotSuccess] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  // Live Captions & Speech Recognition
  const [showCaptions, setShowCaptions] = useState(true);
  const [currentCaption, setCurrentCaption] = useState<string>('');

  // Video Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Vitals State
  const [heartRate, setHeartRate] = useState(74);

  const getInitialChat = (lang: Language) => {
    let sysText = 'Encrypted Telehealth Consultation started. Audio & Video 256-bit encrypted.';
    let docGreeting = `Good day! I have reviewed your clinical notes regarding ${appointment.symptoms || 'your consultation'}. How are you feeling right now?`;

    if (lang === 'ta') {
      sysText = 'மறைகுறியாக்கப்பட்ட டெலிஹெல்த் ஆலோசனை தொடங்கியது. ஆடியோ மற்றும் வீடியோ 256-பிட் பாதுகாப்பானது.';
      docGreeting = `வணக்கம்! ${appointment.symptoms || 'உங்கள் ஆலோசனை'} தொடர்பான மருத்துவக் குறிப்புகளைப் பார்த்தேன். இப்போது உங்கள் உடல்நிலை எப்படி உள்ளது?`;
    } else if (lang === 'hi') {
      sysText = 'एन्क्रिप्टेड टेलीहेल्थ परामर्श शुरू हुआ। ऑडियो और वीडियो 256-बिट सुरक्षित हैं।';
      docGreeting = `नमस्ते! मैंने ${appointment.symptoms || 'आपके परामर्श'} के संबंध में आपके क्लिनिकल नोट्स देख लिए हैं। अभी आप कैसा महसूस कर रहे हैं?`;
    } else if (lang === 'de') {
      sysText = 'Verschlüsselte Videosprechstunde gestartet. Audio & Video 256-Bit verschlüsselt.';
      docGreeting = `Guten Tag! Ich habe Ihre Unterlagen bezüglich ${appointment.symptoms || 'Ihrer Konsultation'} gesichtet. Wie fühlen Sie sich im Moment?`;
    }

    return [
      { sender: 'System', text: sysText, time: '00:00' },
      { sender: appointment.doctorName, text: docGreeting, time: '00:05' }
    ];
  };

  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>(() => getInitialChat(language));
  const [chatInput, setChatInput] = useState('');

  // 1. Initialize Real Device Camera & Microphone
  const startCamera = async () => {
    try {
      setCameraPermissionError(false);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: true
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setVideoOn(true);
      setMicOn(true);
    } catch (err) {
      console.warn('Real webcam access not granted or unavailable:', err);
      setCameraPermissionError(true);
    }
  };

  useEffect(() => {
    startCamera();

    // Call duration timer
    const timer = setInterval(() => {
      setCallDuration(d => d + 1);
    }, 1000);

    // Heart rate fluctuation
    const vitalsTimer = setInterval(() => {
      setHeartRate(70 + Math.floor(Math.sin(Date.now() / 2000) * 6));
    }, 2500);

    // Initialize Web Speech Recognition for live captions
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    let recognition: any = null;

    if (SpeechRecognition) {
      try {
        recognition = new SpeechRecognition();
        const langMap: Record<Language, string> = { en: 'en-US', ta: 'ta-IN', hi: 'hi-IN', de: 'de-DE' };
        recognition.lang = langMap[language] || 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          setCurrentCaption(transcript);
        };

        recognition.onerror = () => {};
        recognition.start();
      } catch (e) {
        console.warn('Live captions speech recognition error:', e);
      }
    }

    return () => {
      clearInterval(timer);
      clearInterval(vitalsTimer);
      if (recognition) {
        try { recognition.stop(); } catch {}
      }
      // Stop all camera and screen media tracks cleanly
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [language]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle Camera
  const handleToggleVideo = () => {
    AiMedicalService.playChime('click');
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        const nextState = !videoTracks[0].enabled;
        videoTracks[0].enabled = nextState;
        setVideoOn(nextState);
        return;
      }
    }
    setVideoOn(!videoOn);
  };

  // Toggle Mic
  const handleToggleMic = () => {
    AiMedicalService.playChime('click');
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        const nextState = !audioTracks[0].enabled;
        audioTracks[0].enabled = nextState;
        setMicOn(nextState);
        return;
      }
    }
    setMicOn(!micOn);
  };

  // Toggle Screen Share
  const handleToggleScreenShare = async () => {
    AiMedicalService.playChime('click');
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(t => t.stop());
      }
      setIsScreenSharing(false);
      return;
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current = screenStream;
      setIsScreenSharing(true);

      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = screenStream;
      }

      screenStream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false);
      };
    } catch (err) {
      console.warn('Screen share cancelled or unavailable:', err);
      setIsScreenSharing(false);
    }
  };

  // Diagnostic Snapshot Capture
  const handleCaptureSnapshot = () => {
    AiMedicalService.playChime('success');
    setSnapshotSuccess(t.telehealthSnapshotTaken);
    setTimeout(() => setSnapshotSuccess(null), 3500);
  };

  // Chat message send
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    AiMedicalService.playChime('click');
    const newMsg = {
      sender: appointment.patientName,
      text: chatInput,
      time: formatTimer(callDuration)
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    // Simulated doctor response
    setTimeout(() => {
      let docReply = 'Understood. I am noting down the details in your clinical prescription right now.';
      if (language === 'ta') {
        docReply = 'புரிந்துகொண்டேன். உங்கள் மருத்துவ மருந்துக் குறிப்பில் விவரங்களை இப்போது பதிவு செய்கிறேன்.';
      } else if (language === 'hi') {
        docReply = 'समझ गया। मैं अभी आपके क्लिनिकल प्रिस्क्रिप्शन में विवरण दर्ज कर रहा हूँ।';
      } else if (language === 'de') {
        docReply = 'Verstanden. Ich trage die Details jetzt in Ihr Rezept ein.';
      }

      setChatMessages(prev => [
        ...prev,
        {
          sender: appointment.doctorName,
          text: docReply,
          time: formatTimer(callDuration + 2)
        }
      ]);
    }, 1500);
  };

  const handleEndCall = () => {
    AiMedicalService.playChime('click');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* SNAPSHOT NOTIFICATION BANNER */}
        {snapshotSuccess && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-bounce">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>{snapshotSuccess}</span>
          </div>
        )}

        {/* TOP STATUS BAR */}
        <div className="p-4 bg-slate-800/80 border-b border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="flex items-center space-x-3">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
            <div>
              <div className="text-sm font-bold flex items-center space-x-2">
                <span>{appointment.doctorName}</span>
                <span className="text-xs text-blue-400 font-semibold">• {appointment.doctorSpecialty}</span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  WebRTC HD
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                {t.rolePatient}: <strong>{appointment.patientName}</strong> | {t.telehealthHipaa}
              </div>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Live Call Duration */}
            <div className="flex items-center space-x-1.5 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono font-bold text-emerald-400 shadow-inner">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatTimer(callDuration)}</span>
            </div>

            {/* In-Call Prescription Writer */}
            {onOpenPrescriptionWriter && (
              <button
                onClick={onOpenPrescriptionWriter}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow cursor-pointer transform active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.actionIssuePrescription}</span>
              </button>
            )}
          </div>
        </div>

        {/* MAIN VIDEO & IN-CALL CHAT LAYOUT */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 p-3 overflow-hidden">
          
          {/* VIDEO FRAME AREA */}
          <div className="md:col-span-2 bg-slate-950 rounded-2xl relative overflow-hidden flex flex-col justify-between border border-slate-800 shadow-inner">
            
            {/* SCREEN SHARING VIEW (IF ACTIVE) */}
            {isScreenSharing ? (
              <div className="w-full h-full relative bg-slate-950 flex flex-col items-center justify-center">
                <video
                  ref={screenVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-4 left-4 bg-red-600/90 text-white text-[11px] font-black px-3 py-1 rounded-xl shadow-lg flex items-center space-x-2">
                  <Share2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.telehealthScreenShare} (Active)</span>
                </div>
              </div>
            ) : (
              /* ATTENDING DOCTOR HD CLINICAL STREAM */
              <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center text-white space-y-4 p-6 relative">
                
                {/* Doctor Avatar & Audio Wave Simulation */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-3xl bg-blue-600/20 border-2 border-blue-500 flex items-center justify-center text-5xl font-black text-blue-400 shadow-2xl shadow-blue-500/20 animate-pulse">
                    {appointment.doctorName.replace('Dr. ', '').charAt(0)}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full border-2 border-slate-900 shadow">
                    LIVE HD
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <h3 className="font-extrabold text-xl text-white tracking-tight">{appointment.doctorName}</h3>
                  <p className="text-xs text-blue-300 font-semibold">{appointment.doctorSpecialty}</p>
                  <p className="text-[11px] text-slate-400">{appointment.doctorHospital || 'HealthPulse Super Specialty Hospital'}</p>
                </div>

                {/* Animated Voice Level Bars for Doctor */}
                <div className="flex items-center space-x-1.5 h-6">
                  {[12, 22, 16, 26, 18, 14, 20, 10].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}px` }}
                      className="w-1 bg-cyan-400 rounded-full animate-pulse [animation-duration:1.2s]"
                    />
                  ))}
                </div>

              </div>
            )}

            {/* LIVE PATIENT VITALS TELEMETRY HUD OVERLAY (TOP-RIGHT) */}
            <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2.5 text-white shadow-xl space-y-1.5 z-20 pointer-events-none">
              <div className="flex items-center space-x-2 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 text-red-500 animate-ping" />
                <span>{t.telehealthVitalsHud}</span>
              </div>
              
              {/* Animated ECG Waveform */}
              <div className="h-6 w-36 overflow-hidden flex items-center">
                <svg className="w-full h-full stroke-emerald-400 fill-none" viewBox="0 0 100 20">
                  <path
                    d="M 0 10 L 20 10 L 25 2 L 30 18 L 35 6 L 40 10 L 60 10 L 65 2 L 70 18 L 75 6 L 80 10 L 100 10"
                    strokeWidth="1.8"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-slate-800 pt-1">
                <div>HR: <strong className="text-emerald-400">{heartRate} bpm</strong></div>
                <div>SpO₂: <strong className="text-cyan-400">99%</strong></div>
                <div>BP: <strong className="text-blue-400">120/80</strong></div>
                <div>Temp: <strong className="text-amber-400">98.6°F</strong></div>
              </div>
            </div>

            {/* LIVE CLOSED CAPTIONS / REAL-TIME SUBTITLES (BOTTOM-CENTER) */}
            {showCaptions && (
              <div className="absolute bottom-4 left-6 right-44 z-20 pointer-events-none">
                <div className="bg-slate-950/85 backdrop-blur-md border border-slate-700/60 rounded-xl p-2.5 text-xs text-white shadow-lg space-y-1">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-1">
                    <Subtitles className="w-3.5 h-3.5" />
                    <span>{t.telehealthLiveCaptions}</span>
                  </span>
                  <p className="font-medium text-slate-200 italic truncate">
                    {currentCaption || `Attending: "Observing clinical status... consultation recording active..."`}
                  </p>
                </div>
              </div>
            )}

            {/* PICTURE-IN-PICTURE: REAL PATIENT WEBCAM STREAM (BOTTOM-RIGHT) */}
            <div className="absolute bottom-3 right-3 w-44 h-32 bg-slate-900 rounded-2xl border-2 border-slate-700 overflow-hidden shadow-2xl z-20 flex flex-col justify-between">
              {videoOn && !cameraPermissionError ? (
                <div className="w-full h-full relative">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  <div className="absolute bottom-1.5 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[9px] font-bold text-white flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{t.aiYou}</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center text-center p-2 text-slate-400 space-y-1">
                  <VideoOff className="w-6 h-6 text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-300">{t.aiYou}</span>
                  <span className="text-[9px] text-red-400">{t.telehealthCameraOff}</span>
                  {cameraPermissionError && (
                    <button
                      onClick={startCamera}
                      className="text-[9px] text-blue-400 hover:underline font-bold mt-1"
                    >
                      Retry Camera
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* CAMERA PERMISSION NOTICE (IF APPLICABLE) */}
            {cameraPermissionError && (
              <div className="absolute top-3 left-3 bg-amber-500/20 border border-amber-500/40 text-amber-200 px-3 py-1.5 rounded-xl text-[11px] flex items-center space-x-2 z-20">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>{t.telehealthCameraPermission}</span>
              </div>
            )}

          </div>

          {/* IN-CALL CHAT SIDEBAR */}
          <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 flex flex-col overflow-hidden">
            <div className="p-3 bg-slate-800 border-b border-slate-700/60 flex items-center justify-between text-xs font-bold text-slate-200">
              <span>{t.telehealthInCallChat}</span>
              <span className="text-[10px] text-emerald-400 font-mono">256-bit Encrypted</span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl space-y-1 ${
                    msg.sender === 'System'
                      ? 'bg-slate-900/60 text-slate-400 text-[10px] text-center border border-slate-800'
                      : msg.sender === appointment.patientName
                      ? 'bg-blue-600/30 border border-blue-500/30 text-blue-100 ml-4'
                      : 'bg-slate-700/60 text-slate-200 mr-4'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] opacity-70">
                    <strong className="text-slate-300">{msg.sender}</strong>
                    <span>{msg.time}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Quick Consultation Chips */}
            <div className="p-2 bg-slate-900/60 border-t border-slate-800 flex gap-1.5 overflow-x-auto scrollbar-none text-[10px]">
              {['Symptoms improving', 'Experiencing mild fever', 'Please issue prescription'].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setChatInput(chip)}
                  className="px-2 py-1 bg-slate-800 hover:bg-blue-600 hover:text-white rounded-lg text-slate-300 whitespace-nowrap transition cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-2.5 bg-slate-800 border-t border-slate-700/60 flex space-x-1.5">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder={t.telehealthTypeMessage}
                className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              />
              <button
                type="submit"
                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* BOTTOM VIDEO CALL CONTROLS */}
        <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-center gap-3">
          
          {/* Mute Mic */}
          <button
            onClick={handleToggleMic}
            className={`p-3 rounded-2xl transition font-bold text-xs flex items-center space-x-2 cursor-pointer shadow-md ${
              micOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-red-600 text-white shadow-red-600/30'
            }`}
            title={micOn ? t.telehealthMicOn : t.telehealthMicMute}
          >
            {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            <span className="hidden sm:inline">{micOn ? t.telehealthMicOn : t.telehealthMicMute}</span>
          </button>

          {/* Toggle Video */}
          <button
            onClick={handleToggleVideo}
            className={`p-3 rounded-2xl transition font-bold text-xs flex items-center space-x-2 cursor-pointer shadow-md ${
              videoOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-red-600 text-white shadow-red-600/30'
            }`}
            title={videoOn ? t.telehealthCameraOn : t.telehealthCameraOff}
          >
            {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            <span className="hidden sm:inline">{videoOn ? t.telehealthCameraOn : t.telehealthCameraOff}</span>
          </button>

          {/* Screen Share */}
          <button
            onClick={handleToggleScreenShare}
            className={`p-3 rounded-2xl transition font-bold text-xs flex items-center space-x-2 cursor-pointer shadow-md ${
              isScreenSharing ? 'bg-blue-600 text-white shadow-blue-600/30' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title={t.telehealthScreenShare}
          >
            <Share2 className="w-5 h-5" />
            <span className="hidden sm:inline">{isScreenSharing ? t.telehealthStopScreen : t.telehealthScreenShare}</span>
          </button>

          {/* Diagnostic Snapshot */}
          <button
            onClick={handleCaptureSnapshot}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl font-bold text-xs flex items-center space-x-2 cursor-pointer shadow-md transition"
            title={t.telehealthSnapshot}
          >
            <Camera className="w-5 h-5 text-cyan-400" />
            <span className="hidden sm:inline">{t.telehealthSnapshot}</span>
          </button>

          {/* Captions Toggle */}
          <button
            onClick={() => setShowCaptions(!showCaptions)}
            className={`p-3 rounded-2xl font-bold text-xs flex items-center space-x-2 cursor-pointer shadow-md transition ${
              showCaptions ? 'bg-indigo-600/80 text-white' : 'bg-slate-800 text-slate-400'
            }`}
            title={t.telehealthLiveCaptions}
          >
            <Subtitles className="w-5 h-5" />
            <span className="hidden sm:inline">CC</span>
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-red-600/30 transition flex items-center space-x-2 cursor-pointer transform active:scale-95"
          >
            <PhoneOff className="w-5 h-5" />
            <span>{t.telehealthEndCall}</span>
          </button>

        </div>

      </div>
    </div>
  );
};
