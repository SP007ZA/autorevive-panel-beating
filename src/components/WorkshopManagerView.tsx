import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wrench, 
  TrendingUp, 
  PiggyBank, 
  Truck, 
  ClipboardList, 
  Plus, 
  Calculator, 
  ExternalLink, 
  MessageSquare, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Search, 
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Filter,
  DollarSign
} from 'lucide-react';
import { 
  formatZAR, 
  calculateTotalInvestment, 
  calculateSavings, 
  calculateWeBuyCarsProfit, 
  getStageDetails,
  TRANSIT_STEPS 
} from '../utils/formatters';
import { VehicleProject, ProjectStage } from '../types';

export const WorkshopManagerView: React.FC = () => {
  const { 
    projects, 
    clientRequests, 
    setActiveProjectId, 
    setIsJobCardOpen, 
    setIsTransitModalOpen, 
    setIsCalculatorOpen, 
    setCalculatorPreloadProject,
    setIsRequestModalOpen,
    openWhatsAppModal,
    convertRequestToProject,
    setCurrentView,
    setClientTrackingCode,
    verifyClientPin
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'requests' | 'transit' | 'webuycars'>('pipeline');
  const [filterStage, setFilterStage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Overall Business Metrics
  const totalSavingsDelivered = projects.reduce((acc, p) => acc + calculateSavings(p.financials).amount, 0);
  const totalWBCFlipPotential = projects.reduce((acc, p) => acc + calculateWeBuyCarsProfit(p.financials).profit, 0);
  const inTransitCount = projects.filter((p) => p.transitStatus === 'in_transit' || p.transitStatus === 'flatbed_dispatched').length;

  const filteredProjects = projects.filter((p) => {
    const matchesStage = filterStage === 'all' || p.stage === filterStage;
    const matchesSearch = 
      p.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.trackingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.auctionLotNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const handleOpenJobCard = (project: VehicleProject) => {
    setActiveProjectId(project.id);
    setIsJobCardOpen(true);
  };

  const handleOpenTransit = (project: VehicleProject) => {
    setActiveProjectId(project.id);
    setIsTransitModalOpen(true);
  };

  const handleOpenCalculator = (project: VehicleProject) => {
    setActiveProjectId(project.id);
    setCalculatorPreloadProject(project);
    setIsCalculatorOpen(true);
  };

  const handleViewAsClient = (project: VehicleProject) => {
    verifyClientPin(project.trackingRef);
    setCurrentView('client_portal');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Customer Savings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              Customer Savings Generated
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400">
            {formatZAR(totalSavingsDelivered)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">Fraction of dealer price</span> vs AutoTrader retail
          </p>
        </div>

        {/* Metric 2: Active Salvage Restorations */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              Active Workshop Jobs
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-white">
            {projects.length} Vehicles
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Auction Nation lots undergoing panel beating
          </p>
        </div>

        {/* Metric 3: WeBuyCars Resale Value */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              WeBuyCars Flip Margin
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-cyan-400">
            +{formatZAR(totalWBCFlipPotential)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Instant buyout profit margin across fleet
          </p>
        </div>

        {/* Metric 4: Sourcing Requests & Fleet Transit */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              Sourcing & Fleet Transit
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-purple-300">
            {clientRequests.length} Wishlists • {inTransitCount} In Transit
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Flatbed towing dispatched from auction yards
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Navigation Tabs & Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-950/40">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'pipeline', label: 'Restoration Pipeline', count: projects.length },
              { id: 'requests', label: 'Client Sourcing Wishlists', count: clientRequests.length },
              { id: 'transit', label: 'Auction Nation Transit', count: inTransitCount },
              { id: 'webuycars', label: 'WeBuyCars Resale Margins' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      activeTab === tab.id ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search car, client, lot #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={() => {
                setCalculatorPreloadProject(null);
                setIsCalculatorOpen(true);
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md transition-all active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Quote</span>
            </button>
          </div>
        </div>

        {/* TAB 1: RESTORATION PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="p-4 sm:p-6 space-y-4">
            {/* Filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-500 text-[11px] font-bold uppercase shrink-0">Stage Filter:</span>
              <button
                onClick={() => setFilterStage('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  filterStage === 'all' ? 'bg-slate-800 text-white border border-slate-600' : 'text-slate-400'
                }`}
              >
                All Stages ({projects.length})
              </button>
              {['quoted', 'in_transit', 'stripping', 'panel_beating', 'spray_booth', 'roadworthy_detailing'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStage(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap ${
                    filterStage === s ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400'
                  }`}
                >
                  {s.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            {/* Vehicle Project Cards */}
            <div className="space-y-4">
              {filteredProjects.map((project) => {
                const total = calculateTotalInvestment(project.financials);
                const savings = calculateSavings(project.financials);
                const wbc = calculateWeBuyCarsProfit(project.financials);
                const stageInfo = getStageDetails(project.stage);

                return (
                  <div
                    key={project.id}
                    className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition-all shadow-md space-y-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Vehicle & Client Info */}
                      <div className="flex items-start gap-3.5">
                        <img
                          src={project.primaryPhoto}
                          alt={project.model}
                          className="w-20 h-20 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-white">
                              {project.year} {project.make} {project.model}
                            </h3>
                            <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">
                              {project.trackingRef}
                            </span>
                            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold uppercase">
                              {stageInfo.label}
                            </span>
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                              {project.registrationCode || 'CODE 2'}
                            </span>
                            <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-bold uppercase">
                              Transit: {project.transitStatus.replace(/_/g, ' ')}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                            <span>Client: <strong className="text-white">{project.clientName}</strong></span>
                            <span>•</span>
                            <span>Yard: <strong className="text-amber-300">{project.auctionSource}</strong> (Lot #{project.auctionLotNumber})</span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                              {project.hasKeys && <span>🔑 Keys</span>}
                              {project.hasSpareWheel && <span>🛞 Spare</span>}
                              {project.hasBattery && <span>🔋 Battery</span>}
                              {project.odometerReading && <span>Odo: {project.odometerReading}</span>}
                            </div>
                          </div>

                          <p className="text-xs text-slate-400 line-clamp-1">
                            Damage: {project.damageDescription}
                          </p>
                        </div>
                      </div>

                      {/* Financial Value Box */}
                      <div className="w-full lg:w-auto grid grid-cols-3 gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs shrink-0">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Client Total:</span>
                          <span className="font-mono font-bold text-white text-sm">{formatZAR(total)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Market Retail:</span>
                          <span className="font-mono text-slate-300 text-sm">{formatZAR(project.financials.estimatedMarketRetailValue)}</span>
                        </div>
                        <div>
                          <span className="text-emerald-400 block text-[10px] font-bold">Client Saves:</span>
                          <span className="font-mono font-bold text-emerald-400 text-sm">
                            {formatZAR(savings.amount)} ({savings.percentage}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-xs">
                      <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{project.technicianLogs.length} Tech Logs</span>
                        <span>•</span>
                        <span>{project.photoEvidence.length} Photos</span>
                        <span>•</span>
                        <span>Est Completion: <strong className="text-slate-200">{project.estimatedCompletionDate}</strong></span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleViewAsClient(project)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors"
                          title="Preview secure client restoration tracking page"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span>Client Portal</span>
                        </button>

                        <button
                          onClick={() => handleOpenTransit(project)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors"
                          title="Manage flatbed towing & yard gate pass"
                        >
                          <Truck className="w-3.5 h-3.5 text-amber-400" />
                          <span>Transit & Towing</span>
                        </button>

                        <button
                          onClick={() => handleOpenCalculator(project)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors"
                          title="Adjust repair quote and margins"
                        >
                          <Calculator className="w-3.5 h-3.5 text-amber-400" />
                          <span>Quote Calculator</span>
                        </button>

                        <button
                          onClick={() =>
                            openWhatsAppModal({
                              phone: project.clientWhatsApp,
                              name: project.clientName,
                              vehicleDesc: `${project.year} ${project.make} ${project.model}`,
                              projectRef: project.trackingRef,
                              templateType: 'stage_photo',
                            })
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                          title="Send update on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>

                        <button
                          onClick={() => handleOpenJobCard(project)}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all shadow-md active:scale-95"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Job Card</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CLIENT SOURCING WISHLISTS */}
        {activeTab === 'requests' && (
          <div className="p-4 sm:p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Client Vehicle Sourcing Requests</h3>
                <p className="text-xs text-slate-400">
                  Clients request specific cars; our team searches Auction Nation to find matches and provide pre-purchase repair quotes.
                </p>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Log New Sourcing Request</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {clientRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono text-amber-400 font-bold">{req.id}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          req.status === 'searching'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : req.status === 'matched_at_auction'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {req.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {req.preferredMake} {req.preferredModel}
                      </h4>
                      <p className="text-slate-400 text-xs">
                        Years: {req.yearRangeMin} - {req.yearRangeMax} • Target Budget: <strong className="text-amber-400 font-mono">{formatZAR(req.targetMaxBudget)}</strong>
                      </p>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
                      <div>Client: <strong className="text-white">{req.clientName}</strong> ({req.clientPhone})</div>
                      <div>Intent: <span className="text-amber-300 font-semibold">{req.purpose === 'personal_ownership' ? 'Personal Ownership' : 'Resale Flip to WeBuyCars'}</span></div>
                      <p className="text-slate-400 italic mt-1">&quot;{req.notes}&quot;</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() =>
                        openWhatsAppModal({
                          phone: req.clientPhone,
                          name: req.clientName,
                          vehicleDesc: `${req.preferredMake} ${req.preferredModel}`,
                          projectRef: req.id,
                          templateType: 'quote',
                        })
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-bold transition-all"
                    >
                      WhatsApp
                    </button>

                    <button
                      onClick={() => convertRequestToProject(req.id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md active:scale-95"
                    >
                      {req.status === 'converted_to_project' ? 'Project Active' : 'Convert to Auction Project'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AUCTION NATION TRANSIT TRACKER */}
        {activeTab === 'transit' && (
          <div className="p-4 sm:p-6 space-y-4 text-xs">
            <div>
              <h3 className="text-sm font-bold text-white">Post-Auction Flatbed Towing Logistics</h3>
              <p className="text-xs text-slate-400">
                Live status of flatbed recovery vehicles collecting salvage lots from Auction Nation yards.
              </p>
            </div>

            <div className="space-y-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {p.year} {p.make} {p.model}
                      </span>
                      <span className="font-mono text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                        {p.trackingRef}
                      </span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded font-bold uppercase">
                        {p.transitStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-slate-400">
                      Collection Yard: <strong className="text-slate-200">{p.auctionSource}</strong> (Lot #{p.auctionLotNumber}) • Driver: <strong className="text-white">{p.transitDriverName || 'Piet Mthembu'}</strong> ({p.transitFlatbedReg})
                    </p>
                    <p className="text-amber-300 text-[11px]">
                      ETA / Status: {p.estimatedTransitArrival || 'At workshop bay'} • {p.transitNotes}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenTransit(p)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold"
                    >
                      Update Logistics
                    </button>
                    <button
                      onClick={() =>
                        openWhatsAppModal({
                          phone: p.clientWhatsApp,
                          name: p.clientName,
                          vehicleDesc: `${p.year} ${p.make} ${p.model}`,
                          projectRef: p.trackingRef,
                          templateType: 'transit',
                        })
                      }
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                    >
                      WhatsApp Transit Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: WEBUYCARS RESALE ANALYSIS */}
        {activeTab === 'webuycars' && (
          <div className="p-4 sm:p-6 space-y-4 text-xs">
            <div className="bg-cyan-950/30 border border-cyan-500/30 p-4 rounded-xl flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white text-sm">WeBuyCars Instant Resale Liquidity Channel</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Our model allows clients and our workshop to immediately cash out accident-repaired vehicles directly to WeBuyCars with certified roadworthy tests, ensuring guaranteed profitability and downside protection.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Vehicle Project</th>
                    <th className="py-3 px-3">All-In Total Cost</th>
                    <th className="py-3 px-3">WeBuyCars Cash Valuation</th>
                    <th className="py-3 px-3">Projected Net Margin</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {projects.map((p) => {
                    const total = calculateTotalInvestment(p.financials);
                    const wbc = calculateWeBuyCarsProfit(p.financials);
                    return (
                      <tr key={p.id} className="hover:bg-slate-900/50">
                        <td className="py-3 px-4">
                          <span className="font-bold text-white block">{p.year} {p.make} {p.model}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{p.trackingRef} • Lot #{p.auctionLotNumber}</span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-white">{formatZAR(total)}</td>
                        <td className="py-3 px-3 font-mono font-bold text-cyan-400">{formatZAR(p.financials.weBuyCarsInstantValuation)}</td>
                        <td className="py-3 px-3">
                          <span className="font-mono font-black text-emerald-400 text-sm">+{formatZAR(wbc.profit)}</span>
                          <span className="text-[10px] text-slate-400 block">({wbc.marginPct}% Return on Cost)</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() =>
                              openWhatsAppModal({
                                phone: p.clientWhatsApp,
                                name: p.clientName,
                                vehicleDesc: `${p.year} ${p.make} ${p.model}`,
                                projectRef: p.trackingRef,
                                templateType: 'webuycars',
                              })
                            }
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs"
                          >
                            Send WeBuyCars Valuation to Client
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
