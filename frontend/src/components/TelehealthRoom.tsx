import React, { useState } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Shield } from 'lucide-react';

export const TelehealthRoom = ({ patientName, doctorName, onClose }: { patientName: string; doctorName: string; onClose: () => void }) => {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[600px]">
        
        {/* Top bar */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-sm font-bold">Encrypted Telehealth Session</span>
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-400" /> HIPAA Secure
          </span>
        </div>

        {/* Video Screen Area */}
        <div className="flex-1 bg-slate-950 relative flex items-center justify-center p-4">
          <div className="text-center space-y-3">
            <div className="w-24 h-24 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto text-3xl font-bold">
              {doctorName[0]}
            </div>
            <h4 className="text-lg font-bold text-white">Consultation with Dr. {doctorName}</h4>
            <p className="text-xs text-slate-400">Patient: {patientName}</p>
          </div>

          {/* Self View Preview */}
          <div className="absolute bottom-4 right-4 w-40 h-28 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center text-xs text-slate-400 font-semibold shadow-lg">
            {videoOn ? 'Your Camera (Active)' : 'Camera Off'}
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-4">
          <button
            onClick={() => setMicOn(!micOn)}
            className={`p-3.5 rounded-2xl transition-all ${micOn ? 'bg-slate-800 text-white' : 'bg-red-500/20 text-red-400'}`}
          >
            {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setVideoOn(!videoOn)}
            className={`p-3.5 rounded-2xl transition-all ${videoOn ? 'bg-slate-800 text-white' : 'bg-red-500/20 text-red-400'}`}
          >
            {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
          >
            <PhoneOff className="w-5 h-5" /> End Call
          </button>
        </div>

      </div>
    </div>
  );
};