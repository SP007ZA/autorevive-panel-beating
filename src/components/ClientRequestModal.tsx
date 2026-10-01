import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ClipboardList, Plus, Car, DollarSign, User, Phone, Mail, FileText } from 'lucide-react';
import { formatZAR } from '../utils/formatters';
import { ClientVehicleRequest } from '../types';

export const ClientRequestModal: React.FC = () => {
  const { isRequestModalOpen, setIsRequestModalOpen, addClientRequest } = useApp();

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [preferredMake, setPreferredMake] = useState('Toyota');
  const [preferredModel, setPreferredModel] = useState('');
  const [yearRangeMin, setYearRangeMin] = useState(2019);
  const [yearRangeMax, setYearRangeMax] = useState(2023);
  const [targetMaxBudget, setTargetMaxBudget] = useState(180000);
  const [purpose, setPurpose] = useState<'personal_ownership' | 'resale_flip_webuycars'>('personal_ownership');
  const [notes, setNotes] = useState('');

  if (!isRequestModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !preferredModel) return;

    const newReq: ClientVehicleRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      clientName,
      clientPhone,
      clientEmail: clientEmail || `${clientName.toLowerCase().replace(/\s+/g, '.')}@client.co.za`,
      preferredMake,
      preferredModel,
      yearRangeMin,
      yearRangeMax,
      targetMaxBudget,
      purpose,
      notes,
      dateCreated: new Date().toISOString().split('T')[0],
      status: 'searching',
    };

    addClientRequest(newReq);
    setIsRequestModalOpen(false);

    // Reset
    setClientName('');
    setClientPhone('');
    setPreferredModel('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-start sm:items-center justify-center p-2.5 sm:p-4 pb-20 sm:pb-4 overscroll-contain">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-xl shadow-2xl text-slate-100 flex flex-col max-h-[calc(100dvh-2.5rem)] sm:max-h-[90vh] my-auto overflow-hidden animate-in zoom-in-95">
        
        {/* Pinned Sticky Header */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">Log Vehicle Sourcing Request</h2>
              <p className="text-[11px] text-slate-400 hidden xs:block">
                Specify your desired car; workshop team sources matching salvage on Auction Nation.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRequestModalOpen(false)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Element wrapping scrollable content and pinned footer */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          
          {/* Scrollable Form Body: Starts at top and scrolls cleanly all the way down */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4 text-xs">
            
            {/* Section 1: Client Contact Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Client Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Full Name *</label>
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
                  <label className="text-slate-400 block mb-1">WhatsApp / Phone *</label>
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
                  <label className="text-slate-400 block mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="client@mail.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Desired Vehicle Specifications */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" /> Desired Vehicle Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Manufacturer Make</label>
                  <select
                    value={preferredMake}
                    onChange={(e) => setPreferredMake(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Volkswagen">Volkswagen</option>
                    <option value="Toyota">Toyota</option>
                    <option value="BMW">BMW</option>
                    <option value="Ford">Ford</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Suzuki">Suzuki</option>
                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                    <option value="Renault">Renault</option>
                    <option value="Nissan">Nissan</option>
                    <option value="Kia">Kia</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Model & Spec *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Polo Vivo 1.4 or Hilux 2.8 GD-6"
                    value={preferredModel}
                    onChange={(e) => setPreferredModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="grid grid-cols-2 gap-2 sm:col-span-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Min Year</label>
                    <input
                      type="number"
                      value={yearRangeMin}
                      onChange={(e) => setYearRangeMin(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-center focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Max Year</label>
                    <input
                      type="number"
                      value={yearRangeMax}
                      onChange={(e) => setYearRangeMax(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-center focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Max Total Budget (ZAR)</label>
                  <input
                    type="number"
                    step="5000"
                    value={targetMaxBudget}
                    onChange={(e) => setTargetMaxBudget(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-amber-400 font-bold focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Project Intent */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Project Intent
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition-all ${
                    purpose === 'personal_ownership'
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="purpose_modal"
                      checked={purpose === 'personal_ownership'}
                      onChange={() => setPurpose('personal_ownership')}
                      className="accent-amber-500"
                    />
                    <span className="font-bold text-xs text-white">Personal Ownership</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    High-quality vehicle restored to factory standard to drive permanently at 30%–50% discount.
                  </span>
                </label>

                <label
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col gap-1 transition-all ${
                    purpose === 'resale_flip_webuycars'
                      ? 'bg-cyan-500/10 border-cyan-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="purpose_modal"
                      checked={purpose === 'resale_flip_webuycars'}
                      onChange={() => setPurpose('resale_flip_webuycars')}
                      className="accent-cyan-500"
                    />
                    <span className="font-bold text-xs text-white">Resale Flip to WeBuyCars</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Investor model aiming to restore and immediately cash out with guaranteed WeBuyCars margin.
                  </span>
                </label>
              </div>
            </div>

            {/* Section 4: Additional Notes */}
            <div className="space-y-1.5 pt-3 border-t border-slate-800 pb-2">
              <label className="text-slate-400 block font-medium">Additional Notes / Damage Tolerance</label>
              <textarea
                rows={2}
                placeholder="e.g. Minor cosmetic bolt-on damage only; prefer automatic transmission if available."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Pinned Sticky Footer with Action Buttons: ALWAYS visible and NEVER covered by bottom mobile navigation */}
          <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-slate-800 bg-slate-950/95 flex items-center justify-end gap-3 shrink-0 shadow-lg">
            <button
              type="button"
              onClick={() => setIsRequestModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Sourcing Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
