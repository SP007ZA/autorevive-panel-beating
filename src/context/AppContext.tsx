import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  VehicleProject, 
  ClientVehicleRequest, 
  ProjectStage, 
  TransitStatus, 
  TechnicianLog, 
  PhotoEvidence 
} from '../types';
import { INITIAL_PROJECTS, INITIAL_CLIENT_REQUESTS } from '../data/initialData';

export type AppView = 'home' | 'workshop' | 'technician' | 'client_portal' | 'calculator' | 'requests';

interface WhatsAppModalData {
  phone: string;
  name: string;
  vehicleDesc: string;
  projectRef: string;
  templateType: 'quote' | 'transit' | 'stage_photo' | 'completion' | 'webuycars';
  customMessage?: string;
}

interface AppContextType {
  projects: VehicleProject[];
  clientRequests: ClientVehicleRequest[];
  activeProjectId: string | null;
  activeProject: VehicleProject | undefined;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  setActiveProjectId: (id: string | null) => void;
  clientTrackingCode: string;
  setClientTrackingCode: (code: string) => void;
  
  // Project operations
  addProject: (project: VehicleProject) => void;
  updateProject: (id: string, updates: Partial<VehicleProject>) => void;
  deleteProject: (id: string) => void;
  updateStage: (projectId: string, stage: ProjectStage) => void;
  updateTransitStatus: (projectId: string, status: TransitStatus, notes?: string) => void;
  addTechnicianLog: (projectId: string, log: Omit<TechnicianLog, 'id' | 'timestamp'>) => void;
  addPhotoEvidence: (projectId: string, photo: Omit<PhotoEvidence, 'id' | 'timestamp'>) => void;
  togglePhotoClientVisibility: (projectId: string, photoId: string) => void;
  toggleLogClientVisibility: (projectId: string, logId: string) => void;
  publishUpdatesToClient: (projectId: string) => void;

  // Client Session / Security Isolation
  clientVerifiedPin: string | null;
  verifyClientPin: (pin: string) => boolean;
  logoutClient: () => void;

  // Role & Staff Authentication
  userRole: 'client' | 'staff';
  setUserRole: (role: 'client' | 'staff') => void;
  isStaffLoginOpen: boolean;
  setIsStaffLoginOpen: (open: boolean) => void;
  loginStaff: (pin: string) => boolean;
  logoutStaff: () => void;
  
  // Client Request operations
  addClientRequest: (req: ClientVehicleRequest) => void;
  updateClientRequest: (id: string, updates: Partial<ClientVehicleRequest>) => void;
  convertRequestToProject: (requestId: string, initialProjectData?: Partial<VehicleProject>) => void;

  // Modals
  isCalculatorOpen: boolean;
  setIsCalculatorOpen: (open: boolean) => void;
  calculatorPreloadProject: VehicleProject | null;
  setCalculatorPreloadProject: (p: VehicleProject | null) => void;
  
  isRequestModalOpen: boolean;
  setIsRequestModalOpen: (open: boolean) => void;
  
  isJobCardOpen: boolean;
  setIsJobCardOpen: (open: boolean) => void;
  
  isTransitModalOpen: boolean;
  setIsTransitModalOpen: (open: boolean) => void;
  
  isWhatsAppModalOpen: boolean;
  setIsWhatsAppModalOpen: (open: boolean) => void;
  whatsAppData: WhatsAppModalData | null;
  openWhatsAppModal: (data: WhatsAppModalData) => void;
  
  isPhotoViewerOpen: boolean;
  selectedPhoto: PhotoEvidence | null;
  openPhotoViewer: (photo: PhotoEvidence) => void;
  closePhotoViewer: () => void;
  
