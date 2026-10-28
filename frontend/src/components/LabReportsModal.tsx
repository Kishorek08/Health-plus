import React, { useState } from 'react';
import { 
  FlaskConical, Printer, X, CheckCircle2 
} from 'lucide-react';
import { LabReport, Language } from '../types';
import { translations } from '../translations';
import { AiMedicalService } from '../services/aiMedicalService';

interface LabReportsModalProps {
  reports: LabReport[];
  language: Language;
  onClose: () => void;
}

export const LabReportsModal: React.FC<LabReportsModalProps> = ({
  reports,
  language,
  onClose
}) => {
  const t = translations[language] || translations.en;
  const [selectedReport, setSelectedReport] = useState<LabReport>(reports[0]);

  const handlePrint = () => {
    AiMedicalService.playChime('click');
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl max-w-4xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-w-none print:shadow-none print:border-none print:w-full">
        
        {/* Header - Hidden on Print */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold">{t.navLabReports}</h2>
              <p className="text-xs text-slate-400">Accredited Diagnostic Pathology & Molecular Biology</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.actionPrintPdf}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dual Panel Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden text-xs text-slate-800">
          
          {/* Reports Sidebar Selector - Hidden on Print */}
          <div className="bg-slate-50 border-r border-slate-200 p-4 space-y-2.5 overflow-y-auto print:hidden">
            <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider block">
              {t.rolePatient} {t.navLabReports} ({reports.length})
            </span>

            {reports.map(rep => (
              <button
                key={rep.id}
                onClick={() => {
                  AiMedicalService.playChime('click');
                  setSelectedReport(rep);
                }}
                className={`w-full text-left p-3 rounded-2xl border transition flex flex-col space-y-1 ${
                  selectedReport.id === rep.id
                    ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500'
                    : 'bg-white/60 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 truncate max-w-[170px]">{rep.testName}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    rep.status === 'Normal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rep.status === 'Normal' ? t.statusNormal : t.statusHigh}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>{rep.category}</span>
                  <span>{rep.date}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Report Viewer / Printable Area */}
          <div className="md:col-span-2 p-6 sm:p-8 space-y-5 overflow-y-auto bg-white print:p-0 print:col-span-3">
            
            {/* Report Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                  {selectedReport.category}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{selectedReport.testName}</h3>
                <p className="text-xs text-slate-500">ID: <span className="font-mono font-bold">{selectedReport.id}</span> • {t.thDate}: {selectedReport.date}</p>
              </div>

              <div className="text-right text-xs">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">{t.thPhysician}</span>
                <strong className="text-slate-800">{selectedReport.doctorName}</strong>
              </div>
            </div>

            {/* Test Results Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                    <th className="p-3">{t.rxMedicineName}</th>
                    <th className="p-3">{t.rxDosage}</th>
                    <th className="p-3">{t.statusNormal}</th>
                    <th className="p-3">{t.thStatus}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {selectedReport.results.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="p-3 font-bold text-slate-900">{item.parameter}</td>
                      <td className="p-3 font-mono font-extrabold text-blue-700">
                        {item.value} <span className="text-[10px] text-slate-500 font-normal">{item.unit}</span>
                      </td>
                      <td className="p-3 text-slate-600 font-mono text-[11px]">{item.normalRange} {item.unit}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          item.status === 'Normal'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status === 'Normal' ? t.statusNormal : t.statusHigh}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pathologist & Doctor Clinical Notes */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {t.rxClinicalAdvice}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {selectedReport.doctorNotes}
              </p>
            </div>

            {/* Verification Seal */}
            <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-[10px] text-slate-500">
              <div className="flex items-center space-x-1.5 text-emerald-600 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Diagnostic Pathology Report • ISO 15189 Accredited</span>
              </div>
              <div className="font-mono">HealthPulse Clinical Laboratories</div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
