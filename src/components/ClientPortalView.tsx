import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Car, 
  Clock, 
  CheckCircle2, 
  Camera, 
  MessageSquare, 
  Truck, 
  TrendingDown, 
  Wrench, 
  MapPin, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Calendar,
  Sparkles,
  Lock,
  LogOut,
  Eye,
  AlertCircle
} from 'lucide-react';
import { 
  formatZAR, 
  STAGES_LIST, 
  getStageIndex, 
  calculateTotalInvestment, 
  calculateSavings, 
  generateWhatsAppLink 
} from '../utils/formatters';

export const ClientPortalView: React.FC = () => {
  const { 
    projects, 
    clientVerifiedPin, 
    verifyClientPin, 
    logoutClient,
    openPhotoViewer,
    openWhatsAppModal 
  } = useApp();

  const [inputPin, setInputPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Find strictly the verified vehicle project
  const verifiedProject = projects.find(
    (p) => p.trackingRef.toUpperCase() === (clientVerifiedPin || '').toUpperCase()
  );

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPin.trim()) return;
    const success = verifyClientPin(inputPin);
    if (!success) {
      setErrorMsg('Invalid tracking PIN or reference code. Please check your Auction Nation / AutoRevive quote.');
    } else {
      setErrorMsg('');
    }
  };

  // If client is not yet verified or logged in, show secure single-vehicle login screen
  if (!verifiedProject || !clientVerifiedPin) {
    return (
      <div className="max-w-xl w-full mx-auto py-8 sm:py-12 px-3 sm:px-4 space-y-6 overflow-x-hidden">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mx-auto flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20">
            <Lock className="w-8 h-8 text-slate-950" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400">
              AutoRevive Client Protection
            </span>
            <h1 className="text-2xl font-black text-white">
              Access Your Vehicle Restoration
            </h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              For your privacy and security, each customer can only view their own vehicle&apos;s restoration journey, transit milestones, and photo evidence.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Enter Tracking PIN (e.g. AR-PE07)"
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-center text-lg font-mono font-bold text-amber-300 placeholder-slate-600 focus:border-amber-400 focus:outline-none uppercase tracking-widest"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/30 flex items-center justify-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black py-3.5 rounded-xl text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              Verify PIN & Open My Dashboard
            </button>
          </form>

          {/* Quick Demo Logins for user verification */}
          <div className="border-t border-slate-800/80 pt-5 space-y-2">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">
              Quick Test As Client:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    verifyClientPin(p.trackingRef);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] font-mono font-bold transition-all hover:border-amber-400"
                >
                  {p.clientName.split(' ')[0]}: {p.trackingRef} ({p.model.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const project = verifiedProject;
  const currentStageIndex = getStageIndex(project.stage);
  const fin = project.financials;
  const totalCost = calculateTotalInvestment(fin);
  const savings = calculateSavings(fin);

  // Strictly filter items: Only show items approved by management for client visibility!
  const clientVisiblePhotos = project.photoEvidence.filter((p) => p.isClientVisible !== false);
  const clientVisibleLogs = project.technicianLogs.filter((l) => l.isClientVisible !== false);

  const handleWhatsAppManager = () => {
    openWhatsAppModal({
      phone: project.clientWhatsApp,
      name: project.clientName,
      vehicleDesc: `${project.year} ${project.make} ${project.model}`,
      projectRef: project.trackingRef,
      templateType: 'stage_photo',
      customMessage: `Hi AutoRevive Workshop Team, I am viewing my private dashboard for ${project.year} ${project.make} ${project.model} (${project.trackingRef}).`,
    });
  };

  return (
    <div className="space-y-6 pb-12 w-full max-w-full overflow-x-hidden">
      {/* Top Client Portal Bar - Fully Isolated for this Client */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-amber-400">
                Secure Client Portal
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                Private Session Verified
              </span>
              {project.registrationCode && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                  {project.registrationCode}
                </span>
              )}
            </div>
            <h1 className="text-xl font-black text-white">
              Restoration Journey: {project.year} {project.make} {project.model}
            </h1>
            <p className="text-xs text-slate-400">
              Owner: <strong className="text-white">{project.clientName}</strong> • Private PIN: <strong className="text-amber-400 font-mono">{project.trackingRef}</strong>
            </p>
          </div>
        </div>

        {/* Security Badge & Sign Out Button */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right text-[11px] text-slate-400 hidden sm:block">
            <span>Published by Workshop:</span>
            <div className="font-mono text-emerald-400 font-bold">
              {project.lastPublishedToClientAt || 'Verified Live'}
            </div>
          </div>

          <button
            onClick={handleWhatsAppManager}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-all shadow-md active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat With Manager</span>
          </button>

          <button
            onClick={logoutClient}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors"
            title="Exit private tracking session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit Session</span>
          </button>
        </div>
      </div>

      {/* CORE VALUE BANNER: Transparent Savings & Fraction of Dealer Price */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-amber-950/40 border border-emerald-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Your AutoRevive Value Guarantee
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              You Saved <span className="text-emerald-400">{formatZAR(savings.amount)}</span> ({savings.percentage}% Below Dealer Retail!)
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              By acquiring this salvage vehicle directly on <strong>Auction Nation</strong> (paid directly by you) and having our certified panel beaters restore it to OEM standards, you secured a vehicle worth <strong>{formatZAR(fin.estimatedMarketRetailValue)}</strong> for an all-in cost of just <strong>{formatZAR(totalCost)}</strong>.
            </p>
          </div>

          {/* Client Transparent Ledger (No internal trade margins shown) */}
          <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs shrink-0">
            <div className="flex justify-between items-center text-slate-400">
              <span>Auction Nation Winning Bid:</span>
              <span className="font-mono text-white font-bold">{formatZAR(fin.auctionEstimatedBid)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Panel Beating, Parts & Towing:</span>
              <span className="font-mono text-white font-bold">
                {formatZAR(
                  fin.panelBeatingLaborHours * fin.panelBeatingHourlyRate +
                  fin.sprayPaintPanelsCount * fin.sprayPaintCostPerPanel +
                  fin.partsTotalEstimate +
                  fin.towingTransitCost
                )}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-800 pt-2 text-white font-extrabold">
              <span>Your Verified Total:</span>
              <span className="font-mono text-amber-400">{formatZAR(totalCost)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Transit & Flatbed Towing Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Post-Auction Flatbed Delivery Status</h3>
              <p className="text-xs text-slate-400">
                Direct yard recovery handled exclusively by AutoRevive transport crew.
              </p>
            </div>
          </div>
          <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-bold uppercase font-mono">
            {project.transitStatus.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Auction Source Yard</span>
            <span className="font-bold text-white block mt-0.5">{project.auctionSource}</span>
            <span className="text-[10px] text-amber-400 font-mono">Lot #{project.auctionLotNumber}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Flatbed Driver</span>
            <span className="font-bold text-white block mt-0.5">{project.transitDriverName || 'Piet Mthembu'}</span>
            <span className="text-[10px] text-slate-400 font-mono">{project.transitFlatbedReg || 'ND 784-902'}</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Logistics Status</span>
            <span className="font-bold text-emerald-400 block mt-0.5">{project.estimatedTransitArrival || 'At Workshop Bay'}</span>
            <span className="text-[10px] text-slate-400 truncate block">{project.transitNotes || 'Checked in with workshop supervisor'}</span>
          </div>
        </div>
      </div>

      {/* Restoration Milestone Progress Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              Live Restoration Milestones
            </h3>
            <p className="text-xs text-slate-400">
              Updated by workshop management upon inspection approval.
            </p>
          </div>
          <div className="text-xs text-slate-400">
            Est. Handover: <strong className="text-white font-mono">{project.estimatedCompletionDate}</strong>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {STAGES_LIST.map((stage, idx) => {
            const isPast = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            return (
              <div
                key={stage.id}
                className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg ring-1 ring-amber-400/50'
                    : isPast
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold">0{idx + 1}</span>
                  {isPast ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isCurrent ? (
                    <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                  )}
                </div>
                <span className="text-[11px] font-bold leading-tight line-clamp-2">
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Photo Evidence Gallery - Only Client-Approved Photos */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Client Photo Evidence Feed</h3>
              <span className="text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                {clientVisiblePhotos.length} Verified Photos
              </span>
            </div>
            <p className="text-xs text-slate-400">
              High resolution photo evidence published by your panel beating team.
            </p>
          </div>
        </div>

        {clientVisiblePhotos.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-slate-950 rounded-xl">
            Initial check-in photos are being curated by our workshop foreman.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {clientVisiblePhotos.map((photo) => (
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
                </div>
                <div className="p-3 space-y-1">
                  <h4 className="font-bold text-white text-xs truncate group-hover:text-amber-400">
                    {photo.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{photo.description}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                    <span>{photo.timestamp}</span>
                    <span className="text-amber-400/80 font-medium">Inspect →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Technician Activity Records - Filtered for Client Transparency */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Verified Technician Checkpoints</h3>
          </div>
          <span className="text-xs text-slate-400">
            {clientVisibleLogs.length} Quality Milestones
          </span>
        </div>

        <div className="space-y-3">
          {clientVisibleLogs.map((log) => (
            <div
              key={log.id}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{log.actionSummary}</span>
                  {log.qualityPassed && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" /> OEM Quality Approved
                    </span>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed">{log.notes}</p>
                <div className="text-[11px] text-slate-400 pt-1">
                  Lead Technician: <strong className="text-slate-200">{log.technicianName}</strong> ({log.technicianRole}) • {log.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
