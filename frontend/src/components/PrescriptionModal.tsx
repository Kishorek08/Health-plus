import React from 'react';
import { Activity, Printer, Download, Pill, Calendar, User, FileText, CheckCircle2 } from 'lucide-react';

interface PrescriptionProps {
  doctorName: string;
  doctorSpecialty: string;
  patientName: string;
  patientEmail: string;
  date: string;
  symptoms: string;
  notes?: string;
  onClose: () => void;
}

export const PrescriptionModal: React.FC<PrescriptionProps> = ({
  doctorName,
  doctorSpecialty,
  patientName,
  patientEmail,
  date,
  symptoms,
  notes,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden print:shadow-none print:border-none print:w-full">
        
        {/* Header Bar (Hidden on Print) */}
        <div className="p-4 bg-slate-900 text-white flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <FileText className="w-4 h-4 text-blue-400" /> Medical Record & Prescription
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 space-y-6 text-slate-800" id="printable-rx">
          
          {/* Prescription Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 text-white rounded-2xl">
                <Activity className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">HealthPulse Care Network</h2>
                <p className="text-xs text-slate-500">Official Clinical Summary & Prescription</p>
              </div>
            </div>

            <div className="text-right">
              <h3 className="text-base font-bold text-slate-900">Dr. {doctorName}</h3>
              <p className="text-xs text-blue-600 font-semibold">{doctorSpecialty}</p>
              <p className="text-xs text-slate-400 mt-1">License No: HP-882910</p>
            </div>
          </div>

          {/* Patient Details Row */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Patient Name</span>
              <span className="font-bold text-slate-900 text-sm">{patientName}</span>
              <p className="text-slate-500">{patientEmail}</p>
            </div>
            <div className="text-right">
              <span className="text-slate-400 uppercase font-semibold text-[10px] block">Issued Date</span>
              <span className="font-bold text-slate-900 text-sm">{date || new Date().toISOString().split('T')[0]}</span>
              <p className="text-slate-500">Rx ID: #{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
          </div>

          {/* Clinical Findings / Symptoms */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chief Complaint & Diagnosis</h4>
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-slate-700 font-medium">
              {symptoms || 'General Medical Consultation'}
            </div>
          </div>

          {/* Prescribed Medications */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Pill className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Prescribed Medication (Rx)</h4>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <p className="text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap">
                {notes || 'No specific prescription entered. Follow standard care protocols and rest.'}
              </p>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-8 border-t border-slate-200 flex justify-between items-end">
            <div className="text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Digitally Authenticated Record
              </p>
              <p>HealthPulse EHR Platform • System Generated Copy</p>
            </div>

            <div className="text-center">
              <div className="font-serif italic text-lg text-slate-800 font-bold border-b border-slate-400 pb-1 px-4">
                Dr. {doctorName}
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold mt-1 block">Authorized Practitioner</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};