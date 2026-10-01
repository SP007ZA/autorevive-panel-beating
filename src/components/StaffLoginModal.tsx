import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, X, Wrench, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export const StaffLoginModal: React.FC = () => {
  const { isStaffLoginOpen, setIsStaffLoginOpen, loginStaff } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isStaffLoginOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginStaff(pin || '1234');
    if (!success) {
      setError('Invalid workshop passcode.');
    } else {
      setError('');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl text-slate-100 p-6 sm:p-8 space-y-6 relative animate-in zoom-in-95">
        <button
          onClick={() => setIsStaffLoginOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
              Authorized Personnel Only
            </span>
            <h2 className="text-xl font-black text-white">Workshop Staff Portal</h2>
            <p className="text-xs text-slate-400 mt-1">
              Restricted area for panel beating foreman, technicians, and auction purchasing management.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Staff Passcode / PIN
            </label>
            <input
              type="password"
              autoFocus
              placeholder="Enter PIN (Default: 1234)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-amber-300 placeholder-slate-600 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/30 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black py-3 rounded-xl text-xs shadow-md active:scale-95 transition-all"
          >
            Authenticate & Open Management Dashboard
          </button>

          <button
            type="button"
            onClick={() => loginStaff('1234')}
            className="w-full text-center text-[11px] text-amber-400/80 hover:text-amber-300 hover:underline pt-1"
          >
            Quick 1-Click Workshop Login (Demo PIN: 1234)
          </button>
        </form>
      </div>
    </div>
  );
};
