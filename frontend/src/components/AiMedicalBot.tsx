import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Mic, MicOff, Volume2, 
  AlertTriangle, RefreshCw, User 
} from 'lucide-react';
import { AiChatMessage, Language } from '../types';
import { translations } from '../translations';
import { AiMedicalService } from '../services/aiMedicalService';

interface AiMedicalBotProps {
  language: Language;
  onBookSpecialist: (specialty: string) => void;
  onEmergencyTrigger: () => void;
  externalQuery?: string | null;
  onClearExternalQuery?: () => void;
}

export const AiMedicalBot: React.FC<AiMedicalBotProps> = ({
  language,
  onBookSpecialist,
  onEmergencyTrigger,
  externalQuery,
  onClearExternalQuery
}) => {
  const t = translations[language] || translations.en;

  const getInitialMessage = (lang: Language): AiChatMessage => {
    let text = `Hello! I am **MediPulse AI**, your comprehensive clinical assistant and triage engine.\n\nYou can describe any symptoms you are experiencing, ask about existing medical conditions, or get guidance on doctor appointments and prescriptions.\n\n*How can I help you today?*`;
    let suggestedPrompts = [
      'Chest tightness and shortness of breath',
      'Severe throbbing migraine with nausea',
      'High fever with shivering and body pain',
      'How do I download my prescription PDF?',
      'What are Dengue warning signs?'
    ];

    if (lang === 'ta') {
      text = `வணக்கம்! நான் உங்கள் **MediPulse AI** மருத்துவ உதவியாளர் மற்றும் அவசர வகைப்பாடு வழிகாட்டி.\n\nநீங்கள் அனுபவிக்கும் அறிகுறிகளை விவரிக்கலாம், ஏற்கனவே உள்ள மருத்துவ நிலைமைகள் பற்றி கேட்கலாம், அல்லது மருத்துவர் சந்திப்புகள் மற்றும் மருந்துக் குறிப்புகள் குறித்த வழிகாட்டுதலைப் பெறலாம்.\n\n*இன்று உங்களுக்கு நான் எவ்வாறு உதவ முடியும்?*`;
      suggestedPrompts = [
        'மார்பு இறுக்கம் மற்றும் மூச்சுத்திணறல்',
        'குமட்டலுடன் கடுமையான மைக்ரேன் தலைவலி',
        'நடுக்கம் மற்றும் உடல் வலியுடன் கடுமையான காய்ச்சல்',
        'மருந்துக் குறிப்பு PDF-ஐ எவ்வாறு பதிவிறக்குவது?',
        'டெங்கு காய்ச்சலின் எச்சரிக்கை அறிகுறிகள் யாவை?'
      ];
    } else if (lang === 'hi') {
      text = `नमस्ते! मैं **MediPulse AI** हूं, आपका व्यापक क्लिनिकल सहायक एवं ट्राइएज इंजन।\n\nआप अपने लक्षणों का वर्णन कर सकते हैं, मौजूदा बीमारियों के बारे में पूछ सकते हैं, या डॉक्टर अपॉइंटमेंट और नुस्खों पर मार्गदर्शन प्राप्त कर सकते हैं।\n\n*आज मैं आपकी क्या सहायता कर सकता हूँ?*`;
      suggestedPrompts = [
        'सीने में जकड़न और सांस लेने में तकलीफ',
        'मतली के साथ गंभीर माइग्रेन सिरदर्द',
        'कंपकंपी और शरीर दर्द के साथ तेज बुखार',
        'मैं अपना प्रिस्क्रिप्शन पीडीएफ कैसे डाउनलोड करूं?',
        'डेंगू के चेतावनी संकेत क्या हैं?'
      ];
    } else if (lang === 'de') {
      text = `Hallo! Ich bin **MediPulse KI**, Ihr umfassender klinischer Assistent und Triage-System.\n\nSie können Symptome beschreiben, Fragen zu Erkrankungen stellen oder Hilfe bei Arztterminen und Rezepten erhalten.\n\n*Wie kann ich Ihnen heute helfen?*`;
      suggestedPrompts = [
        'Druckgefühl in der Brust und Atemnot',
        'Schwere pulsierende Migräne mit Übelkeit',
        'Hohes Fieber mit Schüttelfrost und Gliederschmerzen',
        'Wie lade ich mein Rezept als PDF herunter?',
        'Was sind Warnzeichen bei Dengue-Fieber?'
      ];
    }

    return {
      id: 'msg-1',
      sender: 'ai',
      text,
      timestamp: 'Just now',
      suggestedPrompts
    };
  };

  const [messages, setMessages] = useState<AiChatMessage[]>([getInitialMessage(language)]);

  // Reset initial message when language changes if only 1 message exists
  useEffect(() => {
    setMessages(prev => {
      if (prev.length <= 1) {
        return [getInitialMessage(language)];
      }
      return prev;
    });
  }, [language]);

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle external query from Knowledge Base or Dashboard
  useEffect(() => {
    if (externalQuery && externalQuery.trim()) {
      handleSendMessage(externalQuery);
      if (onClearExternalQuery) onClearExternalQuery();
    }
  }, [externalQuery]);

  // Voice Recognition (Web Speech API)
  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const langCodeMap: Record<Language, string> = {
        en: 'en-US',
        ta: 'ta-IN',
        hi: 'hi-IN',
        de: 'de-DE'
      };
      recognition.lang = langCodeMap[language] || 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    AiMedicalService.playChime('click');

    const userMsg: AiChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI Engine Process
    setTimeout(() => {
      const { text, triage } = AiMedicalService.generateBotResponse(query, language);
      
      const aiReply: AiChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        triage
      };

      if (triage?.isRedFlag) {
        AiMedicalService.playChime('alert');
      }

      setMessages(prev => [...prev, aiReply]);
      setIsTyping(false);
    }, 700);
  };

  const handleSpeak = (text: string) => {
    AiMedicalService.speakText(text.replace(/[#*_`]/g, ''), language);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[78vh] max-h-[820px]">
      
      {/* BOT HEADER */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">{t.aiTitle}</h2>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{t.aiActive247}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300 hidden sm:block">
              {t.aiSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([getInitialMessage(language)]);
            AiMedicalService.stopSpeaking();
          }}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition text-xs font-semibold flex items-center space-x-1 cursor-pointer"
          title={t.aiReset}
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden md:inline">{t.aiReset}</span>
        </button>
      </div>

      {/* CHAT MESSAGES BODY */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50 text-xs text-slate-800">
        
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] sm:max-w-[75%] space-y-2 ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none shadow-md'
                : 'bg-white text-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm'
            }`}>
              {/* Message Header */}
              <div className="flex items-center justify-between gap-4 text-[10px] opacity-70">
                <span className="font-bold">{msg.sender === 'user' ? t.aiYou : t.aiAssistantName}</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Text Body */}
              <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed font-normal">
                {msg.text}
              </div>

              {/* TRIAGE CARD (IF PRESENT) */}
              {msg.triage && (
                <div className={`mt-3 p-4 rounded-2xl border space-y-3 ${
                  msg.triage.isRedFlag
                    ? 'bg-red-50 border-red-300 text-red-900'
                    : 'bg-blue-50/60 border-blue-200 text-slate-900'
                }`}>
                  
                  {/* Urgency Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      msg.triage.urgency === 'Emergency'
                        ? 'bg-red-600 text-white animate-pulse'
                        : msg.triage.urgency === 'Urgent'
                        ? 'bg-amber-500 text-white'
                        : 'bg-blue-600 text-white'
                    }`}>
                      {msg.triage.urgency === 'Emergency' ? t.aiUrgencyEmergency : msg.triage.urgency === 'Urgent' ? t.aiUrgencyUrgent : t.aiUrgencyRoutine}
                    </span>
                    <span className="text-[11px] font-bold">
                      {t.aiAcuity}: {msg.triage.urgencyScore}/10
                    </span>
                  </div>

                  {/* Red-Flag Alert */}
                  {msg.triage.isRedFlag && (
                    <div className="p-3 bg-red-600 text-white rounded-xl flex items-center justify-between gap-3 shadow-md">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-bounce" />
                        <span className="font-bold text-xs">{t.aiRedFlagWarning}</span>
                      </div>
                      <button
                        onClick={onEmergencyTrigger}
                        className="px-3 py-1.5 bg-white text-red-700 font-black rounded-lg text-xs hover:bg-red-50 shadow transition flex-shrink-0 cursor-pointer"
                      >
                        DIAL 108 / 112
                      </button>
                    </div>
                  )}

                  {/* Specialist Match */}
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200/80">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        {t.aiRecommendedDepartment}
                      </span>
                      <span className="font-extrabold text-sm text-slate-900">
                        {msg.triage.recommendedSpecialty}
                      </span>
                    </div>
                    <button
                      onClick={() => onBookSpecialist(msg.triage!.recommendedSpecialty)}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
                    >
                      {t.aiBookSpecialist}
                    </button>
                  </div>

                </div>
              )}

              {/* Bot Tools (Read Aloud) */}
              {msg.sender === 'ai' && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <button
                    onClick={() => handleSpeak(msg.text)}
                    className="hover:text-blue-600 flex items-center space-x-1 transition cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{t.aiReadAloud}</span>
                  </button>
                  <span className="text-[10px]">MediPulse Clinical Neural Net</span>
                </div>
              )}

              {/* Suggested Prompts */}
              {msg.suggestedPrompts && (
                <div className="pt-2 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t.aiQuickChipsTitle}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-[11px] font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-700 transition cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center space-x-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-xs text-slate-500 font-semibold ml-1">{t.aiAnalyzing}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          {/* Voice Input Toggle */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-3 rounded-2xl transition cursor-pointer ${
              isListening
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title={isListening ? t.actionStopVoice : t.actionSpeakVoice}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={isListening ? t.aiListening : t.aiInputPlaceholder}
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-medium"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-2xl shadow-lg shadow-blue-600/30 transition transform active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Disclaimer */}
        <div className="text-[10px] text-slate-400 text-center mt-2">
          {t.aiDisclaimer}
        </div>
      </div>

    </div>
  );
};
