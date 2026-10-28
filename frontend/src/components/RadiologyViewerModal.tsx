import React, { useState } from 'react';
import { 
  X, Eye, EyeOff, ZoomIn, ZoomOut, RotateCcw, 
  Sparkles, CheckCircle, ShieldAlert, Sliders, Activity, Download
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { AiMedicalService } from '../services/aiMedicalService';

interface RadiologyViewerModalProps {
  language: Language;
  onClose: () => void;
  onAttachToChart?: (findings: string) => void;
}

interface ScanPreset {
  id: string;
  name: string;
  modality: string;
  bodyPart: string;
  patientId: string;
  finding: string;
  confidence: number;
  acuity: 'CRITICAL' | 'MODERATE' | 'MILD';
  dimensions: string;
  aiNotes: string;
}

export const RadiologyViewerModal: React.FC<RadiologyViewerModalProps> = ({
  language,
  onClose,
  onAttachToChart
}) => {
  const t = translations[language] || translations.en;

  const presets: ScanPreset[] = [
    {
      id: 'scan-1',
      name: 'Chest Radiograph (PA View)',
      modality: 'Digital X-Ray (CXR)',
      bodyPart: 'Thorax / Pulmonology',
      patientId: 'PT-8841-ALEX',
      finding: 'Right Middle Lobe Consolidation & Alveolar Infiltrate',
      confidence: 95.4,
      acuity: 'MODERATE',
      dimensions: '32 mm × 24 mm opacity',
      aiNotes: 'Consistent with bacterial lobar pneumonia. No signs of pneumothorax or pleural effusion. Trachea midline.'
    },
    {
      id: 'scan-2',
      name: 'Brain Axial MRI (T2-FLAIR)',
      modality: 'Neuro Magnetic Resonance (MRI)',
      bodyPart: 'Cerebrum / Neurology',
      patientId: 'PT-9012-JOHN',
      finding: 'Left Periventricular Deep White Matter Hyperintensity',
      confidence: 91.8,
      acuity: 'MILD',
      dimensions: '14 mm focal hyperintensity',
      aiNotes: 'Non-specific microvascular ischemic changes or early demyelinating plaque. Recommend clinical correlation with neurological exam.'
    },
    {
      id: 'scan-3',
      name: 'Knee Radiograph (AP Bilateral)',
      modality: 'Orthopedic X-Ray',
      bodyPart: 'Musculoskeletal / Knee',
      patientId: 'PT-6309-MARIA',
      finding: 'Medial Compartment Joint Space Narrowing & Subchondral Sclerosis',
      confidence: 97.2,
      acuity: 'MODERATE',
      dimensions: '2.8 mm joint clearance',
      aiNotes: 'Grade II primary osteoarthritis (Kellgren-Lawrence scale). Marginal osteophyte formation observed along the tibial plateau.'
    }
  ];

  const [activeScan, setActiveScan] = useState<ScanPreset>(presets[0]);
  const [showAiHeatmap, setShowAiHeatmap] = useState(true);
  const [showBoundingBox, setShowBoundingBox] = useState(true);
  const [heatmapOpacity, setHeatmapOpacity] = useState(65);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isInverted, setIsInverted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [attachedSuccess, setAttachedSuccess] = useState(false);

  const handleResetControls = () => {
    AiMedicalService.playChime('click');
    setHeatmapOpacity(65);
    setBrightness(100);
    setContrast(100);
    setIsInverted(false);
    setZoomLevel(1);
  };

  const handleAttach = () => {
    AiMedicalService.playChime('success');
    setAttachedSuccess(true);
    if (onAttachToChart) {
      onAttachToChart(`[AI Radiology Report - ${activeScan.name}]: ${activeScan.finding} (${activeScan.confidence}% confidence). ${activeScan.aiNotes}`);
    }
    setTimeout(() => setAttachedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-5xl w-full my-auto shadow-2xl overflow-hidden flex flex-col max-h-[95vh] text-slate-100">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600/20 text-cyan-400 rounded-2xl border border-cyan-500/30">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white tracking-tight">{t.radiologyTitle}</h2>
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                  DICOM AI v3.4
                </span>
              </div>
              <p className="text-xs text-slate-400">{t.radiologySubtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scan Selector Tabs */}
        <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          {presets.map(scan => (
            <button
              key={scan.id}
              onClick={() => {
                AiMedicalService.playChime('click');
                setActiveScan(scan);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                activeScan.id === scan.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <span>{scan.name}</span>
              <span className="text-[10px] opacity-75 font-mono">({scan.confidence}%)</span>
            </button>
          ))}
        </div>

        {/* Main Content: Viewer Stage + Inspection Sidebar */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-y-auto">
          
          {/* LEFT 2 COLUMNS: MEDICAL SCAN DARKROOM STAGE */}
          <div className="lg:col-span-2 bg-black p-4 sm:p-6 flex flex-col items-center justify-between relative overflow-hidden select-none border-b lg:border-b-0 lg:border-r border-slate-800">
            
            {/* OSD (On-Screen Display) Medical Scan Telemetry */}
            <div className="w-full flex justify-between items-start text-[11px] font-mono text-cyan-300/80 pointer-events-none z-10 pb-2">
              <div>
                <div>PAT: {activeScan.patientId}</div>
                <div>MOD: {activeScan.modality}</div>
                <div>REG: {activeScan.bodyPart}</div>
              </div>
              <div className="text-right">
                <div>ZOOM: {zoomLevel.toFixed(1)}x</div>
                <div>BRIGHT: {brightness}% | CONT: {contrast}%</div>
                <div className="text-amber-400 font-bold">AI PATHOLOGY: DETECTED</div>
              </div>
            </div>

            {/* SCAN VISUAL CANVAS */}
            <div 
              className="relative my-auto flex items-center justify-center transition-transform duration-200"
              style={{
                transform: `scale(${zoomLevel})`,
                filter: `brightness(${brightness}%) contrast(${contrast}%) ${isInverted ? 'invert(1)' : 'invert(0)'}`
              }}
            >
              {/* Scan Presets Rendering via Vector Medical Art */}
              {activeScan.id === 'scan-1' && (
                <div className="relative w-72 h-80 sm:w-96 sm:h-96 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-black border border-slate-800 flex items-center justify-center p-4 shadow-2xl">
                  {/* Ribcage & Thoracic Cavity Silhouette */}
                  <svg viewBox="0 0 400 400" className="w-full h-full text-slate-400">
                    {/* Spine / Vertebrae */}
                    <path d="M 200 40 L 200 360" stroke="#475569" strokeWidth="12" strokeDasharray="14 4" />
                    {/* Clavicles */}
                    <path d="M 80 80 Q 200 110 320 80" stroke="#64748b" strokeWidth="8" fill="none" />
                    {/* Left & Right Ribs */}
                    {[110, 140, 170, 200, 230, 260, 290].map((y, idx) => (
                      <g key={y}>
                        {/* Right Ribs */}
                        <path d={`M 200 ${y - 10} Q ${330 - idx * 5} ${y + 10} 210 ${y + 30}`} stroke="#334155" strokeWidth="6" fill="none" />
                        {/* Left Ribs */}
                        <path d={`M 200 ${y - 10} Q ${70 + idx * 5} ${y + 10} 190 ${y + 30}`} stroke="#334155" strokeWidth="6" fill="none" />
                      </g>
                    ))}
                    {/* Diaphragmatic Domes */}
                    <path d="M 60 350 Q 140 280 200 330 Q 260 280 340 350" stroke="#64748b" strokeWidth="8" fill="#0f172a" opacity="0.8" />
                    {/* Cardiac Silhouette (Heart shadow on left side) */}
                    <ellipse cx="170" cy="260" rx="55" ry="40" transform="rotate(-20 170 260)" fill="#1e293b" stroke="#475569" strokeWidth="4" opacity="0.85" />
                  </svg>

                  {/* AI Thermal Heatmap Overlay for Right Middle Lobe Infiltrate */}
                  {showAiHeatmap && (
                    <div 
                      className="absolute top-[38%] right-[18%] w-28 h-28 rounded-full pointer-events-none transition-opacity blur-md"
                      style={{
                        opacity: heatmapOpacity / 100,
                        background: 'radial-gradient(circle, rgba(239,68,68,0.85) 0%, rgba(245,158,11,0.65) 45%, rgba(59,130,246,0.3) 75%, transparent 100%)'
                      }}
                    />
                  )}

                  {/* AI Pathology Bounding Box */}
                  {showBoundingBox && (
                    <div className="absolute top-[38%] right-[18%] w-28 h-28 border-2 border-dashed border-rose-500 rounded-xl pointer-events-none flex flex-col justify-between p-1.5 animate-pulse">
                      <span className="text-[9px] font-mono font-bold bg-rose-600 text-white px-1.5 py-0.5 rounded shadow self-start">
                        Consolidation ({activeScan.confidence}%)
                      </span>
                      <span className="text-[8px] font-mono text-rose-300 self-end bg-black/60 px-1 rounded">
                        {activeScan.dimensions}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {activeScan.id === 'scan-2' && (
                <div className="relative w-72 h-80 sm:w-96 sm:h-96 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-black border border-slate-800 flex items-center justify-center p-4 shadow-2xl">
                  {/* Brain Axial Slice Silhouette */}
                  <svg viewBox="0 0 400 400" className="w-full h-full text-slate-400">
                    {/* Cranial Skull Bone Ring */}
                    <ellipse cx="200" cy="200" rx="140" ry="165" stroke="#94a3b8" strokeWidth="12" fill="#0f172a" />
                    {/* Brain Parenchyma Sulci / Gyri contours */}
                    <ellipse cx="200" cy="200" rx="125" ry="150" stroke="#334155" strokeWidth="4" fill="#090d16" />
                    {/* Interhemispheric Fissure (Midline) */}
                    <path d="M 200 55 L 200 345" stroke="#1e293b" strokeWidth="6" strokeDasharray="6 4" />
                    {/* Lateral Ventricles (Butterfly shape) */}
                    <path d="M 175 160 Q 185 200 175 240 Q 195 210 195 190 Z" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                    <path d="M 225 160 Q 215 200 225 240 Q 205 210 205 190 Z" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                  </svg>

                  {/* AI Thermal Heatmap Overlay for Periventricular White Matter */}
                  {showAiHeatmap && (
                    <div 
                      className="absolute top-[35%] left-[28%] w-20 h-20 rounded-full pointer-events-none transition-opacity blur-md"
                      style={{
                        opacity: heatmapOpacity / 100,
                        background: 'radial-gradient(circle, rgba(239,68,68,0.9) 0%, rgba(245,158,11,0.7) 40%, rgba(168,85,247,0.4) 70%, transparent 100%)'
                      }}
                    />
                  )}

                  {/* Bounding Box */}
                  {showBoundingBox && (
                    <div className="absolute top-[35%] left-[28%] w-20 h-20 border-2 border-dashed border-amber-400 rounded-xl pointer-events-none flex flex-col justify-between p-1 animate-pulse">
                      <span className="text-[8px] font-mono font-bold bg-amber-500 text-slate-950 px-1 py-0.5 rounded shadow self-start">
                        Hyperintensity ({activeScan.confidence}%)
                      </span>
                      <span className="text-[8px] font-mono text-amber-200 self-end bg-black/60 px-1 rounded">
                        {activeScan.dimensions}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {activeScan.id === 'scan-3' && (
                <div className="relative w-72 h-80 sm:w-96 sm:h-96 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-black border border-slate-800 flex items-center justify-center p-4 shadow-2xl">
                  {/* Knee Joint Bones: Distal Femur + Proximal Tibia */}
                  <svg viewBox="0 0 400 400" className="w-full h-full text-slate-400">
                    {/* Femur Condyles */}
                    <path d="M 140 40 L 140 140 Q 130 180 160 190 Q 200 180 200 170 Q 200 180 240 190 Q 270 180 260 140 L 260 40" stroke="#64748b" strokeWidth="8" fill="#1e293b" />
                    {/* Joint Gap */}
                    <line x1="120" y1="205" x2="280" y2="205" stroke="#334155" strokeWidth="3" strokeDasharray="6 4" />
                    {/* Tibial Plateau */}
                    <path d="M 130 220 Q 200 230 270 220 L 260 360 L 140 360 Z" stroke="#64748b" strokeWidth="8" fill="#1e293b" />
                    {/* Fibula */}
                    <path d="M 110 235 L 120 360" stroke="#475569" strokeWidth="6" />
                  </svg>

                  {/* AI Thermal Heatmap for Medial Joint Space Narrowing */}
                  {showAiHeatmap && (
                    <div 
                      className="absolute top-[46%] right-[32%] w-24 h-16 rounded-full pointer-events-none transition-opacity blur-md"
                      style={{
                        opacity: heatmapOpacity / 100,
                        background: 'radial-gradient(circle, rgba(239,68,68,0.85) 0%, rgba(245,158,11,0.6) 50%, rgba(59,130,246,0.2) 80%, transparent 100%)'
                      }}
                    />
                  )}

                  {/* Bounding Box */}
                  {showBoundingBox && (
                    <div className="absolute top-[46%] right-[32%] w-24 h-16 border-2 border-dashed border-rose-500 rounded-xl pointer-events-none flex flex-col justify-between p-1 animate-pulse">
                      <span className="text-[8px] font-mono font-bold bg-rose-600 text-white px-1 py-0.5 rounded shadow self-start">
                        Joint Space {activeScan.confidence}%
                      </span>
                      <span className="text-[8px] font-mono text-rose-300 self-end bg-black/60 px-1 rounded">
                        {activeScan.dimensions}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Darkroom Floating Toolbar */}
            <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/80 z-10 text-xs">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
                className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-slate-700 mx-1"></div>
              <button
                onClick={() => setIsInverted(!isInverted)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                  isInverted ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                }`}
              >
                Invert Film
              </button>
              <button
                onClick={() => setShowAiHeatmap(!showAiHeatmap)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition flex items-center space-x-1 ${
                  showAiHeatmap ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {showAiHeatmap ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Heatmap</span>
              </button>
              <button
                onClick={() => setShowBoundingBox(!showBoundingBox)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                  showBoundingBox ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                ROI Box
              </button>
              <button
                onClick={handleResetControls}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* RIGHT 1 COLUMN: AI COMPUTER VISION PATHOLOGY REPORT & CONTROLS */}
          <div className="p-5 sm:p-6 bg-slate-900 flex flex-col justify-between space-y-6 overflow-y-auto text-xs">
            
            <div className="space-y-4">
              {/* Finding Title & Confidence Gauge */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                    Automated Pathology Detection
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeScan.acuity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    activeScan.acuity === 'MODERATE' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {activeScan.acuity} ACUITY
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-white leading-snug">{activeScan.finding}</h3>

                {/* Confidence Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">{t.radiologyConfidence}</span>
                    <span className="font-mono font-bold text-cyan-400">{activeScan.confidence}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${activeScan.confidence}%` }}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 pt-1 flex items-center space-x-1.5">
                  <span className="font-semibold text-slate-300">Dimensions:</span>
                  <span className="font-mono text-white bg-slate-800 px-1.5 py-0.5 rounded">{activeScan.dimensions}</span>
                </div>
              </div>

              {/* AI Clinical Diagnostic Impression */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-300 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI Radiologist Impression:</span>
                </span>
                <p className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-slate-300 text-xs leading-relaxed">
                  {activeScan.aiNotes}
                </p>
              </div>

              {/* Advanced Image Fine-Tuning Sliders */}
              <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-3">
                <div className="font-bold text-slate-300 flex items-center space-x-1.5 text-xs">
                  <Sliders className="w-3.5 h-3.5 text-blue-400" />
                  <span>Optical Enhancements</span>
                </div>

                {/* Heatmap Opacity Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Heatmap Opacity</span>
                    <span className="font-mono text-slate-200">{heatmapOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={heatmapOpacity}
                    onChange={e => setHeatmapOpacity(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                {/* Brightness Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Brightness</span>
                    <span className="font-mono text-slate-200">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="180"
                    value={brightness}
                    onChange={e => setBrightness(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Contrast Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Contrast</span>
                    <span className="font-mono text-slate-200">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={contrast}
                    onChange={e => setContrast(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
              </div>

              {/* Compliance & Verification Badge */}
              <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-xl flex items-center space-x-2 text-[11px] text-blue-300">
                <ShieldAlert className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Deep learning inference runs 100% on-device for HIPAA & NDHM zero-trust privacy.</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleAttach}
                disabled={attachedSuccess}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-900/40 cursor-pointer"
              >
                {attachedSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-200" />
                    <span>Findings Attached to Chart!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Attach to Prescription Chart</span>
                  </>
                )}
              </button>

              <button
                onClick={() => window.print()}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer"
                title="Print DICOM Snapshot"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};