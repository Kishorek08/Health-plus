import React, { useState } from 'react';
import { 
  Building2, Users, BedDouble, DollarSign, 
  Search, Stethoscope 
} from 'lucide-react';
import { HospitalBed, HospitalInvoice, Doctor, Language } from '../types';
import { translations } from '../translations';
import { AiMedicalService } from '../services/aiMedicalService';

interface AdminDashboardProps {
  beds: HospitalBed[];
  invoices: HospitalInvoice[];
  doctors: Doctor[];
  language: Language;
  onUpdateBedStatus: (bedId: string, status: HospitalBed['status']) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  beds,
  invoices,
  doctors,
  language,
  onUpdateBedStatus
}) => {
  const t = translations[language] || translations.en;

  const [selectedWard, setSelectedWard] = useState<string>('ALL');
  const [bedSearch, setBedSearch] = useState('');

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.status === 'Occupied').length;
  const occupancyPercent = Math.round((occupiedBeds / (totalBeds || 1)) * 100);

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalPayable, 0);

  const wardTabs = [
    { key: 'ALL', label: t.wardAll },
    { key: 'ICU', label: t.wardIcu },
    { key: 'Emergency Care', label: t.wardEmergency },
    { key: 'Cardiology Ward', label: t.wardCardiology },
    { key: 'General Ward', label: t.wardGeneral },
    { key: 'Post-Surgical', label: t.wardPostSurgical }
  ];

  const filteredBeds = beds.filter(b => {
    const matchesWard = selectedWard === 'ALL' || b.ward.toLowerCase() === selectedWard.toLowerCase();
    const matchesSearch = b.bedNumber.toLowerCase().includes(bedSearch.toLowerCase()) ||
      (b.patientName && b.patientName.toLowerCase().includes(bedSearch.toLowerCase()));
    return matchesWard && matchesSearch;
  });

  const handleBedAction = (bedId: string, nextStatus: HospitalBed['status']) => {
    AiMedicalService.playChime('click');
    onUpdateBedStatus(bedId, nextStatus);
  };

  const getBedStatusLabel = (status: HospitalBed['status']) => {
    if (status === 'Occupied') return t.statusOccupied;
    if (status === 'Available') return t.statusAvailable;
    return t.statusCleaning;
  };

  return (
    <div className="space-y-6">
      
      {/* ADMIN STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total OPD Patients */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">142</div>
            <div className="text-xs font-semibold text-slate-500">{t.statTodayOPD}</div>
          </div>
        </div>

        {/* Bed Occupancy */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl">
            <BedDouble className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{occupancyPercent}%</div>
            <div className="text-xs font-semibold text-slate-500">{t.statBedOccupancy} ({occupiedBeds}/{totalBeds})</div>
          </div>
        </div>

        {/* Specialists On Duty */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{doctors.length}</div>
            <div className="text-xs font-semibold text-slate-500">{t.statAvailableSpecialists}</div>
          </div>
        </div>

        {/* Total Clinical Billing */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">₹{(totalRevenue * 12).toLocaleString()}</div>
            <div className="text-xs font-semibold text-slate-500">{t.statTotalRevenue}</div>
          </div>
        </div>

      </div>

      {/* WARD & ICU BED MANAGEMENT SUITE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>{t.navBedManagement}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {t.bedAllocationSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={bedSearch}
                onChange={e => setBedSearch(e.target.value)}
                placeholder={t.searchBedPlaceholder}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Ward Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {wardTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedWard(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedWard === tab.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Beds Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredBeds.map(bed => {
            const isOccupied = bed.status === 'Occupied';
            const isAvailable = bed.status === 'Available';

            return (
              <div
                key={bed.id}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
                  isOccupied
                    ? 'bg-red-50/40 border-red-200'
                    : isAvailable
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-amber-50/40 border-amber-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-sm text-slate-900">
                      {bed.bedNumber}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                      isOccupied
                        ? 'bg-red-100 text-red-800'
                        : isAvailable
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {getBedStatusLabel(bed.status)}
                    </span>
                  </div>

                  <div className="text-[11px] font-bold text-slate-600 mt-1">
                    {bed.ward}
                  </div>

                  {bed.oxygenSupport && (
                    <span className="inline-block mt-1 text-[9px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                      {t.oxygenActive}
                    </span>
                  )}

                  {isOccupied ? (
                    <div className="mt-2.5 p-2 bg-white/80 rounded-xl border border-red-100 text-xs space-y-0.5">
                      <div className="font-bold text-slate-900">{bed.patientName}</div>
                      <div className="text-[10px] text-slate-500">{t.admittedLabel}: {bed.admissionDate}</div>
                      <div className="text-[10px] text-slate-600 font-semibold">{bed.doctorInCharge}</div>
                    </div>
                  ) : (
                    <div className="mt-2.5 text-xs text-slate-400 italic">
                      {isAvailable ? t.readyForIntake : t.sanitationInProgress}
                    </div>
                  )}
                </div>

                {/* Bed Status Toggle Actions */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-1 text-[11px]">
                  {isOccupied && (
                    <button
                      onClick={() => handleBedAction(bed.id, 'Cleaning')}
                      className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition text-center cursor-pointer"
                    >
                      {t.dischargeAndSanitize}
                    </button>
                  )}
                  {bed.status === 'Cleaning' && (
                    <button
                      onClick={() => handleBedAction(bed.id, 'Available')}
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition text-center cursor-pointer"
                    >
                      {t.markAsReady}
                    </button>
                  )}
                  {isAvailable && (
                    <button
                      onClick={() => handleBedAction(bed.id, 'Occupied')}
                      className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition text-center cursor-pointer"
                    >
                      {t.allocatePatient}
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* REVENUE & BILLING SUMMARY TABLE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900">{t.navBilling}</h3>
            <p className="text-xs text-slate-500">{t.invoicesSubtitle}</p>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
            {invoices.length} {t.invoicesProcessed}
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                <th className="p-3">{t.thInvoiceId}</th>
                <th className="p-3">{t.thPatientName}</th>
                <th className="p-3">{t.thDate}</th>
                <th className="p-3">{t.thPhysician}</th>
                <th className="p-3">{t.thInsurance}</th>
                <th className="p-3">{t.thTotalPayable}</th>
                <th className="p-3">{t.thStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/60">
                  <td className="p-3 font-mono font-bold text-blue-700">{inv.id}</td>
                  <td className="p-3 font-bold text-slate-900">{inv.patientName}</td>
                  <td className="p-3 text-slate-600">{inv.date}</td>
                  <td className="p-3 text-slate-700">{inv.doctorName}</td>
                  <td className="p-3 text-emerald-600 font-semibold">₹{inv.insuranceCovered}</td>
                  <td className="p-3 font-extrabold text-slate-900">₹{inv.totalPayable}</td>
                  <td className="p-3">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {inv.status === 'Paid' ? t.statusPaid : t.statusPending}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