  // Notification history
  recordWhatsAppSent: (projectId: string, summary: string) => void;
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PROJECTS_KEY = 'autorevive_projects_v2';
const STORAGE_REQUESTS_KEY = 'autorevive_requests_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<VehicleProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROJECTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [clientRequests, setClientRequests] = useState<ClientVehicleRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REQUESTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CLIENT_REQUESTS;
    } catch {
      return INITIAL_CLIENT_REQUESTS;
    }
  });

  const [activeProjectId, setActiveProjectId] = useState<string | null>(INITIAL_PROJECTS[0]?.id || null);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [clientTrackingCode, setClientTrackingCode] = useState<string>('AR-8821');

  // Modals state
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calculatorPreloadProject, setCalculatorPreloadProject] = useState<VehicleProject | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isJobCardOpen, setIsJobCardOpen] = useState(false);
  const [isTransitModalOpen, setIsTransitModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsAppData, setWhatsAppModalData] = useState<WhatsAppModalData | null>(null);
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEvidence | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed saving to localStorage', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(clientRequests));
    } catch (e) {
      console.error('Failed saving requests to localStorage', e);
    }
  }, [clientRequests]);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  const addProject = (project: VehicleProject) => {
    setProjects((prev) => [project, ...prev]);
    setActiveProjectId(project.id);
  };

  const updateProject = (id: string, updates: Partial<VehicleProject>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProjectId === id) {
      setActiveProjectId(projects.find((p) => p.id !== id)?.id || null);
    }
  };

  const updateStage = (projectId: string, stage: ProjectStage) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          stage,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      })
    );
  };

  const updateTransitStatus = (projectId: string, status: TransitStatus, notes?: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          transitStatus: status,
          transitNotes: notes || p.transitNotes,
          updatedAt: new Date().toISOString().split('T')[0],
        };
      })
    );
  };

  const addTechnicianLog = (projectId: string, log: Omit<TechnicianLog, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newLog: TechnicianLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp,
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          technicianLogs: [newLog, ...p.technicianLogs],
          updatedAt: now.toISOString().split('T')[0],
        };
      })
    );
  };

  const addPhotoEvidence = (projectId: string, photo: Omit<PhotoEvidence, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newPhoto: PhotoEvidence = {
      ...photo,
      id: `ph-${Date.now()}`,
      timestamp,
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          photoEvidence: [newPhoto, ...p.photoEvidence],
          updatedAt: now.toISOString().split('T')[0],
        };
      })
    );
  };

  const togglePhotoClientVisibility = (projectId: string, photoId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updated = p.photoEvidence.map((ph) => {
          if (ph.id !== photoId) return ph;
          return { ...ph, isClientVisible: ph.isClientVisible === false ? true : false };
        });
        return { ...p, photoEvidence: updated };
      })
    );
  };

  const toggleLogClientVisibility = (projectId: string, logId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updated = p.technicianLogs.map((log) => {
          if (log.id !== logId) return log;
          return { ...log, isClientVisible: log.isClientVisible === false ? true : false };
        });
        return { ...p, technicianLogs: updated };
      })
    );
  };

  const publishUpdatesToClient = (projectId: string) => {
    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    updateProject(projectId, {
      lastPublishedToClientAt: timestamp,
    });
  };

  const [clientVerifiedPin, setClientVerifiedPin] = useState<string | null>('AR-PE07');

  const verifyClientPin = (pin: string): boolean => {
    const trimmed = pin.trim().toUpperCase();
    const match = projects.find(
      (p) => p.trackingRef.toUpperCase() === trimmed || p.vin.toUpperCase().endsWith(trimmed)
    );
    if (match) {
      setClientVerifiedPin(match.trackingRef);
      setClientTrackingCode(match.trackingRef);
      return true;
    }
    return false;
  };

  const logoutClient = () => {
    setClientVerifiedPin(null);
  };

  const [userRole, setUserRole] = useState<'client' | 'staff'>('client');
  const [isStaffLoginOpen, setIsStaffLoginOpen] = useState(false);

  const loginStaff = (pin: string): boolean => {
    if (pin.trim() === '1234' || pin.trim().toLowerCase() === 'admin' || pin.trim().length > 0) {
      setUserRole('staff');
      setCurrentView('workshop');
      setIsStaffLoginOpen(false);
      return true;
    }
    return false;
  };

  const logoutStaff = () => {
    setUserRole('client');
    setCurrentView('home');
  };

  const addClientRequest = (req: ClientVehicleRequest) => {
    setClientRequests((prev) => [req, ...prev]);
  };

  const updateClientRequest = (id: string, updates: Partial<ClientVehicleRequest>) => {
    setClientRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const convertRequestToProject = (requestId: string, initialProjectData?: Partial<VehicleProject>) => {
    const req = clientRequests.find((r) => r.id === requestId);
    if (!req) return;

    const newRef = `AR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newProj: VehicleProject = {
      id: `proj-${Date.now()}`,
      trackingRef: newRef,
      clientName: req.clientName,
      clientPhone: req.clientPhone,
      clientEmail: req.clientEmail,
      clientWhatsApp: req.clientPhone,
      make: req.preferredMake,
      model: req.preferredModel,
      year: req.yearRangeMax || 2022,
      vin: `AAVZZZ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      mileage: 45000,
      engine: '2.0L Petrol',
      transmission: 'Automatic',
      colour: 'Metallic Grey',
      auctionSource: 'Auction Nation Meadowdale Yard',
      auctionLotNumber: req.matchedLotId || `AN-${Math.floor(70000 + Math.random() * 20000)}`,
      damageDescription: 'Salvage match from client sourcing request. Front bumper & fender repair needed.',
      damageSeverity: 'Medium Frontal',
      runAndDriveStatus: 'Starts & Moves',
      primaryPhoto: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80',
      stage: 'quoted',
      transitStatus: 'pending_payment',
      financials: {
        auctionEstimatedBid: Math.round(req.targetMaxBudget * 0.55),
        auctionBuyerFeePercentage: 9,
        auctionAdminNatisFee: 2500,
        towingTransitCost: 2000,
        panelBeatingLaborHours: 18,
        panelBeatingHourlyRate: 480,
        sprayPaintPanelsCount: 3,
        sprayPaintCostPerPanel: 2800,
        partsTotalEstimate: 16000,
        mechanicalAndAlignmentFee: 2200,
        roadworthyAndCOFFee: 1500,
        contingencyBuffer: 4000,
        estimatedMarketRetailValue: Math.round(req.targetMaxBudget * 1.35),
        weBuyCarsInstantValuation: Math.round(req.targetMaxBudget * 1.08),
      },
      parts: [],
      technicianLogs: [],
      photoEvidence: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      estimatedCompletionDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
      clientNotes: `Converted from Sourcing Request #${req.id}. Target budget: R ${req.targetMaxBudget.toLocaleString()}`,
      ...initialProjectData,
    };

    addProject(newProj);
    updateClientRequest(requestId, { status: 'converted_to_project' });
  };

  const openWhatsAppModal = (data: WhatsAppModalData) => {
    setWhatsAppModalData(data);
    setIsWhatsAppModalOpen(true);
  };

  const openPhotoViewer = (photo: PhotoEvidence) => {
    setSelectedPhoto(photo);
    setIsPhotoViewerOpen(true);
  };

  const closePhotoViewer = () => {
    setIsPhotoViewerOpen(false);
    setSelectedPhoto(null);
  };

  const recordWhatsAppSent = (projectId: string, summary: string) => {
    const now = new Date();
    const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    updateProject(projectId, {
      lastWhatsAppAlertSent: `${timestamp} - ${summary}`,
    });
  };

  const resetToDemoData = () => {
    setProjects(INITIAL_PROJECTS);
    setClientRequests(INITIAL_CLIENT_REQUESTS);
    setActiveProjectId(INITIAL_PROJECTS[0]?.id || null);
    localStorage.removeItem(STORAGE_PROJECTS_KEY);
    localStorage.removeItem(STORAGE_REQUESTS_KEY);
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        clientRequests,
        activeProjectId,
        activeProject,
        currentView,
        setCurrentView,
        setActiveProjectId,
        clientTrackingCode,
        setClientTrackingCode,
        addProject,
        updateProject,
        deleteProject,
        updateStage,
        updateTransitStatus,
        addTechnicianLog,
        addPhotoEvidence,
        togglePhotoClientVisibility,
        toggleLogClientVisibility,
        publishUpdatesToClient,
        clientVerifiedPin,
        verifyClientPin,
        logoutClient,
        userRole,
        setUserRole,
        isStaffLoginOpen,
        setIsStaffLoginOpen,
        loginStaff,
        logoutStaff,
        addClientRequest,
        updateClientRequest,
        convertRequestToProject,
        isCalculatorOpen,
        setIsCalculatorOpen,
        calculatorPreloadProject,
        setCalculatorPreloadProject,
        isRequestModalOpen,
        setIsRequestModalOpen,
        isJobCardOpen,
        setIsJobCardOpen,
        isTransitModalOpen,
        setIsTransitModalOpen,
        isWhatsAppModalOpen,
        setIsWhatsAppModalOpen,
        whatsAppData,
        openWhatsAppModal,
        isPhotoViewerOpen,
        selectedPhoto,
        openPhotoViewer,
        closePhotoViewer,
        recordWhatsAppSent,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
