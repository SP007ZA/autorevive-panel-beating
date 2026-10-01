import React from 'react';
import { useApp, AppView } from '../context/AppContext';
import { 
  Wrench, 
  UserCheck, 
  Calculator, 
  ClipboardList, 
  Smartphone, 
  PlusCircle, 
  RotateCcw,
  CarFront,
  MessageSquareShare,
  Home,
  Lock,
  LogOut,
  Shield,
  Eye
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    setIsCalculatorOpen, 
    setCalculatorPreloadProject,
    setIsRequestModalOpen,
    clientRequests,
    projects,
    resetToDemoData,
    openWhatsAppModal,
    userRole,
    setUserRole,
    setIsStaffLoginOpen,
    logoutStaff
  } = useApp();

  const handleOpenNewCalculator = () => {
    setCalculatorPreloadProject(null);
    setIsCalculatorOpen(true);
  };

  const handleOpenQuickWhatsApp = () => {
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

  // 1. Client Facing Nav Items: STRICTLY Customer Home, Sourcing Request, Track My Car
  const clientNavItems: { id: AppView; label: string; icon: React.ReactNode; isModal?: boolean }[] = [
    { id: 'home', label: 'Customer Home', icon: <Home className="w-4 h-4" /> },
    { id: 'requests', label: 'Sourcing Request', icon: <ClipboardList className="w-4 h-4" />, isModal: true },
    { id: 'client_portal', label: 'Track My Car', icon: <Smartphone className="w-4 h-4" /> },
  ];

  // 2. Staff Management Nav Items
  const staffNavItems: { id: AppView; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'workshop', label: 'Workshop Manager', icon: <Wrench className="w-4 h-4" />, badge: projects.length },
    { id: 'technician', label: 'Technician Floor', icon: <CarFront className="w-4 h-4" /> },
    { id: 'requests', label: 'Sourcing Queue', icon: <ClipboardList className="w-4 h-4" />, badge: clientRequests.filter(r => r.status === 'searching').length },
    { id: 'home', label: 'Preview Client View', icon: <Eye className="w-4 h-4" /> },
  ];

  const activeNavItems = userRole === 'staff' ? staffNavItems : clientNavItems;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-black text-xl">
              <Wrench className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-white bg-clip-text text-transparent">
                  AutoRevive
                </span>
                {userRole === 'staff' ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Workshop Staff Mode
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    Panel & Salvage Hub
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Auction Nation Sourcing • Repair Tracking • WeBuyCars Resale
              </p>
            </div>
          </div>

          {/* View Switcher: Distinct for Client vs Staff */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            {activeNavItems.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if ('isModal' in item && item.isModal) {
                      setIsRequestModalOpen(true);
                    } else {
                      setCurrentView(item.id);
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                    active
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {'badge' in item && item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        active ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-amber-400 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions (Role-Specific) */}
          <div className="flex items-center gap-2">
            {userRole === 'staff' ? (
              // Staff-only tools
              <>
                <button
                  onClick={handleOpenNewCalculator}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-md transition-all active:scale-95"
                  title="Pre-purchase repair quote & profit margin calculator"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Profit Calculator</span>
                </button>

                <button
                  onClick={handleOpenQuickWhatsApp}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs shadow-md transition-all active:scale-95"
                  title="Open WhatsApp Communication Hub"
                >
                  <MessageSquareShare className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">WhatsApp Hub</span>
                </button>

                <button
                  onClick={resetToDemoData}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Reset Demo Data"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={logoutStaff}
                  className="flex items-center gap-1 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                  title="Exit Staff Management Mode"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Exit Staff</span>
                </button>
              </>
            ) : (
              // Client-only tools
              <>
                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-md transition-all active:scale-95"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Sourcing Request</span>
                </button>

                <button
                  onClick={handleOpenQuickWhatsApp}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1.5 rounded-lg text-xs shadow-md transition-all active:scale-95"
                  title="Chat With AutoRevive on WhatsApp"
                >
                  <MessageSquareShare className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">WhatsApp Us</span>
                </button>

                {/* Discrete Staff Login Portal Link */}
                <button
                  onClick={() => setIsStaffLoginOpen(true)}
                  className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700/80 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  title="Staff Portal (Restricted to workshop staff)"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Staff Login</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Submenu */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-slate-800/80 gap-1.5 no-scrollbar">
          {activeNavItems.map((item) => {
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if ('isModal' in item && item.isModal) {
                    setIsRequestModalOpen(true);
                  } else {
                    setCurrentView(item.id);
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                  active ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
