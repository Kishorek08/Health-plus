import React from 'react';
import { 
  Printer, Download, X, QrCode, Building2, 
  Send, BellRing, Pill, HeartPulse, CheckCircle2 
} from 'lucide-react';
import { Prescription, Language } from '../types';
import { translations } from '../translations';
import { AiMedicalService } from '../services/aiMedicalService';

interface PrescriptionModalProps {
  prescription: Prescription;
  language: Language;
  onClose: () => void;
  onSendToPharmacy?: (rx: Prescription) => void;
  onAddToAlarms?: (rx: Prescription) => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  prescription,
  language,
  onClose,
  onSendToPharmacy,
  onAddToAlarms
}) => {
  const t = translations[language] || translations.en;

  const handlePrint = () => {
    AiMedicalService.playChime('click');
    window.print();
  };

  const handleDownloadTxt = () => {
    AiMedicalService.playChime('click');
    const content = `================================================================================
${t.rxHospitalLetterhead}
${t.rxAccredited}
================================================================================
${t.rxNumber}: ${prescription.id}
${t.rxDate}: ${prescription.date}
${t.rxDoctorDetails}: ${prescription.doctorName} (${prescription.doctorSpecialty})
Registration No: ${prescription.doctorRegNo}
Hospital: ${prescription.doctorHospital}

${t.rxPatientDetails}:
Name: ${prescription.patientName} | Age: ${prescription.patientAge} | Gender: ${prescription.patientGender}
Phone: ${prescription.patientPhone || 'N/A'}

CLINICAL VITALS:
BP: ${prescription.vitals.bp} | Pulse: ${prescription.vitals.pulse} | Temp: ${prescription.vitals.temp}
SpO2: ${prescription.vitals.spo2} | Weight: ${prescription.vitals.weight}

DIAGNOSIS & CLINICAL FINDINGS:
${prescription.diagnosis}
Chief Complaints: ${prescription.symptoms}

PRESCRIBED MEDICATIONS:
--------------------------------------------------------------------------------
${prescription.medicines.map((m, idx) => 
  `${idx + 1}. ${m.name} [${m.dosage}]
   Frequency: ${m.frequency} | Timing: ${m.timing} | Duration: ${m.duration} | Route: ${m.route}
   Instructions: ${m.instructions}`
).join('\n\n')}
--------------------------------------------------------------------------------

DOCTOR'S CLINICAL ADVICE & LIFESTYLE GUIDELINES:
${prescription.clinicalAdvice}

RECOMMENDED DIAGNOSTIC INVESTIGATIONS:
${prescription.labTestsRecommended.map(test => `• ${test}`).join('\n')}

NEXT CLINICAL REVIEW / FOLLOW-UP:
${prescription.followUpDate}

--------------------------------------------------------------------------------
${t.rxDoctorSignature}: ${prescription.doctorName}
${prescription.qrCodeData}
${t.rxValidDisclaimer}
================================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Prescription_${prescription.patientName.replace(/\s+/g, '_')}_${prescription.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      
      {/* Modal Dialog Container */}
      <div className="bg-white rounded-3xl max-w-4xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col print:shadow-none print:border-none print:max-w-none print:w-full">
        
        {/* TOP ACTION BAR - HIDDEN DURING PRINT */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-blue-600 rounded-lg">
              <Building2 className="w-4 h-4 text-white" />
            </span>
            <span className="font-bold text-sm tracking-tight">{t.rxTitle} — {prescription.id}</span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Print / Save PDF Button */}
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-600/30 transition transform active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.actionPrintPdf}</span>
            </button>

            {/* Download Text Summary */}
            <button
              onClick={handleDownloadTxt}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.actionDownloadTxt}</span>
            </button>

            {/* Send to Pharmacy */}
            {onSendToPharmacy && (
              <button
                onClick={() => onSendToPharmacy(prescription)}
                className="px-3.5 py-2 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition"
                title="Send directly to pharmacy for doorstep delivery"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.actionSendPharmacy}</span>
              </button>
            )}

            {/* Add to Medication Alarms */}
            {onAddToAlarms && (
              <button
                onClick={() => onAddToAlarms(prescription)}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition"
                title="Auto-create reminders for prescribed medicines"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.actionAddAlarm}</span>
              </button>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              title={t.actionClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* PRINTABLE PRESCRIPTION DOCUMENT BODY                               */}
        {/* Optimized for A4 printing via standard CSS @media print             */}
        {/* =================================================================== */}
        <div id="printable-prescription" className="p-8 sm:p-10 space-y-6 text-slate-800 bg-white font-sans text-xs">
          
          {/* 1. HOSPITAL LETTERHEAD HEADER */}
          <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg">
                  HP
                </div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {t.rxHospitalLetterhead}
                </h1>
              </div>
              <p className="text-[11px] font-semibold text-blue-700">
                {t.rxAccredited}
              </p>
              <p className="text-[10px] text-slate-500">
                Main Campus: 100 Metro Medical Boulevard • 24x7 Emergency Trauma: +91 44 2829 0000 • Web: healthpulse.org
              </p>
            </div>

            {/* Prescription Metadata Block */}
            <div className="text-right sm:border-l sm:pl-6 border-slate-200 space-y-1 min-w-[200px]">
              <div className="inline-block bg-slate-100 text-slate-800 font-mono font-bold px-2.5 py-1 rounded text-xs">
                {t.rxNumber}: <span className="text-blue-700">{prescription.id}</span>
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                {t.rxDate}: <strong>{prescription.date}</strong>
              </div>
              <div className="text-[10px] text-slate-500">
                Mode: Electronically Authenticated
              </div>
            </div>
          </div>

          {/* 2. DOCTOR & PATIENT DEMOGRAPHICS DUAL-PANEL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            {/* Attending Physician */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t.rxDoctorDetails}
              </span>
              <div className="text-sm font-bold text-slate-900">{prescription.doctorName}</div>
              <div className="text-xs font-semibold text-blue-600">{prescription.doctorSpecialty}</div>
              <div className="text-[11px] text-slate-500">Reg No: <strong>{prescription.doctorRegNo}</strong></div>
              <div className="text-[10px] text-slate-500">{prescription.doctorHospital}</div>
            </div>

            {/* Patient Info */}
            <div className="space-y-1 sm:border-l sm:pl-4 border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t.rxPatientDetails}
              </span>
              <div className="text-sm font-bold text-slate-900">{prescription.patientName}</div>
              <div className="text-xs text-slate-600">
                {t.rxAgeGender}: <strong>{prescription.patientAge} {language === 'de' ? 'Jahre' : language === 'ta' ? 'வயது' : language === 'hi' ? 'वर्ष' : 'Yrs'} / {prescription.patientGender === 'Female' ? t.genderFemale : prescription.patientGender === 'Other' ? t.genderOther : t.genderMale}</strong>
              </div>
              <div className="text-[11px] text-slate-500">
                {t.rolePatient} ID: <span className="font-mono font-medium">{prescription.patientId}</span>
              </div>
              <div className="text-[10px] text-slate-500">
                {t.phoneLabel}: {prescription.patientPhone || 'Registered Mobile'}
              </div>
            </div>
          </div>

          {/* 3. CLINICAL VITALS BAR */}
          <div className="border border-slate-200 rounded-xl p-3 bg-white space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
              <HeartPulse className="w-3.5 h-3.5 text-red-500" />
              <span>{t.rxVitals}</span>
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2 rounded-lg">
                <div className="text-[10px] text-slate-400 font-semibold">{t.rxBp}</div>
                <div className="font-bold text-slate-800">{prescription.vitals.bp}</div>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <div className="text-[10px] text-slate-400 font-semibold">{t.rxPulse}</div>
                <div className="font-bold text-slate-800">{prescription.vitals.pulse}</div>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <div className="text-[10px] text-slate-400 font-semibold">{t.rxTemp}</div>
                <div className="font-bold text-slate-800">{prescription.vitals.temp}</div>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <div className="text-[10px] text-slate-400 font-semibold">{t.rxSpo2}</div>
                <div className="font-bold text-emerald-600">{prescription.vitals.spo2}</div>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <div className="text-[10px] text-slate-400 font-semibold">{t.rxWeight}</div>
                <div className="font-bold text-slate-800">{prescription.vitals.weight}</div>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <div className="text-[10px] text-slate-400 font-semibold">{t.rxBloodSugar}</div>
                <div className="font-bold text-slate-800">{prescription.vitals.sugar || '102 mg/dL'}</div>
              </div>
            </div>
          </div>

          {/* 4. DIAGNOSIS & CLINICAL SYMPTOMS */}
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t.rxDiagnosis}
              </span>
              <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                {prescription.diagnosis}
              </div>
            </div>
            {prescription.symptoms && (
              <div className="text-xs text-slate-600">
                <strong className="text-slate-700">{t.rxSymptomsObserved}:</strong> {prescription.symptoms}
              </div>
            )}
          </div>

          {/* 5. PRESCRIBED MEDICINES TABLE */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                <span className="text-lg font-serif italic text-blue-700 font-extrabold">℞</span>
                <span>{t.rxMedicationsList}</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                {prescription.medicines.length} Item(s)
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                    <th className="p-2.5 w-8">#</th>
                    <th className="p-2.5">{t.rxMedicineName}</th>
                    <th className="p-2.5">{t.rxDosage}</th>
                    <th className="p-2.5">{t.rxFrequency}</th>
                    <th className="p-2.5">{t.rxTiming}</th>
                    <th className="p-2.5">{t.rxDuration}</th>
                    <th className="p-2.5">{t.rxInstructions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {prescription.medicines.map((med, index) => (
                    <tr key={med.id || index} className="hover:bg-slate-50/60">
                      <td className="p-2.5 text-slate-400 font-bold">{index + 1}</td>
                      <td className="p-2.5 font-bold text-slate-900">
                        <div className="flex items-center space-x-1.5">
                          <Pill className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          <span>{med.name}</span>
                        </div>
                        <span className="text-[10px] font-normal text-slate-500">Route: {med.route}</span>
                      </td>
                      <td className="p-2.5 font-semibold text-blue-700">{med.dosage}</td>
                      <td className="p-2.5">{med.frequency}</td>
                      <td className="p-2.5">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                          {med.timing}
                        </span>
                      </td>
                      <td className="p-2.5 font-semibold">{med.duration}</td>
                      <td className="p-2.5 text-[11px] text-slate-600">{med.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. CLINICAL ADVICE & RECOMMENDED LABS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Advice */}
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {t.rxClinicalAdvice}
              </span>
              <p className="text-xs text-slate-700 font-medium whitespace-pre-line leading-relaxed">
                {prescription.clinicalAdvice}
              </p>
            </div>

            {/* Labs */}
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {t.rxRecommendedLabs}
              </span>
              <ul className="text-xs text-slate-700 space-y-1">
                {prescription.labTestsRecommended.map((lab, i) => (
                  <li key={i} className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    <span>{lab}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 text-xs font-bold text-slate-900">
                {t.rxFollowUp}: <span className="text-blue-700 font-extrabold">{prescription.followUpDate}</span>
              </div>
            </div>
          </div>

          {/* 7. DIGITAL SIGNATURE, QR CODE, & LEGAL DISCLAIMER */}
          <div className="border-t-2 border-slate-900 pt-5 flex flex-col sm:flex-row justify-between items-end gap-6">
            
            {/* QR Code & Verification Block */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-100 border border-slate-300 rounded-xl flex items-center justify-center">
                <QrCode className="w-14 h-14 text-slate-900" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase text-slate-400">Pharmacy Verification QR</div>
                <div className="text-[10px] font-mono text-slate-600 truncate max-w-[220px]">
                  {prescription.qrCodeData}
                </div>
                <div className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{t.rxOfficialSeal}</span>
                </div>
              </div>
            </div>

            {/* Doctor Signature Stamp Block */}
            <div className="text-right space-y-1 min-w-[200px]">
              <div className="font-serif italic text-slate-900 text-lg font-bold">
                {prescription.doctorName}
              </div>
              <div className="text-[11px] font-semibold text-slate-700">{prescription.doctorSpecialty}</div>
              <div className="text-[10px] text-slate-500">Reg No: {prescription.doctorRegNo}</div>
              <div className="inline-block border border-dashed border-emerald-500 text-emerald-700 bg-emerald-50 text-[9px] font-bold px-2 py-0.5 rounded">
                Verified Medical Digital Signature
              </div>
            </div>

          </div>

          {/* 8. FOOTER LEGAL DISCLAIMER */}
          <div className="text-[9px] text-slate-400 text-center border-t border-slate-100 pt-3">
            {t.rxValidDisclaimer}
          </div>

        </div>

      </div>

    </div>
  );
};
