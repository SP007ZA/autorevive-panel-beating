import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Truck, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Phone, 
  Send, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { TRANSIT_STEPS, getTransitStatusTitle, formatZAR } from '../utils/formatters';
import { TransitStatus, VehicleProject } from '../types';

export const TransitTrackerModal: React.FC = () => {
  const { 
    isTransitModalOpen, 
    setIsTransitModalOpen, 
    activeProject, 
    updateProject, 
    updateTransitStatus,
    openWhatsAppModal 
  } = useApp();

  const [currentStatus, setCurrentStatus] = useState<TransitStatus>('flatbed_dispatched');
  const [driverName, setDriverName] = useState('Piet Mthembu');
  const [driverPhone, setDriverPhone] = useState('073 221 8490');
  const [flatbedReg, setFlatbedReg] = useState('ND 784-902');
  const [eta, setEta] = useState('Today, 15:45');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (activeProject) {
      setCurrentStatus(activeProject.transitStatus);
      setDriverName(activeProject.transitDriverName || 'Piet Mthembu');
      setDriverPhone(activeProject.transitDriverPhone || '073 221 8490');
      setFlatbedReg(activeProject.transitFlatbedReg || 'ND 784-902');
      setEta(activeProject.estimatedTransitArrival || 'In 2 hours');
      setNotes(activeProject.transitNotes || '');
    }
  }, [activeProject]);

  if (!isTransitModalOpen || !activeProject) return null;

  const handleSave = () => {
    updateProject(activeProject.id, {
      transitStatus: currentStatus,
      transitDriverName: driverName,
      transitDriverPhone: driverPhone,
      transitFlatbedReg: flatbedReg,
      estimatedTransitArrival: eta,
      transitNotes: notes,
    });
    setIsTransitModalOpen(false);
  };

  const handleNotifyClient = () => {
    openWhatsAppModal({
      phone: activeProject.clientWhatsApp,
      name: activeProject.clientName,
      vehicleDesc: `${activeProject.year} ${activeProject.make} ${activeProject.model}`,
      projectRef: activeProject.trackingRef,
      templateType: 'transit',
    });
  };

  const currentStepIndex = TRANSIT_STEPS.findIndex((s) => s.id === currentStatus);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl text-slate-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Post-Auction Transit & Flatbed Dispatch
                <span className="text-xs bg-slate-800 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30">
                  {activeProject.trackingRef}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {activeProject.year} {activeProject.make} {activeProject.model} • Lot #{activeProject.auctionLotNumber}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTransitModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs overflow-y-auto max-h-[75vh]">
          {/* Auction Source & Delivery Destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 text-[11px] block font-medium">Collection Yard (Auction Nation)</span>
                <span className="font-bold text-white text-xs">{activeProject.auctionSource}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Lot: <strong className="text-amber-300">{activeProject.auctionLotNumber}</strong> • Condition: {activeProject.runAndDriveStatus}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Navigation className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 text-[11px] block font-medium">Workshop Destination</span>
                <span className="font-bold text-white text-xs">AutoRevive Main Panel & Paint Center</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Bay 3 • Receiving Lead: Clinton Adams (Foreman)
                </span>
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div>
            <label className="text-slate-300 font-bold block mb-3 uppercase tracking-wider text-[11px]">
              Live Transit Milestone Progression
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {TRANSIT_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = step.id === currentStatus;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStatus(step.id)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isCurrent
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-md ring-1 ring-amber-400/50'
                        : isPassed
                        ? 'bg-slate-950/80 border-emerald-500/40 text-slate-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        0{idx + 1}
                      </span>
                      {isCurrent ? (
                        <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      ) : isPassed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-700" />
                      )}
                    </div>
                    <span className="font-bold text-[11px] leading-snug">
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Driver & Flatbed Assignment */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-200 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              Flatbed Towing Crew Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Driver Name</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Driver Contact</label>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Flatbed Truck Reg #</label>
                <input
                  type="text"
                  value={flatbedReg}
                  onChange={(e) => setFlatbedReg(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white uppercase font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-slate-400 block mb-1">Estimated Arrival at Workshop</label>
                <input
                  type="text"
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  placeholder="e.g. In 45 mins / Delivered"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Transit Dispatch Log Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Cleared Auction Gate #2 with release invoice"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={handleNotifyClient}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-lg text-xs shadow-md transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Transit Update to Client on WhatsApp</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTransitModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-all active:scale-95"
            >
              Update Transit Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
