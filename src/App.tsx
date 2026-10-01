import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { WorkshopManagerView } from './components/WorkshopManagerView';
import { TechnicianFloorView } from './components/TechnicianFloorView';
import { ClientPortalView } from './components/ClientPortalView';
import { CustomerHomeView } from './components/CustomerHomeView';
import { ProfitabilityCalculatorModal } from './components/ProfitabilityCalculatorModal';
import { ClientRequestModal } from './components/ClientRequestModal';
import { JobCardModal } from './components/JobCardModal';
import { TransitTrackerModal } from './components/TransitTrackerModal';
import { WhatsAppMessengerModal } from './components/WhatsAppMessengerModal';
import { PhotoEvidenceViewerModal } from './components/PhotoEvidenceViewerModal';
import { StaffLoginModal } from './components/StaffLoginModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MessageSquare, Wrench, ShieldCheck, HelpCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, openWhatsAppModal, projects } = useApp();

  const handleFloatingWhatsApp = () => {
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area with mobile bottom padding */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8">
        {currentView === 'home' && <CustomerHomeView />}
        {currentView === 'workshop' && <WorkshopManagerView />}
        {currentView === 'technician' && <TechnicianFloorView />}
        {currentView === 'client_portal' && <ClientPortalView />}
        {currentView === 'requests' && <WorkshopManagerView />}
      </main>

      {/* Modals */}
      <ProfitabilityCalculatorModal />
      <ClientRequestModal />
      <JobCardModal />
      <TransitTrackerModal />
      <WhatsAppMessengerModal />
      <PhotoEvidenceViewerModal />
      <StaffLoginModal />

      {/* Persistent Floating WhatsApp Action Button */}
      <button
        onClick={handleFloatingWhatsApp}
        className="fixed bottom-20 md:bottom-5 right-4 sm:right-5 z-40 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl shadow-emerald-950/60 border border-emerald-400/40 active:scale-95 transition-all group"
        title="WhatsApp AutoRevive Workshop Hub"
      >
        <MessageSquare className="w-5 h-5 fill-current text-white" />
        <span className="hidden sm:inline text-xs font-extrabold tracking-wide">
          WhatsApp Workshop Hub
        </span>
      </button>

      {/* Mobile App Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-slate-500 text-xs hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">AutoRevive Intelligence</span>
            <span>•</span>
            <span>Auction Nation Sourcing & Panel Beating Operations</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>WeBuyCars Verified Liquidity Partner</span>
            <span>•</span>
            <span>Ready for Keystone-JS GraphQL Backend Integration</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
