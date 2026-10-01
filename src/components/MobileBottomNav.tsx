import React from 'react';
import { useApp, AppView } from '../context/AppContext';
import { 
  Wrench, 
  CarFront, 
  Smartphone, 
  ClipboardList, 
  MessageSquareShare, 
  Calculator,
  Plus,
  Home,
  Lock,
  Eye
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    projects, 
    clientRequests, 
    openWhatsAppModal,
    setIsCalculatorOpen,
    setIsRequestModalOpen,
    userRole,
    setIsStaffLoginOpen
  } = useApp();

  const handleOpenWhatsApp = () => {
    const firstProj = projects[0];
    if (firstProj) {
      openWhatsAppModal({
        phone: firstProj.clientWhatsApp,
        name: firstProj.clientName,
        vehicleDesc: `${firstProj.year} ${firstProj.make} ${firstProj.model}`,
        projectRef: firstProj.trackingRef,
        templateType: 'stage_photo',
      });
    }
  };

  // Client view: Home, Sourcing Request, Track Car, Staff Login, WhatsApp
  if (userRole === 'client') {
    return (
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] pb-safe">
        <div className="grid grid-cols-5 items-center h-16 px-1">
          {/* 1. Home */}
          <button
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center justify-center h-full relative transition-colors ${
              currentView === 'home' ? 'text-amber-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-semibold leading-none">Home</span>
            {currentView === 'home' && (
              <div className="w-8 h-1 bg-amber-400 rounded-full absolute bottom-1" />
            )}
          </button>

          {/* 2. Sourcing Request */}
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="flex flex-col items-center justify-center h-full text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ClipboardList className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] mt-1 font-semibold leading-none">Request</span>
          </button>

          {/* 3. Track My Car */}
          <button
            onClick={() => setCurrentView('client_portal')}
            className={`flex flex-col items-center justify-center h-full relative transition-colors ${
              currentView === 'client_portal' ? 'text-amber-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-semibold leading-none">Track Car</span>
            {currentView === 'client_portal' && (
              <div className="w-8 h-1 bg-amber-400 rounded-full absolute bottom-1" />
            )}
          </button>

          {/* 4. Staff Login */}
          <button
            onClick={() => setIsStaffLoginOpen(true)}
            className="flex flex-col items-center justify-center h-full text-slate-500 hover:text-amber-400 transition-colors"
          >
            <Lock className="w-4 h-4" />
            <span className="text-[10px] mt-1 font-medium leading-none">Staff</span>
          </button>

          {/* 5. WhatsApp Hub */}
          <button
            onClick={handleOpenWhatsApp}
            className="flex flex-col items-center justify-center h-full text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-900/50 active:scale-95 transition-transform">
              <MessageSquareShare className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5 font-bold text-emerald-400 leading-none">Chat</span>
          </button>
        </div>
      </div>
    );
  }

  // Staff View: Workshop, Tech Floor, Calculator, Client View, WhatsApp
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] pb-safe">
      <div className="grid grid-cols-5 items-center h-16 px-1">
        <button
          onClick={() => setCurrentView('workshop')}
          className={`flex flex-col items-center justify-center h-full relative transition-colors ${
            currentView === 'workshop' ? 'text-amber-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Wrench className="w-5 h-5" />
            {projects.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {projects.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-semibold leading-none">Workshop</span>
          {currentView === 'workshop' && (
            <div className="w-8 h-1 bg-amber-400 rounded-full absolute bottom-1" />
          )}
        </button>

        <button
          onClick={() => setCurrentView('technician')}
          className={`flex flex-col items-center justify-center h-full relative transition-colors ${
            currentView === 'technician' ? 'text-amber-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CarFront className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-semibold leading-none">Floor</span>
          {currentView === 'technician' && (
            <div className="w-8 h-1 bg-amber-400 rounded-full absolute bottom-1" />
          )}
        </button>

        <button
          onClick={() => setIsCalculatorOpen(true)}
          className="flex flex-col items-center justify-center h-full text-slate-400 hover:text-amber-400 transition-colors"
        >
          <Calculator className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] mt-1 font-semibold leading-none">Calculator</span>
        </button>

        <button
          onClick={() => setCurrentView('home')}
          className="flex flex-col items-center justify-center h-full text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Eye className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-semibold leading-none">Client View</span>
        </button>

        <button
          onClick={handleOpenWhatsApp}
          className="flex flex-col items-center justify-center h-full text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-900/50 active:scale-95 transition-transform">
            <MessageSquareShare className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold text-emerald-400 leading-none">WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
