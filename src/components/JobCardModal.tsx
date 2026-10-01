import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  Camera, 
  Plus, 
  Tag, 
  UserCheck, 
  FileText, 
  Send, 
  Layers, 
  Truck,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  Package,
  Eye,
  EyeOff,
  Globe,
  Lock
} from 'lucide-react';
import { 
  formatZAR, 
  getStageDetails, 
  STAGES_LIST, 
  calculateTotalInvestment, 
  calculateSavings 
} from '../utils/formatters';
import { ProjectStage, TechnicianLog, PhotoEvidence, RepairPart } from '../types';

export const JobCardModal: React.FC = () => {
  const { 
    isJobCardOpen, 
    setIsJobCardOpen, 
    activeProject, 
    updateProject, 
    updateStage, 
    addTechnicianLog, 
    addPhotoEvidence, 
    togglePhotoClientVisibility,
    toggleLogClientVisibility,
    publishUpdatesToClient,
    openWhatsAppModal,
    openPhotoViewer 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'logs' | 'photos' | 'parts' | 'overview'>('logs');
  const [publishedAlert, setPublishedAlert] = useState(false);

  // New Log Form State
  const [showAddLog, setShowAddLog] = useState(false);
  const [techName, setTechName] = useState('Jabu Mokoena');
  const [techRole, setTechRole] = useState<TechnicianLog['technicianRole']>('Master Panel Beater');
  const [logHours, setLogHours] = useState(3.5);
  const [logStage, setLogStage] = useState<ProjectStage>(activeProject?.stage || 'panel_beating');
  const [logSummary, setLogSummary] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [logQC, setLogQC] = useState(true);

  // New Photo Form State
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoTag, setPhotoTag] = useState<PhotoEvidence['tag']>('Panel Beating & Jig');

  // New Part Form State
  const [showAddPart, setShowAddPart] = useState(false);
  const [partName, setPartName] = useState('');
  const [partCategory, setPartCategory] = useState<RepairPart['category']>('body_panel');
  const [partCost, setPartCost] = useState(1500);

  if (!isJobCardOpen || !activeProject) return null;

  const currentStageInfo = getStageDetails(activeProject.stage);
  const totalCost = calculateTotalInvestment(activeProject.financials);
  const savings = calculateSavings(activeProject.financials);

  const handleStageSelect = (stageId: ProjectStage) => {
    updateStage(activeProject.id, stageId);
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logSummary) return;

    addTechnicianLog(activeProject.id, {
      technicianName: techName,
      technicianRole: techRole,
      stage: logStage,
      actionSummary: logSummary,
      hoursSpent: Number(logHours),
      qualityPassed: logQC,
      notes: logNotes || 'Inspected and approved according to workshop quality checklist.',
    });

    setLogSummary('');
    setLogNotes('');
    setShowAddLog(false);
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl || !photoTitle) return;

    addPhotoEvidence(activeProject.id, {
      stage: activeProject.stage,
      title: photoTitle,
      description: photoDescription || 'Photo evidence recorded during restoration process.',
      imageUrl: photoUrl,
      photographer: `${techName} (Workshop Team)`,
      tag: photoTag,
      isHighlighted: true,
    });

    setPhotoTitle('');
    setPhotoDescription('');
    setPhotoUrl('');
    setShowAddPhoto(false);
  };

  const handleSavePart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partName) return;

    const newPart: RepairPart = {
      id: `p-${Date.now()}`,
      name: partName,
      category: partCategory,
      source: 'Quality Aftermarket',
      estimatedCost: Number(partCost),
      actualCost: Number(partCost),
      status: 'ordered',
    };

    updateProject(activeProject.id, {
      parts: [...activeProject.parts, newPart],
    });

    setPartName('');
    setShowAddPart(false);
  };

  const handleTogglePartStatus = (partId: string) => {
    const updated = activeProject.parts.map((p) => {
      if (p.id !== partId) return p;
      const nextStatus: RepairPart['status'] =
        p.status === 'needed' ? 'ordered' : p.status === 'ordered' ? 'received' : p.status === 'received' ? 'fitted' : 'needed';
      return { ...p, status: nextStatus };
    });
    updateProject(activeProject.id, { parts: updated });
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-start sm:items-center justify-center p-2.5 sm:p-5 pb-20 sm:pb-5 overscroll-contain">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl w-full max-w-5xl shadow-2xl text-slate-100 flex flex-col max-h-[calc(100dvh-2.5rem)] sm:max-h-[90vh] my-auto overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {activeProject.year} {activeProject.make} {activeProject.model}
                </h2>
                <span className="text-[10px] sm:text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  {activeProject.trackingRef}
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                  {activeProject.registrationCode || 'CODE 2'}
                </span>
                <span className="hidden sm:inline-block text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                  VIN: {activeProject.vin.slice(-8)}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 flex flex-wrap items-center gap-2">
                <span>Client: <strong className="text-slate-200">{activeProject.clientName}</strong></span>
                <span>•</span>
                <span>{activeProject.auctionSource} (Lot #{activeProject.auctionLotNumber})</span>
                {activeProject.hasKeys && <span className="bg-slate-800 text-slate-300 px-1.5 rounded text-[10px]">🔑 Keys</span>}
                {activeProject.hasBattery && <span className="bg-slate-800 text-slate-300 px-1.5 rounded text-[10px]">🔋 Battery</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => {
                publishUpdatesToClient(activeProject.id);
                setPublishedAlert(true);
                setTimeout(() => setPublishedAlert(false), 2500);
              }}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs transition-all shadow-md active:scale-95"
              title="Push approved stages, photos & logs live to client's dashboard"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{publishedAlert ? 'Published!' : 'Publish to Client'}</span>
            </button>

            <button
              onClick={() =>
                openWhatsAppModal({
                  phone: activeProject.clientWhatsApp,
                  name: activeProject.clientName,
                  vehicleDesc: `${activeProject.year} ${activeProject.make} ${activeProject.model}`,
                  projectRef: activeProject.trackingRef,
                  templateType: 'stage_photo',
                })
              }
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs transition-all shadow-md active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp Alert</span>
            </button>
            <button
              onClick={() => setIsJobCardOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stage Workflow Stepper */}
        <div className="bg-slate-950 px-4 py-2.5 sm:px-6 sm:py-3 border-b border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Stage: <strong className="text-amber-400">{currentStageInfo.label}</strong>
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400">
              Step {currentStageInfo.stepNumber} of 10
            </span>
          </div>
          <div className="flex sm:grid overflow-x-auto sm:grid-cols-5 lg:grid-cols-10 gap-1.5 no-scrollbar pb-1">
            {STAGES_LIST.map((stage) => {
              const isActive = activeProject.stage === stage.id;
              const isPast = stage.stepNumber < currentStageInfo.stepNumber;
              return (
                <button
                  key={stage.id}
                  onClick={() => handleStageSelect(stage.id)}
                  title={stage.description}
                  className={`px-2 py-1.5 rounded text-[10px] font-bold text-center transition-all whitespace-nowrap sm:whitespace-normal sm:truncate border shrink-0 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-extrabold'
                      : isPast
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {stage.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 px-4 sm:px-6 bg-slate-950/40 text-xs font-semibold overflow-x-auto no-scrollbar">
          {[
            { id: 'logs', label: 'Technician Progress Logs', count: activeProject.technicianLogs.length },
            { id: 'photos', label: 'Photo Evidence Gallery', count: activeProject.photoEvidence.length },
            { id: 'parts', label: 'Replacement Parts Ledger', count: activeProject.parts.length },
            { id: 'overview', label: 'Financials & Specs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-amber-400 text-amber-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: TECHNICIAN PROGRESS LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Technician Floor Execution Logs</h3>
                  <p className="text-xs text-slate-400">
                    Workshop team labor records, structural jig checks, and quality compliance stamps.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddLog(!showAddLog)}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddLog ? 'Close Form' : 'Log Technician Action'}</span>
                </button>
              </div>

              {/* Add Log Form */}
              {showAddLog && (
                <form onSubmit={handleSaveLog} className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-3 text-xs">
                  <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                    New Workshop Work Order Log
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Technician</label>
                      <select
                        value={techName}
                        onChange={(e) => {
                          setTechName(e.target.value);
                          if (e.target.value.includes('Jabu')) setTechRole('Master Panel Beater');
                          if (e.target.value.includes('Johan')) setTechRole('Spray Painter');
                          if (e.target.value.includes('Thabo')) setTechRole('Auto Electrician');
                          if (e.target.value.includes('Clinton')) setTechRole('Workshop Foreman');
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      >
                        <option value="Jabu Mokoena">Jabu Mokoena (Panel Beater)</option>
                        <option value="Johan Van Zyl">Johan Van Zyl (Spray Painter)</option>
                        <option value="Thabo Cele">Thabo Cele (Auto Electrician)</option>
                        <option value="Clinton Adams">Clinton Adams (Foreman & QC)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Hours Spent</label>
                      <input
                        type="number"
                        step="0.5"
                        value={logHours}
                        onChange={(e) => setLogHours(parseFloat(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Target Stage</label>
                      <select
                        value={logStage}
                        onChange={(e) => setLogStage(e.target.value as ProjectStage)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      >
                        {STAGES_LIST.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Action Summary (Headline) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pulled right radiator support on jig; pre-aligned replacement bonnet"
                      value={logSummary}
                      onChange={(e) => setLogSummary(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Detailed Technical Notes & Observations</label>
                    <textarea
                      rows={2}
                      placeholder="Measurements, torque specs, or primer coating details..."
                      value={logNotes}
                      onChange={(e) => setLogNotes(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={logQC}
                        onChange={(e) => setLogQC(e.target.checked)}
                        className="accent-emerald-500 rounded"
                      />
                      <span className="text-slate-300 font-medium">Passed Quality Control & Tolerances Check</span>
                    </label>

                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg"
                    >
                      Save Work Log
                    </button>
                  </div>
                </form>
              )}

              {/* Logs Timeline List */}
              <div className="space-y-3">
                {activeProject.technicianLogs.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800">
                    No technician logs recorded yet. Click &quot;Log Technician Action&quot; to begin.
                  </div>
                ) : (
                  activeProject.technicianLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start justify-between gap-3"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-white text-xs">{log.actionSummary}</span>
                          <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                            {log.stage.replace(/_/g, ' ')}
                          </span>
                          {log.qualityPassed && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> QC Passed
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleLogClientVisibility(activeProject.id, log.id)}
                            className={`text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1 transition-all ${
                              log.isClientVisible !== false
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-300'
                            }`}
                            title="Click to toggle whether client can see this log"
                          >
                            {log.isClientVisible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            <span>{log.isClientVisible !== false ? 'Client Visible' : 'Internal Note'}</span>
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{log.notes}</p>
                        <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                          <span>
                            Tech: <strong className="text-slate-200">{log.technicianName}</strong> ({log.technicianRole})
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3 text-amber-400" /> {log.hoursSpent} hrs logged
                          </span>
                          <span>•</span>
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PHOTO EVIDENCE GALLERY */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Visual Repair Progress & Evidence</h3>
                  <p className="text-xs text-slate-400">
                    Transparent before, during, and after photos shared with the client to prove workmanship quality.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddPhoto(!showAddPhoto)}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-all active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{showAddPhoto ? 'Close Form' : 'Add Photo Evidence'}</span>
                </button>
              </div>

              {/* Add Photo Form */}
              {showAddPhoto && (
                <form onSubmit={handleSavePhoto} className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-3 text-xs">
                  <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                    Record Fresh Photo Evidence
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Image URL *</label>
                      <input
                        type="url"
                        required
                        placeholder="https://images.unsplash.com/..."
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Evidence Stage Tag</label>
                      <select
                        value={photoTag}
                        onChange={(e) => setPhotoTag(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      >
                        <option value="Auction Yard Initial">Auction Yard Initial (Before)</option>
                        <option value="Stripped / Chassis Check">Stripped / Chassis Check</option>
                        <option value="Panel Beating & Jig">Panel Beating & Jig Alignment</option>
                        <option value="Primer & Oven Paint">Primer & Spray Booth Bake</option>
                        <option value="Assembly & Polish">Assembly & Polish</option>
                        <option value="Final Showroom">Final Showroom (After)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Photo Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Oven Clearcoat Bake at 65°C"
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Description / Notes for Client</label>
                    <input
                      type="text"
                      placeholder="e.g. Paint blend seamless along door line with high gloss clear."
                      value={photoDescription}
                      onChange={(e) => setPhotoDescription(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg"
                    >
                      Save Photo Evidence
                    </button>
                  </div>
                </form>
              )}

              {/* Photo Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeProject.photoEvidence.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => openPhotoViewer(photo)}
                    className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden cursor-pointer group hover:border-amber-400 transition-all shadow-md"
                  >
                    <div className="relative aspect-video overflow-hidden bg-slate-900">
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 text-[10px] font-bold bg-slate-950/80 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded backdrop-blur-sm">
                        {photo.tag}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePhotoClientVisibility(activeProject.id, photo.id);
                        }}
                        className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm border flex items-center gap-1 transition-all ${
                          photo.isClientVisible !== false
                            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                            : 'bg-slate-950/90 text-slate-400 border-slate-700'
                        }`}
                        title="Toggle client visibility"
                      >
                        {photo.isClientVisible !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{photo.isClientVisible !== false ? 'Client Visible' : 'Internal Only'}</span>
                      </button>
                    </div>
                    <div className="p-3 space-y-1">
                      <h4 className="font-bold text-white text-xs truncate group-hover:text-amber-400">
                        {photo.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{photo.description}</p>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                        <span>{photo.timestamp}</span>
                        <span className="text-amber-400/80">Click to expand</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PARTS LEDGER */}
          {activeTab === 'parts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Replacement Parts Ledger</h3>
                  <p className="text-xs text-slate-400">
                    Track sourcing of panels, lighting, suspension components, and paint consumables.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddPart(!showAddPart)}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddPart ? 'Close Form' : 'Add Required Part'}</span>
                </button>
              </div>

              {/* Add Part Form */}
              {showAddPart && (
                <form onSubmit={handleSavePart} className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Part Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Front Right Headlight"
                      value={partName}
                      onChange={(e) => setPartName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Category</label>
                    <select
                      value={partCategory}
                      onChange={(e) => setPartCategory(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                    >
                      <option value="body_panel">Body Panel</option>
                      <option value="lighting">Lighting Unit</option>
                      <option value="mechanical">Mechanical & Suspension</option>
                      <option value="airbag_interior">Airbag / Interior</option>
                      <option value="paint_consumables">Paint & Clearcoat</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Estimated Cost (ZAR)</label>
                    <input
                      type="number"
                      value={partCost}
                      onChange={(e) => setPartCost(parseFloat(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-1.5 rounded-lg"
                    >
                      Add to Job Card
                    </button>
                  </div>
                </form>
              )}

              {/* Parts Table */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4">Part Description</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Source</th>
                      <th className="py-2.5 px-3">Est. Cost</th>
                      <th className="py-2.5 px-4">Status (Click to Advance)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {activeProject.parts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-500">
                          No parts recorded on this job card yet.
                        </td>
                      </tr>
                    ) : (
                      activeProject.parts.map((part) => (
                        <tr key={part.id} className="hover:bg-slate-900/50">
                          <td className="py-2.5 px-4 font-semibold text-white">{part.name}</td>
                          <td className="py-2.5 px-3 text-slate-400 capitalize">{part.category.replace(/_/g, ' ')}</td>
                          <td className="py-2.5 px-3 text-slate-400">{part.source}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{formatZAR(part.estimatedCost)}</td>
                          <td className="py-2.5 px-4">
                            <button
                              onClick={() => handleTogglePartStatus(part.id)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide transition-all ${
                                part.status === 'fitted'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : part.status === 'received'
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                  : part.status === 'ordered'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {part.status}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: FINANCIALS & SPECS */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                  Vehicle Information & Auction Log
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">VIN Number</span>
                    <span className="font-mono text-white">{activeProject.vin}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Mileage</span>
                    <span className="font-mono text-white">{activeProject.mileage.toLocaleString()} km</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Engine & Gearbox</span>
                    <span className="text-white">{activeProject.engine} • {activeProject.transmission}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Colour</span>
                    <span className="text-white">{activeProject.colour}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Auction Nation Yard</span>
                    <span className="text-white">{activeProject.auctionSource}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Run & Drive</span>
                    <span className="text-amber-400 font-bold">{activeProject.runAndDriveStatus}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Damage Assessment:</span>
                  <p className="text-slate-300 mt-0.5">{activeProject.damageDescription}</p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                  Profit & Savings Ledger
                </h4>
                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Auction Nation Bid:</span>
                    <span className="font-mono text-white">{formatZAR(activeProject.financials.auctionEstimatedBid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Workshop Restoration:</span>
                    <span className="font-mono text-white">
                      {formatZAR(
                        activeProject.financials.panelBeatingLaborHours * activeProject.financials.panelBeatingHourlyRate +
                        activeProject.financials.sprayPaintPanelsCount * activeProject.financials.sprayPaintCostPerPanel +
                        activeProject.financials.partsTotalEstimate
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1 font-bold text-white">
                    <span>Total Client Investment:</span>
                    <span className="font-mono text-amber-400">{formatZAR(totalCost)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Dealership Retail Value:</span>
                    <span className="font-mono">{formatZAR(activeProject.financials.estimatedMarketRetailValue)}</span>
                  </div>
                  <div className="flex justify-between bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30 text-emerald-300 font-bold">
                    <span>Customer Net Savings:</span>
                    <span className="font-mono text-sm">{formatZAR(savings.amount)} ({savings.percentage}%)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
