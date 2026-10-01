import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Calculator, 
  TrendingUp, 
  PiggyBank, 
  Send, 
  Save, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Wrench,
  Truck,
  Car,
  ClipboardPaste,
  Key,
  Disc,
  BatteryCharging,
  Sparkles
} from 'lucide-react';
import { 
  formatZAR, 
  calculateAcquisitionCost, 
  calculateRepairCost, 
  calculateTotalInvestment, 
  calculateSavings, 
  calculateWeBuyCarsProfit, 
  evaluateFeasibility,
  generateWhatsAppLink
} from '../utils/formatters';
import { parseAuctionNationText } from '../utils/auctionNationParser';
import { FinancialBreakdown, VehicleProject } from '../types';

export const ProfitabilityCalculatorModal: React.FC = () => {
  const { 
    isCalculatorOpen, 
    setIsCalculatorOpen, 
    calculatorPreloadProject, 
    addProject, 
    updateProject,
    openWhatsAppModal 
  } = useApp();

  const [clientName, setClientName] = useState('New Client');
  const [clientPhone, setClientPhone] = useState('082 123 4567');
  const [make, setMake] = useState('VOLKSWAGEN');
  const [model, setModel] = useState('POLO 1.0 TSI TRENDLINE');
  const [year, setYear] = useState(2018);
  const [auctionLot, setAuctionLot] = useState('7');
  const [auctionYard, setAuctionYard] = useState('AuctionNation PE');
  const [registrationCode, setRegistrationCode] = useState<'CODE 2' | 'CODE 3' | 'CODE 4'>('CODE 2');
  const [hasKeys, setHasKeys] = useState(true);
  const [hasSpareWheel, setHasSpareWheel] = useState(true);
  const [hasBattery, setHasBattery] = useState(true);
  const [odometerReading, setOdometerReading] = useState('unknown');
  const [damageNotes, setDamageNotes] = useState('Accident damage to front right bumper, RHS fender, headlamp mounting. Chassis straight.');

  // Raw Auction Nation Text Parser Drawer
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [rawAuctionText, setRawAuctionText] = useState('');

  const [financials, setFinancials] = useState<FinancialBreakdown>({
    auctionEstimatedBid: 58000,
    auctionActualBid: 58000,
    auctionBuyerFeePercentage: 9.0,
    auctionAdminNatisFee: 2500,
    towingTransitCost: 3800,
    panelBeatingLaborHours: 12,
    panelBeatingHourlyRate: 480,
    sprayPaintPanelsCount: 2,
    sprayPaintCostPerPanel: 2800,
    partsTotalEstimate: 9800,
    mechanicalAndAlignmentFee: 1800,
    roadworthyAndCOFFee: 1500,
    contingencyBuffer: 2500,
    estimatedMarketRetailValue: 168000,
    weBuyCarsInstantValuation: 134000,
  });

  useEffect(() => {
    if (calculatorPreloadProject) {
      setClientName(calculatorPreloadProject.clientName);
      setClientPhone(calculatorPreloadProject.clientWhatsApp);
      setMake(calculatorPreloadProject.make);
      setModel(calculatorPreloadProject.model);
      setYear(calculatorPreloadProject.year);
      setAuctionLot(calculatorPreloadProject.auctionLotNumber);
      setAuctionYard(calculatorPreloadProject.auctionSource);
      setRegistrationCode(calculatorPreloadProject.registrationCode || 'CODE 2');
      setHasKeys(calculatorPreloadProject.hasKeys ?? true);
      setHasSpareWheel(calculatorPreloadProject.hasSpareWheel ?? true);
      setHasBattery(calculatorPreloadProject.hasBattery ?? true);
      setOdometerReading(calculatorPreloadProject.odometerReading || 'unknown');
      setDamageNotes(calculatorPreloadProject.damageDescription);
      setFinancials(calculatorPreloadProject.financials);
    }
  }, [calculatorPreloadProject]);

  if (!isCalculatorOpen) return null;

  const acquisitionCost = calculateAcquisitionCost(financials);
  const repairCost = calculateRepairCost(financials);
  const totalInvestment = calculateTotalInvestment(financials);
  const savings = calculateSavings(financials);
  const wbcProfit = calculateWeBuyCarsProfit(financials);
  const feasibility = evaluateFeasibility(financials);

  const handleFinancialChange = (key: keyof FinancialBreakdown, val: number) => {
    setFinancials((prev) => ({
      ...prev,
      [key]: isNaN(val) ? 0 : val,
    }));
  };

  const handleParseAuctionText = () => {
    if (!rawAuctionText.trim()) return;
    const parsed = parseAuctionNationText(rawAuctionText);
    setMake(parsed.make);
    setModel(parsed.model);
    setYear(parsed.year);
    setAuctionLot(parsed.lotNumber);
    setAuctionYard(parsed.location);
    setRegistrationCode(parsed.registrationCode);
    setHasKeys(parsed.hasKeys);
    setHasSpareWheel(parsed.hasSpareWheel);
    setHasBattery(parsed.hasBattery);
    setOdometerReading(parsed.odometer);

    // Auto-update financials with smart valuation estimates
    setFinancials((prev) => ({
      ...prev,
      auctionEstimatedBid: parsed.estimatedBidSuggestion,
      auctionActualBid: parsed.estimatedBidSuggestion,
      estimatedMarketRetailValue: parsed.marketRetailSuggestion,
      weBuyCarsInstantValuation: parsed.weBuyCarsSuggestion,
      partsTotalEstimate: parsed.repairEstimateSuggestion,
      towingTransitCost: parsed.location.toLowerCase().includes('pe') ? 3800 : 2000,
    }));

    setShowPasteBox(false);
  };

  const handleInsertSampleText = () => {
    setRawAuctionText(
`VOLKSWAGEN
POLO 1.0 TSI TRENDLINE
Year:
2018
Make:
VOLKSWAGEN
Odometer:
unknown
Code:
CODE 2
Used MotorVehicle
Location
AuctionNation PE
LotNumber
7
HasKeys
SpareWheel
Battery`
    );
  };

  const handleSaveProject = () => {
    if (calculatorPreloadProject) {
      updateProject(calculatorPreloadProject.id, {
        clientName,
        clientPhone,
        clientWhatsApp: clientPhone,
        make,
        model,
        year,
        auctionLotNumber: auctionLot,
        auctionSource: auctionYard,
        registrationCode,
        hasKeys,
        hasSpareWheel,
        hasBattery,
        odometerReading,
        damageDescription: damageNotes,
        financials,
      });
    } else {
      const newRef = `AR-${Math.floor(1000 + Math.random() * 9000)}`;
      const newProject: VehicleProject = {
        id: `proj-${Date.now()}`,
        trackingRef: newRef,
        clientName,
        clientPhone,
        clientEmail: `${clientName.toLowerCase().replace(/\s+/g, '.')}@example.co.za`,
        clientWhatsApp: clientPhone,
        make,
        model,
        year,
        vin: `AAVZZZ${Math.floor(10000000000 + Math.random() * 90000000000)}`,
        mileage: odometerReading === 'unknown' ? 62000 : parseInt(odometerReading.replace(/[^0-9]/g, '')) || 55000,
        engine: '1.0L TSI',
        transmission: 'Manual',
        colour: 'White',
        auctionSource: auctionYard,
        auctionLotNumber: auctionLot,
        registrationCode,
        hasKeys,
        hasSpareWheel,
        hasBattery,
        odometerReading,
        damageDescription: damageNotes,
        damageSeverity: 'Light Cosmetic',
        runAndDriveStatus: 'Starts & Moves',
        primaryPhoto: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80',
        stage: 'quoted',
        transitStatus: 'pending_payment',
        financials,
        parts: [
          {
            id: `p-${Date.now()}-1`,
            name: 'Front Bumper Cover & Clips',
            category: 'body_panel',
            source: 'Quality Aftermarket',
            estimatedCost: 3500,
            status: 'needed',
          },
          {
            id: `p-${Date.now()}-2`,
            name: 'Right Headlight Unit',
            category: 'lighting',
            source: 'Salvage Tested',
            estimatedCost: 2600,
            status: 'needed',
          },
        ],
        technicianLogs: [],
        photoEvidence: [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        estimatedCompletionDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        clientNotes: `Calculated quote from Auction Nation listing. Code: ${registrationCode}. Estimated savings: ${savings.percentage}%.`,
      };
      addProject(newProject);
    }
    setIsCalculatorOpen(false);
  };

  const handleSendWhatsAppQuote = () => {
    openWhatsAppModal({
      phone: clientPhone,
      name: clientName,
      vehicleDesc: `${year} ${make} ${model} (Lot #${auctionLot})`,
      projectRef: calculatorPreloadProject?.trackingRef || 'QUOTE-PENDING',
      templateType: 'quote',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl shadow-2xl text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Pre-Purchase Salvage & Profitability Calculator
                <span className="text-xs bg-amber-500 text-slate-950 font-extrabold px-2 py-0.5 rounded-full">
                  Auction Nation to WeBuyCars
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Verify feasibility & customer savings margin BEFORE bidding on the auction platform.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCalculatorOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Executive Feasibility Banner */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              feasibility.verdict === 'exceptional_margin'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : feasibility.verdict === 'good_savings'
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {feasibility.verdict === 'exceptional_margin' || feasibility.verdict === 'good_savings' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-extrabold text-sm tracking-wide uppercase flex items-center gap-2">
                  <span>{feasibility.label}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900/60 border border-current">
                    {savings.percentage}% Below Market Retail
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{feasibility.explanation}</p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 text-right shrink-0">
              <div className="text-xs text-slate-400 font-medium">Customer Net Savings:</div>
              <div className="text-xl font-black text-amber-400">
                {formatZAR(savings.amount)}
              </div>
            </div>
          </div>

          {/* Auction Nation Smart Listing Importer Bar */}
          <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                <ClipboardPaste className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  Auction Nation Smart Listing Importer
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded">
                    1-Click Autofill
                  </span>
                </span>
                <p className="text-[11px] text-slate-400">
                  Paste raw listing text directly from Auction Nation (e.g. Year, Make, Code 2, Lot, Location, HasKeys).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowPasteBox(!showPasteBox)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-md active:scale-95"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>{showPasteBox ? 'Close Importer' : 'Paste Listing Text'}</span>
              </button>
            </div>
          </div>

          {/* Quick Paste Drawer */}
          {showPasteBox && (
            <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/40 space-y-3 text-xs animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Paste Raw Auction Nation Listing Data
                </span>
                <button
                  type="button"
                  onClick={handleInsertSampleText}
                  className="text-[11px] text-amber-300 hover:text-white underline"
                >
                  Insert Sample (Polo Lot #7 PE)
                </button>
              </div>

              <textarea
                rows={7}
                placeholder="Paste here, e.g.:
VOLKSWAGEN
POLO 1.0 TSI TRENDLINE
Year: 2018
Code: CODE 2
Location AuctionNation PE
LotNumber 7
HasKeys
SpareWheel
Battery"
                value={rawAuctionText}
                onChange={(e) => setRawAuctionText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  Automatically detects Year, Make, Model, Lot Number, Yard Location, Code 2/3, Keys, and Battery.
                </span>
                <button
                  type="button"
                  onClick={handleParseAuctionText}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-lg shadow-md active:scale-95 text-xs"
                >
                  Parse & Autofill Calculator
                </button>
              </div>
            </div>
          )}

          {/* Vehicle & Client Quick Info with Auction Nation Specs */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-medium focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium block mb-1">Client WhatsApp</label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-medium focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium block mb-1">Vehicle Make & Model</label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-medium text-center"
                  />
                  <input
                    type="text"
                    value={`${make} ${model}`}
                    onChange={(e) => {
                      const parts = e.target.value.split(' ');
                      setMake(parts[0] || '');
                      setModel(parts.slice(1).join(' ') || '');
                    }}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 font-medium block mb-1">Auction Nation Lot #</label>
                <input
                  type="text"
                  value={auctionLot}
                  onChange={(e) => setAuctionLot(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Auction Nation Specific Fields: Code 2/3, Yard Location, Inclusions */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Auction Yard Location</label>
                <input
                  type="text"
                  value={auctionYard}
                  onChange={(e) => setAuctionYard(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Registration Code</label>
                <select
                  value={registrationCode}
                  onChange={(e) => setRegistrationCode(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-300 font-bold"
                >
                  <option value="CODE 2">CODE 2 (Used Motor Vehicle - Clean)</option>
                  <option value="CODE 3">CODE 3 (Built-up Salvage)</option>
                  <option value="CODE 4">CODE 4 (Scrap / Stripping)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Odometer</label>
                <input
                  type="text"
                  value={odometerReading}
                  onChange={(e) => setOdometerReading(e.target.value)}
                  placeholder="e.g. unknown or 65,000 km"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">Inclusions Checklist</label>
                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-1 cursor-pointer" title="Key present">
                    <input
                      type="checkbox"
                      checked={hasKeys}
                      onChange={(e) => setHasKeys(e.target.checked)}
                      className="accent-amber-500 rounded"
                    />
                    <span className="text-[11px] text-slate-300">🔑 Keys</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer" title="Spare wheel present">
                    <input
                      type="checkbox"
                      checked={hasSpareWheel}
                      onChange={(e) => setHasSpareWheel(e.target.checked)}
                      className="accent-amber-500 rounded"
                    />
                    <span className="text-[11px] text-slate-300">🛞 Spare</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer" title="Battery present">
                    <input
                      type="checkbox"
                      checked={hasBattery}
                      onChange={(e) => setHasBattery(e.target.checked)}
                      className="accent-amber-500 rounded"
                    />
                    <span className="text-[11px] text-slate-300">🔋 Battery</span>
                  </label>
                </div>
              </div>
            </div>

            {registrationCode === 'CODE 2' && (
              <div className="bg-emerald-950/30 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2 text-emerald-300 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                <span>
                  <strong>CODE 2 Advantage:</strong> This vehicle is classified as a standard Used Motor Vehicle with clean title (not deregistered as Code 3 built-up). Normal roadworthy registration applies, making financing and WeBuyCars buyout values significantly higher!
                </span>
              </div>
            )}
          </div>

          {/* 3 Main Calculation Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Column 1: Acquisition (Auction Nation) */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">1. Auction Nation Purchase</h3>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {formatZAR(acquisitionCost)}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Auction Winning / Bid Price</span>
                  <span className="font-mono text-white font-bold">{formatZAR(financials.auctionEstimatedBid)}</span>
                </div>
                <input
                  type="number"
                  step="1000"
                  value={financials.auctionEstimatedBid}
                  onChange={(e) => handleFinancialChange('auctionEstimatedBid', parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Buyer Fee (%)</span>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.5"
                      value={financials.auctionBuyerFeePercentage}
                      onChange={(e) => handleFinancialChange('auctionBuyerFeePercentage', parseFloat(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                    />
                    <span className="absolute right-2.5 top-1.5 text-slate-500 font-bold">%</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                    = {formatZAR((financials.auctionEstimatedBid * financials.auctionBuyerFeePercentage) / 100)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">NATIS & Admin Fee</span>
                  <input
                    type="number"
                    step="100"
                    value={financials.auctionAdminNatisFee}
                    onChange={(e) => handleFinancialChange('auctionAdminNatisFee', parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Yard Flatbed Towing (Delivery)</span>
                  <span className="text-xs text-amber-400/80">Handled by our team</span>
                </div>
                <input
                  type="number"
                  step="100"
                  value={financials.towingTransitCost}
                  onChange={(e) => handleFinancialChange('towingTransitCost', parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                />
              </div>

              <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/60">
                * Note: Client pays Auction Nation directly via EFT. Flatbed transport is dispatched immediately upon release approval.
              </p>
            </div>

            {/* Column 2: Panel Beating & Workshop Repairs */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-orange-400" />
                  <h3 className="text-sm font-bold text-white">2. Workshop Panel Beating</h3>
                </div>
                <span className="text-xs font-mono font-bold text-orange-400">
                  {formatZAR(repairCost)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Panel Labor (Hours)</span>
                  <input
                    type="number"
                    value={financials.panelBeatingLaborHours}
                    onChange={(e) => handleFinancialChange('panelBeatingLaborHours', parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                    @ {formatZAR(financials.panelBeatingHourlyRate)}/hr = {formatZAR(financials.panelBeatingLaborHours * financials.panelBeatingHourlyRate)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Spray Panels (Qty)</span>
                  <input
                    type="number"
                    value={financials.sprayPaintPanelsCount}
                    onChange={(e) => handleFinancialChange('sprayPaintPanelsCount', parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                    @ {formatZAR(financials.sprayPaintCostPerPanel)}/panel = {formatZAR(financials.sprayPaintPanelsCount * financials.sprayPaintCostPerPanel)}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Replacement Parts Estimate</span>
                  <span className="font-mono text-slate-300">{formatZAR(financials.partsTotalEstimate)}</span>
                </div>
                <input
                  type="number"
                  step="500"
                  value={financials.partsTotalEstimate}
                  onChange={(e) => handleFinancialChange('partsTotalEstimate', parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Mech & Alignment</span>
                  <input
                    type="number"
                    value={financials.mechanicalAndAlignmentFee}
                    onChange={(e) => handleFinancialChange('mechanicalAndAlignmentFee', parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Roadworthy / COF</span>
                  <input
                    type="number"
                    value={financials.roadworthyAndCOFFee}
                    onChange={(e) => handleFinancialChange('roadworthyAndCOFFee', parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Unforeseen Buffer (Contingency)</span>
                  <span className="font-mono text-slate-400">{formatZAR(financials.contingencyBuffer)}</span>
                </div>
                <input
                  type="number"
                  step="500"
                  value={financials.contingencyBuffer}
                  onChange={(e) => handleFinancialChange('contingencyBuffer', parseFloat(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                />
              </div>
            </div>

            {/* Column 3: Market Valuations & WeBuyCars Resale */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">3. Resale & Market Value</h3>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    Benchmark
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-semibold">AutoTrader / Retail Market Value</span>
                    <span className="font-mono text-emerald-400 font-bold">{formatZAR(financials.estimatedMarketRetailValue)}</span>
                  </div>
                  <input
                    type="number"
                    step="1000"
                    value={financials.estimatedMarketRetailValue}
                    onChange={(e) => handleFinancialChange('estimatedMarketRetailValue', parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    What identical vehicles sell for at standard dealership lots in SA.
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-semibold">WeBuyCars Instant Buyout Valuation</span>
                    <span className="font-mono text-cyan-400 font-bold">{formatZAR(financials.weBuyCarsInstantValuation)}</span>
                  </div>
                  <input
                    type="number"
                    step="1000"
                    value={financials.weBuyCarsInstantValuation}
                    onChange={(e) => handleFinancialChange('weBuyCarsInstantValuation', parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Immediate cash sale floor price if client or our team chooses to flip directly to WeBuyCars.
                  </span>
                </div>
              </div>

              {/* Total Summary Box inside Col 3 */}
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Total All-In Investment:</span>
                  <span className="font-mono font-bold text-white text-sm">{formatZAR(totalInvestment)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-800 pt-2 text-emerald-300 font-bold">
                  <span>Client Discount Savings:</span>
                  <span className="font-mono text-sm">{formatZAR(savings.amount)} ({savings.percentage}%)</span>
                </div>
                <div className="flex justify-between items-center text-cyan-300 font-bold">
                  <span>WeBuyCars Net Flip Profit:</span>
                  <span className="font-mono text-sm">{formatZAR(wbcProfit.profit)} ({wbcProfit.marginPct}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 rounded-b-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <PiggyBank className="w-4 h-4 text-amber-400" />
            <span>
              Unique Advantage: Client pays <strong className="text-white">{formatZAR(totalInvestment)}</strong> for a vehicle worth <strong className="text-white">{formatZAR(financials.estimatedMarketRetailValue)}</strong>.
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCalculatorOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleSendWhatsAppQuote}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Share Quote on WhatsApp</span>
            </button>

            <button
              onClick={handleSaveProject}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{calculatorPreloadProject ? 'Update Project Quote' : 'Create Active Project'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
