import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  MessageSquare, 
  Sparkles, 
  Car, 
  Phone, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { generateWhatsAppLink, formatZAR, calculateTotalInvestment, calculateSavings, calculateWeBuyCarsProfit } from '../utils/formatters';

export const WhatsAppMessengerModal: React.FC = () => {
  const { 
    isWhatsAppModalOpen, 
    setIsWhatsAppModalOpen, 
    whatsAppData, 
    activeProject,
    recordWhatsAppSent 
  } = useApp();

  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [vehicleDesc, setVehicleDesc] = useState('');
  const [template, setTemplate] = useState<'quote' | 'transit' | 'stage_photo' | 'completion' | 'webuycars'>('stage_photo');
  const [customText, setCustomText] = useState('');
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    if (whatsAppData) {
      setRecipientPhone(whatsAppData.phone || activeProject?.clientWhatsApp || '082 123 4567');
      setRecipientName(whatsAppData.name || activeProject?.clientName || 'Valued Client');
      setVehicleDesc(whatsAppData.vehicleDesc || `${activeProject?.year} ${activeProject?.make} ${activeProject?.model}`);
      setTemplate(whatsAppData.templateType || 'stage_photo');
    } else if (activeProject) {
      setRecipientPhone(activeProject.clientWhatsApp);
      setRecipientName(activeProject.clientName);
      setVehicleDesc(`${activeProject.year} ${activeProject.make} ${activeProject.model}`);
    }
  }, [whatsAppData, activeProject]);

  useEffect(() => {
    // Generate text based on active project and template
    if (!activeProject) {
      setCustomText(`Hi ${recipientName}, this is the AutoRevive Workshop team regarding your vehicle ${vehicleDesc}.`);
      return;
    }

    const fin = activeProject.financials;
    const total = calculateTotalInvestment(fin);
    const savings = calculateSavings(fin);
    const wbc = calculateWeBuyCarsProfit(fin);

    if (template === 'quote') {
      setCustomText(
        `👋 Hi ${recipientName}!\n\n` +
        `🚗 *AUCTION NATION PRE-PURCHASE QUOTE*\n` +
        `We evaluated the salvage *${vehicleDesc}* (Lot #${activeProject.auctionLotNumber}):\n\n` +
        `• Est. Winning Bid: ${formatZAR(fin.auctionEstimatedBid)}\n` +
        `• Auction Fees & NATIS: ${formatZAR(fin.auctionEstimatedBid * (fin.auctionBuyerFeePercentage / 100) + fin.auctionAdminNatisFee)}\n` +
        `• Flatbed Towing to Workshop: ${formatZAR(fin.towingTransitCost)}\n` +
        `• Panel Beating & Paint Repair: ${formatZAR(fin.panelBeatingLaborHours * fin.panelBeatingHourlyRate + fin.sprayPaintPanelsCount * fin.sprayPaintCostPerPanel)}\n` +
        `• New Replacement Parts & Roadworthy: ${formatZAR(fin.partsTotalEstimate + fin.roadworthyAndCOFFee)}\n` +
        `━━━━━━━━━━━━━━━\n` +
        `💰 *YOUR ALL-IN COST:* ${formatZAR(total)}\n` +
        `📈 *Market Retail Value:* ${formatZAR(fin.estimatedMarketRetailValue)}\n` +
        `🎉 *YOU SAVE: ${formatZAR(savings.amount)} (${savings.percentage}% OFF!)*\n\n` +
        `You pay Auction Nation directly. Should we proceed to register the bid?`
      );
    } else if (template === 'transit') {
      setCustomText(
        `🚛 *TRANSIT UPDATE - AutoRevive Logistics*\n\n` +
        `Hi ${recipientName}, update on your *${vehicleDesc}* (${activeProject.trackingRef}):\n\n` +
        `• Status: *${activeProject.transitStatus.replace(/_/g, ' ').toUpperCase()}*\n` +
        `• Collection Yard: ${activeProject.auctionSource}\n` +
        `• Flatbed Driver: ${activeProject.transitDriverName || 'Piet Mthembu'} (${activeProject.transitDriverPhone || '073 221 8490'})\n` +
        `• Flatbed Reg: ${activeProject.transitFlatbedReg || 'ND 784-902'}\n` +
        `• ETA Workshop: ${activeProject.estimatedTransitArrival || 'In-transit'}\n\n` +
        `Track live photos & milestones in your secure client dashboard: https://autorevive.app/track/${activeProject.trackingRef}`
      );
    } else if (template === 'stage_photo') {
      setCustomText(
        `📸 *WORKSHOP PROGRESS & PHOTO EVIDENCE*\n\n` +
        `Hi ${recipientName}!\n` +
        `Our panel beating team just completed milestone: *${activeProject.stage.toUpperCase().replace(/_/g, ' ')}* on your *${vehicleDesc}*.\n\n` +
        `✅ Panel alignment & jig measurements verified to factory spec.\n` +
        `✅ High resolution photo evidence uploaded to your dashboard.\n\n` +
        `🔗 View your updated restoration timeline & photos here:\n` +
        `https://autorevive.app/track/${activeProject.trackingRef}\n\n` +
        `- AutoRevive Workshop Team`
      );
    } else if (template === 'completion') {
      setCustomText(
        `🏁 *RESTORATION 100% COMPLETE!*\n\n` +
        `Hi ${recipientName}!\n` +
        `Your *${vehicleDesc}* (${activeProject.trackingRef}) has finished final detailing and passed roadworthy COF inspection!\n\n` +
        `• Condition: Showroom Ready\n` +
        `• Savings Realized: ${formatZAR(savings.amount)} vs retail\n` +
        `• Handover Location: AutoRevive Main Center\n\n` +
        `Please let us know what time suits you today for vehicle handover!`
      );
    } else if (template === 'webuycars') {
      setCustomText(
        `📊 *WEBUYCARS RESALE VALUATION REPORT*\n\n` +
        `Hi ${recipientName}!\n` +
        `Here is the verified WeBuyCars instant trade-in appraisal for your completed *${vehicleDesc}*:\n\n` +
        `• Total Investment: ${formatZAR(total)}\n` +
        `• WeBuyCars Buyout Valuation: ${formatZAR(fin.weBuyCarsInstantValuation)}\n` +
        `• Projected Net Flip Profit: *${formatZAR(wbc.profit)} (${wbc.marginPct}% Margin)*\n\n` +
        `Would you like our team to facilitate the direct trade-in sale or deliver the vehicle to you?`
      );
    }
  }, [template, recipientName, vehicleDesc, activeProject]);

  if (!isWhatsAppModalOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(customText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const link = generateWhatsAppLink(recipientPhone, customText);
    if (activeProject) {
      recordWhatsAppSent(activeProject.id, `Sent ${template} template to ${recipientName}`);
    }
    setSentSuccess(true);
    window.open(link, '_blank', 'noopener,noreferrer');
    setTimeout(() => {
      setSentSuccess(false);
      setIsWhatsAppModalOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-start sm:items-center justify-center p-2.5 sm:p-5 pb-20 sm:pb-5 overscroll-contain">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-2xl text-slate-100 flex flex-col max-h-[calc(100dvh-2.5rem)] sm:max-h-[90vh] my-auto overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-emerald-950/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                WhatsApp Client Communication Hub
                <span className="text-xs bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                  Direct Integration
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Send real-time quotes, transit milestones & photo evidence links directly to client WhatsApp.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsWhatsAppModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
          {/* Recipient Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Recipient Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Client WhatsApp Number</label>
              <input
                type="text"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-emerald-400 font-bold font-mono"
              />
            </div>
          </div>

          {/* Quick Automotive Message Template Switcher */}
          <div>
            <label className="text-slate-300 font-bold block mb-2 uppercase tracking-wider text-[11px]">
              Select Automotive Template
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {[
                { id: 'quote', label: '1. Auction Quote', desc: 'Pre-purchase savings' },
                { id: 'transit', label: '2. Flatbed Transit', desc: 'Yard pickup to bay' },
                { id: 'stage_photo', label: '3. Repair Photos', desc: 'Milestone evidence' },
                { id: 'completion', label: '4. Handover Ready', desc: 'Roadworthy passed' },
                { id: 'webuycars', label: '5. WeBuyCars Resale', desc: 'Instant cash buyout' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id as any)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    template === t.id
                      ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold ring-1 ring-emerald-400/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="block text-[11px]">{t.label}</span>
                  <span className="text-[9px] text-slate-400 hidden sm:block">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message Preview Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-400 font-medium">WhatsApp Message Content (Editable)</label>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 px-2 py-0.5 rounded transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>

            <div className="relative">
              <textarea
                rows={9}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-white font-sans text-xs leading-relaxed focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-slate-800 bg-slate-950/95 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] sm:text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Opens official WhatsApp client via wa.me protocol.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsWhatsAppModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleOpenWhatsApp}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
            >
              {sentSuccess ? <CheckCircle2 className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
              <span>{sentSuccess ? 'Opened WhatsApp!' : 'Send via WhatsApp'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
