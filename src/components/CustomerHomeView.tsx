import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Car, 
  TrendingDown, 
  ShieldCheck, 
  Truck, 
  Wrench, 
  Calculator, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  MessageSquare, 
  Phone, 
  PiggyBank, 
  ChevronRight,
  ClipboardList,
  Flame,
  Award,
  HelpCircle,
  Clock,
  Layers,
  FileCheck
} from 'lucide-react';
import { formatZAR } from '../utils/formatters';

export const CustomerHomeView: React.FC = () => {
  const { 
    projects, 
    verifyClientPin, 
    setCurrentView, 
    addClientRequest,
    openWhatsAppModal,
    setIsCalculatorOpen,
    setCalculatorPreloadProject
  } = useApp();

  // Instant Track PIN state
  const [trackPinInput, setTrackPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Sourcing Intake Form state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [preferredMake, setPreferredMake] = useState('Volkswagen');
  const [preferredModel, setPreferredModel] = useState('');
  const [yearMin, setYearMin] = useState(2019);
  const [yearMax, setYearMax] = useState(2023);
  const [targetBudget, setTargetBudget] = useState(160000);
  const [purpose, setPurpose] = useState<'personal_ownership' | 'resale_flip_webuycars'>('personal_ownership');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackPinInput.trim()) return;
    const success = verifyClientPin(trackPinInput);
    if (success) {
      setCurrentView('client_portal');
    } else {
      setPinError('Tracking PIN not found. Try sample: AR-PE07 or AR-8821');
    }
  };

  const handleSourcingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !preferredModel) return;

    addClientRequest({
      id: `REQ-${Date.now().toString().slice(-4)}`,
      clientName,
      clientPhone,
      clientEmail: clientEmail || `${clientName.toLowerCase().replace(/\s+/g, '.')}@client.co.za`,
      preferredMake,
      preferredModel,
      yearRangeMin: yearMin,
      yearRangeMax: yearMax,
      targetMaxBudget: targetBudget,
      purpose,
      notes: `Submitted via website homepage. Target budget: ${formatZAR(targetBudget)}.`,
      dateCreated: new Date().toISOString().split('T')[0],
      status: 'searching',
    });

    setRequestSubmitted(true);
    setClientName('');
    setPreferredModel('');
    setTimeout(() => setRequestSubmitted(false), 5000);
  };

  const handleWhatsAppGeneral = () => {
    openWhatsAppModal({
      phone: '084 762 1993',
      name: 'Workshop Team',
      vehicleDesc: 'Auction Nation Sourcing Inquiry',
      projectRef: 'HOME-INQUIRY',
      templateType: 'quote',
      customMessage: 'Hi AutoRevive Team, I am looking to source an accident damaged vehicle from Auction Nation and get a panel beating restoration quote. Can you assist me?',
    });
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-12 w-full max-w-full overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-5 sm:p-10 lg:p-12 overflow-hidden shadow-2xl w-full max-w-full">
        <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>South Africa&apos;s Smart Salvage & Restoration Model</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none">
            Get Your Dream Car At A{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent underline decoration-amber-500/50">
              Fraction Of The Price.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            You tell us which car you want. We source clean-title vehicles on <strong>Auction Nation</strong>, provide a comprehensive repair quote, and restore it to factory showroom standards. <strong>You pay the auction platform directly</strong>, saving 30% to 50% below dealership retail.
          </p>

          {/* Quick Action Box: Find Car OR Track Existing Car */}
          <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            {/* Action Card 1: Sourcing Inquiry */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all shadow-lg flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs uppercase font-extrabold text-amber-400 block mb-1">
                  Looking For A Car?
                </span>
                <h3 className="text-base font-bold text-white">Find My Vehicle At Auction</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Tell us your desired make, model, and budget. We scan daily Auction Nation drops.
                </p>
              </div>
              <a
                href="#sourcing-form"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs transition-all shadow-md active:scale-95"
              >
                <span>Request A Car Search</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Action Card 2: Track Active Project */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all shadow-lg flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs uppercase font-extrabold text-emerald-400 block mb-1">
                  Already Have A Vehicle With Us?
                </span>
                <h3 className="text-base font-bold text-white">Track Restoration Journey</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your private Reference PIN to view live photos, transit status, and progress.
                </p>
              </div>

              <form onSubmit={handleTrackSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="PIN (e.g. AR-PE07)"
                    value={trackPinInput}
                    onChange={(e) => setTrackPinInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-300 placeholder-slate-500 uppercase focus:border-emerald-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl text-xs transition-all shrink-0 active:scale-95"
                  >
                    Track Live
                  </button>
                </div>
                {pinError && <p className="text-[10px] text-rose-400">{pinError}</p>}
              </form>
            </div>
          </div>

          {/* 4 Trust Badges */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-t border-slate-800/80">
            <div className="flex items-center justify-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct Auction EFT</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-300">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>CODE 2 Clean Titles</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-300">
              <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Flatbed Towing Included</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-300">
              <PiggyBank className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Save 30%–50% vs Retail</span>
            </div>
          </div>
        </div>
      </section>

      {/* THE 4-STEP CUSTOMER PROCESS FLOW */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
            Transparent Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            How The AutoRevive Model Works
          </h2>
          <p className="text-xs text-slate-400">
            From auction floor to your driveway — here is how our clients get premium vehicles at wholesale salvage rates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-amber-400 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-sm">
              01
            </div>
            <h3 className="font-bold text-white text-sm">Tell Us What You Want</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit your vehicle search request (e.g. 2021 VW Polo TSI or 2020 Toyota Hilux GD-6) and set your target budget limit.
            </p>
            <div className="text-[11px] text-amber-400/80 font-medium">✓ Personal drive or investor flip</div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-amber-400 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-sm">
              02
            </div>
            <h3 className="font-bold text-white text-sm">We Source & Quote Repairs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We locate matches on <strong>Auction Nation</strong> (Lot #), itemize panel beating, paint, and parts, and confirm you save R50,000+ before you bid.
            </p>
            <div className="text-[11px] text-amber-400/80 font-medium">✓ Automated profitability proof</div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-amber-400 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-sm">
              03
            </div>
            <h3 className="font-bold text-white text-sm">You Pay Auction Directly</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upon winning the lot, you pay Auction Nation directly via EFT. Our workshop team dispatches a flatbed tow truck to collect the vehicle from the yard.
            </p>
            <div className="text-[11px] text-amber-400/80 font-medium">✓ Safe & direct transaction</div>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-amber-400 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-sm">
              04
            </div>
            <h3 className="font-bold text-white text-sm">Track & Drive / Resale</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Log into your private dashboard to see photo evidence of panel beating and spray booth baking. Collect your roadworthy vehicle or sell directly to WeBuyCars!
            </p>
            <div className="text-[11px] text-emerald-400 font-bold">✓ Daily WhatsApp photo alerts</div>
          </div>
        </div>
      </section>

      {/* REAL CASE STUDIES & PROVABLE SAVINGS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              Verified Value Proof
            </span>
            <h2 className="text-2xl font-black text-white">
              Recent Restorations & Verified Savings
            </h2>
            <p className="text-xs text-slate-400">
              Real Auction Nation salvage acquisitions restored in our workshop.
            </p>
          </div>
          <div className="text-xs text-slate-400">
            Based on current AutoTrader and WeBuyCars valuations.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Example 1: The User's Exact Polo 1.0 TSI Lot #7 PE */}
          <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between transition-all">
            <div>
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80"
                  alt="VW Polo"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 text-[10px] font-bold bg-slate-950/80 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded backdrop-blur-sm">
                  CODE 2 • Lot #7 (PE Yard)
                </span>
                <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded shadow">
                  Client Saved R 73,520!
                </span>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-white text-base">
                    2018 Volkswagen Polo 1.0 TSI Trendline
                  </h3>
                  <p className="text-xs text-slate-400">
                    Front bumper, fender, and headlight mounting repaired. Engine and chassis 100% factory straight.
                  </p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Auction Nation Bid + PE Towing:</span>
                    <span className="font-mono text-white font-bold">R 69,520</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Workshop Panel & Paint:</span>
                    <span className="font-mono text-white font-bold">R 24,960</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1 text-white font-extrabold">
                    <span>Total Client Investment:</span>
                    <span className="font-mono text-amber-400 font-black">R 94,480</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>AutoTrader Dealership Price:</span>
                    <span className="font-mono line-through">R 168,000</span>
                  </div>
                  <div className="flex justify-between bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30 text-emerald-300 font-bold">
                    <span>Customer Discount Saved:</span>
                    <span className="font-mono">R 73,520 (44% OFF!)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={() => {
                  verifyClientPin('AR-PE07');
                  setCurrentView('client_portal');
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Live Journey Proof (PIN: AR-PE07)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Example 2: Hilux GD-6 Double Cab */}
          <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between transition-all">
            <div>
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80"
                  alt="Toyota Hilux"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 text-[10px] font-bold bg-slate-950/80 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded backdrop-blur-sm">
                  CODE 2 • Lot #AN-91044
                </span>
                <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-cyan-600 text-white px-2 py-0.5 rounded shadow">
                  WeBuyCars Flip: +R 76,450 Profit
                </span>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-white text-base">
                    2021 Toyota Hilux 2.8 GD-6 Raider 4x4
                  </h3>
                  <p className="text-xs text-slate-400">
                    Left rear passenger door and arch flare cosmetic restoration. Certified Celette chassis bench measurement.
                  </p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Auction Winning Bid:</span>
                    <span className="font-mono text-white font-bold">R 295,000</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Workshop Panel Beating & Paint:</span>
                    <span className="font-mono text-white font-bold">R 54,000</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1 text-white font-extrabold">
                    <span>All-In Finished Cost:</span>
                    <span className="font-mono text-amber-400 font-black">R 378,550</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Dealership Market Retail:</span>
                    <span className="font-mono line-through">R 535,000</span>
                  </div>
                  <div className="flex justify-between bg-cyan-950/40 p-2 rounded-lg border border-cyan-500/30 text-cyan-300 font-bold">
                    <span>WeBuyCars Instant Buyout:</span>
                    <span className="font-mono">R 458,000 (+R 76,450 Profit!)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={() => {
                  verifyClientPin('AR-9104');
                  setCurrentView('client_portal');
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Live Journey Proof (PIN: AR-9104)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Example 3: Polo Vivo Comfortline */}
          <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between transition-all">
            <div>
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80"
                  alt="VW Polo Vivo"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 text-[10px] font-bold bg-slate-950/80 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded backdrop-blur-sm">
                  CODE 2 • Lot #AN-88421
                </span>
                <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded shadow">
                  Client Saved R 79,630!
                </span>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-white text-base">
                    2022 Volkswagen Polo Vivo 1.4 Comfortline
                  </h3>
                  <p className="text-xs text-slate-400">
                    Oven-baked clearcoat in spray booth. Client saved over 40% vs second-hand dealer prices in Johannesburg.
                  </p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Auction Winning Bid:</span>
                    <span className="font-mono text-white font-bold">R 78,000</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Panel Beating, Parts & Oven Bake:</span>
                    <span className="font-mono text-white font-bold">R 38,520</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1 text-white font-extrabold">
                    <span>Total Client Investment:</span>
                    <span className="font-mono text-amber-400 font-black">R 118,370</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>AutoTrader Retail Price:</span>
                    <span className="font-mono line-through">R 198,000</span>
                  </div>
                  <div className="flex justify-between bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30 text-emerald-300 font-bold">
                    <span>Customer Discount Saved:</span>
                    <span className="font-mono">R 79,630 (40% OFF!)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={() => {
                  verifyClientPin('AR-8821');
                  setCurrentView('client_portal');
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Live Journey Proof (PIN: AR-8821)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SOURCING INTAKE FORM (WHAT A NEW CUSTOMER SEES & FILLS OUT) */}
      <section id="sourcing-form" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
              Step 1 Of The Journey
            </span>
            <h2 className="text-2xl font-black text-white">
              Tell Us What Car You Are Looking For
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              We search Auction Nation daily to find salvage lots matching your exact spec, then provide you with a full repair quote before you bid.
            </p>
          </div>

          <button
            onClick={handleWhatsAppGeneral}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all active:scale-95 shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat On WhatsApp First</span>
          </button>
        </div>

        {requestSubmitted ? (
          <div className="bg-emerald-950/40 border border-emerald-500/40 p-6 rounded-2xl text-center space-y-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Sourcing Request Received!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Our workshop team has begun scanning upcoming Auction Nation lots for your desired vehicle. We will contact you via WhatsApp with matched lots and full pre-purchase repair quotes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSourcingSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sipho Ndlovu"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">WhatsApp / Mobile Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 082 123 4567"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. sipho@example.co.za"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Make</label>
                <select
                  value={preferredMake}
                  onChange={(e) => setPreferredMake(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Ford">Ford</option>
                  <option value="BMW">BMW</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Nissan">Nissan</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Model / Spec *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Polo Vivo 1.4 or Hilux 2.8 GD-6"
                  value={preferredModel}
                  onChange={(e) => setPreferredModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Year Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={yearMin}
                    onChange={(e) => setYearMin(Number(e.target.value))}
                    className="w-1/2 bg-slate-950 border border-slate-700 rounded-xl px-2 py-2.5 text-white text-center"
                  />
                  <input
                    type="number"
                    value={yearMax}
                    onChange={(e) => setYearMax(Number(e.target.value))}
                    className="w-1/2 bg-slate-950 border border-slate-700 rounded-xl px-2 py-2.5 text-white text-center"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Max Total Budget (ZAR)</label>
                <input
                  type="number"
                  step="5000"
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-amber-400 font-bold focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Purpose */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex flex-col gap-1 transition-all ${
                  purpose === 'personal_ownership'
                    ? 'bg-amber-500/10 border-amber-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="home_purpose"
                    checked={purpose === 'personal_ownership'}
                    onChange={() => setPurpose('personal_ownership')}
                    className="accent-amber-500"
                  />
                  <span className="font-bold text-xs text-white">For Personal Ownership</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  I want a reliable, high-spec vehicle restored to OEM quality at a fraction of the cost to drive myself.
                </span>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex flex-col gap-1 transition-all ${
                  purpose === 'resale_flip_webuycars'
                    ? 'bg-cyan-500/10 border-cyan-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="home_purpose"
                    checked={purpose === 'resale_flip_webuycars'}
                    onChange={() => setPurpose('resale_flip_webuycars')}
                    className="accent-cyan-500"
                  />
                  <span className="font-bold text-xs text-white">For Resale Flip To WeBuyCars</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  I am looking for an investor project to restore and immediately sell to WeBuyCars for instant buyout profit.
                </span>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                Submit Vehicle Search Request
              </button>
            </div>
          </form>
        )}
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
            Clear Answers
          </span>
          <h2 className="text-2xl font-black text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">
            Everything you need to know about our Auction Nation sourcing and repair model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> How do I pay for the vehicle?
            </h3>
            <p className="text-slate-300 leading-relaxed">
              You pay <strong>Auction Nation directly via EFT</strong> upon invoice. We never hold your car purchase funds. There are zero markups on the vehicle bid price. You only pay our workshop for the agreed panel beating, parts, and flatbed transport.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> What is the difference between Code 2 and Code 3?
            </h3>
            <p className="text-slate-300 leading-relaxed">
              We focus primarily on <strong>CODE 2 (Used Motor Vehicles)</strong>, which have clean registration titles and were not deregistered as rebuilt salvage. Code 2 vehicles can be normally insured, financed, and command top resale buyout prices from WeBuyCars.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" /> Who collects the car from Auction Nation?
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Our dedicated workshop flatbed transport crew handles collection, gate-pass clearance, and delivery to our workshop bay from any Auction Nation yard (Johannesburg, Durban, Cape Town, PE). You can track the flatbed en route live in your portal.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-amber-400" /> Can I sell the finished car to WeBuyCars?
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Yes! Before you even bid, our calculator evaluates the current <strong>WeBuyCars Instant Buyout valuation</strong>. Many of our clients are investors who restore accident vehicles with us and immediately cash out with a verified R35,000–R80,000 net profit margin.
            </p>
          </div>
        </div>
      </section>

      {/* WHATSAPP CTA BANNER */}
      <section className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-extrabold uppercase text-emerald-400 tracking-wider">
            Direct Workshop Communication
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Have An Auction Nation Lot You Want Appraised?
          </h3>
          <p className="text-xs text-slate-300">
            Send us the Lot Number or link on WhatsApp and our foreman will run a complete repair quote within minutes.
          </p>
        </div>

        <button
          onClick={handleWhatsAppGeneral}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-3.5 rounded-2xl text-xs shadow-xl shadow-emerald-950/50 active:scale-95 transition-all shrink-0"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          <span>Chat With Workshop Team</span>
        </button>
      </section>
    </div>
  );
};
