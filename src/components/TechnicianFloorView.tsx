import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CarFront, 
  Wrench, 
  Clock, 
  Camera, 
  CheckCircle2, 
  Plus, 
  AlertTriangle, 
  Check, 
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { STAGES_LIST, getStageDetails, formatZAR } from '../utils/formatters';
import { ProjectStage, TechnicianLog, PhotoEvidence } from '../types';

export const TechnicianFloorView: React.FC = () => {
  const { 
    projects, 
    activeProjectId, 
    setActiveProjectId, 
    activeProject, 
    updateStage, 
    addTechnicianLog, 
    addPhotoEvidence,
    openPhotoViewer,
    openWhatsAppModal 
  } = useApp();

  const selectedProj = activeProject || projects[0];

  // Quick form states
  const [techName, setTechName] = useState('Jabu Mokoena');
  const [hours, setHours] = useState(2.5);
  const [actionSummary, setActionSummary] = useState('');
  const [techNotes, setTechNotes] = useState('');
  const [qcChecked, setQcChecked] = useState(true);
  const [submittedMsg, setSubmittedMsg] = useState(false);

  // Quick photo state
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoTag, setPhotoTag] = useState<PhotoEvidence['tag']>('Panel Beating & Jig');

  if (!selectedProj) {
    return <div className="p-8 text-center text-slate-400">No active workshop jobs.</div>;
  }

  const stageInfo = getStageDetails(selectedProj.stage);

  const handleQuickLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionSummary) return;

    addTechnicianLog(selectedProj.id, {
      technicianName: techName,
      technicianRole: techName.includes('Jabu')
        ? 'Master Panel Beater'
        : techName.includes('Johan')
        ? 'Spray Painter'
        : 'Auto Electrician',
      stage: selectedProj.stage,
      actionSummary,
      hoursSpent: Number(hours),
      qualityPassed: qcChecked,
      notes: techNotes || 'Task completed to manufacturer tolerance standards.',
    });

    setActionSummary('');
    setTechNotes('');
    setSubmittedMsg(true);
    setTimeout(() => setSubmittedMsg(false), 2500);
  };

  const handleQuickPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl || !photoTitle) return;

    addPhotoEvidence(selectedProj.id, {
      stage: selectedProj.stage,
      title: photoTitle,
      description: `Technician floor photo capture during ${stageInfo.label} stage.`,
      imageUrl: photoUrl,
      photographer: `${techName} (Floor Tech)`,
      tag: photoTag,
      isHighlighted: true,
    });

    setPhotoUrl('');
    setPhotoTitle('');
    setShowPhotoForm(false);
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-x-hidden">
      {/* Floor Header & Bay Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-black">
            <CarFront className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400">
                Workshop Bay Console
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                Floor Mode
              </span>
            </div>
            <h1 className="text-lg font-black text-white">
              Technician Job Execution & Evidence Capture
            </h1>
            <p className="text-xs text-slate-400">
              Select workshop vehicle to update stages, log labor hours, and upload repair photos.
            </p>
          </div>
        </div>

        {/* Project Selector Pills */}
        <div className="flex overflow-x-auto pb-1 gap-2 no-scrollbar w-full md:w-auto">
          {projects.map((p, idx) => {
            const isSelected = p.id === selectedProj.id;
            return (
              <button
                key={p.id}
                onClick={() => setActiveProjectId(p.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>Bay {idx + 1}:</span>
                <span className="truncate max-w-[120px] sm:max-w-[140px]">{p.make} {p.model}</span>
                <span className="text-[10px] opacity-80 font-mono">({p.trackingRef})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Vehicle Status Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                {selectedProj.year} {selectedProj.make} {selectedProj.model}
              </h2>
              <span className="text-xs bg-slate-800 text-amber-400 font-mono px-2 py-0.5 rounded font-bold">
                {selectedProj.trackingRef}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Lot #{selectedProj.auctionLotNumber}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Damage Area: <strong className="text-amber-300">{selectedProj.damageDescription}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPhotoForm(!showPhotoForm)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold px-3 py-1.5 rounded-lg text-xs"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Capture Photo Evidence</span>
            </button>

            <button
              onClick={() =>
                openWhatsAppModal({
                  phone: selectedProj.clientWhatsApp,
                  name: selectedProj.clientName,
                  vehicleDesc: `${selectedProj.year} ${selectedProj.make} ${selectedProj.model}`,
                  projectRef: selectedProj.trackingRef,
                  templateType: 'stage_photo',
                })
              }
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Notify Client</span>
            </button>
          </div>
        </div>

        {/* Rapid Stage Advancer */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Advance Workshop Bay Stage (Click to update):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5 text-xs">
            {STAGES_LIST.map((stage) => {
              const isCurrent = selectedProj.stage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => updateStage(selectedProj.id, stage.id)}
                  className={`p-2 rounded-lg border text-center transition-all text-[11px] font-bold ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {stage.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Photo Form Drawer */}
      {showPhotoForm && (
        <form
          onSubmit={handleQuickPhotoSubmit}
          className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 shadow-xl space-y-3 text-xs animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-amber-400 text-sm flex items-center gap-2">
              <Camera className="w-4 h-4" /> Snap / Upload Workshop Evidence Photo
            </h3>
            <button
              type="button"
              onClick={() => setShowPhotoForm(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Image URL *</label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Photo Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Chassis Jig Straightening Complete"
                value={photoTitle}
                onChange={(e) => setPhotoTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Stage Tag</label>
              <select
                value={photoTag}
                onChange={(e) => setPhotoTag(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              >
                <option value="Stripped / Chassis Check">Stripped / Chassis Check</option>
                <option value="Panel Beating & Jig">Panel Beating & Jig</option>
                <option value="Primer & Oven Paint">Primer & Oven Paint</option>
                <option value="Assembly & Polish">Assembly & Polish</option>
                <option value="Final Showroom">Final Showroom</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowPhotoForm(false)}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg"
            >
              Attach Photo
            </button>
          </div>
        </form>
      )}

      {/* Main Floor Grid: Fast Work Logger + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fast Technician Log Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Log Work & Labor Hours</h3>
            </div>
            {submittedMsg && (
              <span className="text-emerald-400 flex items-center gap-1 font-bold animate-pulse">
                <Check className="w-3.5 h-3.5" /> Log Saved!
              </span>
            )}
          </div>

          <form onSubmit={handleQuickLogSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Technician Floor Lead</label>
                <select
                  value={techName}
                  onChange={(e) => setTechName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Jabu Mokoena">Jabu Mokoena (Master Panel Beater)</option>
                  <option value="Johan Van Zyl">Johan Van Zyl (Spray Painter)</option>
                  <option value="Thabo Cele">Thabo Cele (Auto Electrician)</option>
                  <option value="Clinton Adams">Clinton Adams (Workshop Foreman)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Hours Logged</label>
                <input
                  type="number"
                  step="0.5"
                  value={hours}
                  onChange={(e) => setHours(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Action Summary (e.g. Fitted panel, pulled chassis) *</label>
              <input
                type="text"
                required
                placeholder="e.g. Aligned front wing and bumper clips, checked radiator clearance"
                value={actionSummary}
                onChange={(e) => setActionSummary(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Floor Notes & Measurements</label>
              <textarea
                rows={3}
                placeholder="Detail any part clearances or paint mix codes..."
                value={techNotes}
                onChange={(e) => setTechNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={qcChecked}
                  onChange={(e) => setQcChecked(e.target.checked)}
                  className="accent-emerald-500 rounded"
                />
                <span className="text-slate-300 font-medium">OEM Quality Standard Passed</span>
              </label>

              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg shadow-md active:scale-95 transition-all"
              >
                Save Work Record
              </button>
            </div>
          </form>
        </div>

        {/* Existing Logs & Photo Stream */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Bay Activity History ({selectedProj.trackingRef})
              </h3>
              <span className="text-[11px] text-slate-400">
                {selectedProj.technicianLogs.length} Records
              </span>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {selectedProj.technicianLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-white text-xs">{log.actionSummary}</span>
                    <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">
                      {log.hoursSpent}h
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{log.notes}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                    <span>{log.technicianName} ({log.technicianRole})</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Photo Strip */}
          <div className="border-t border-slate-800 pt-3">
            <span className="text-slate-400 block text-[10px] uppercase font-bold mb-2">
              Attached Photo Evidence:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {selectedProj.photoEvidence.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => openPhotoViewer(photo)}
                  className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-700 cursor-pointer hover:border-amber-400 transition-colors"
                >
                  <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] text-amber-300 text-center truncate px-1">
                    {photo.tag.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
