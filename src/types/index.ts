export type ProjectStage = 
  | 'sourcing'
  | 'quoted'
  | 'auction_won'
  | 'in_transit'
  | 'stripping'
  | 'panel_beating'
  | 'spray_booth'
  | 'mechanical_assembly'
  | 'roadworthy_detailing'
  | 'completed';

export type TransitStatus = 
  | 'pending_payment'
  | 'release_authorized'
  | 'flatbed_dispatched'
  | 'loaded_at_yard'
  | 'in_transit'
  | 'arrived_at_workshop';

export type FeasibilityVerdict = 'exceptional_margin' | 'good_savings' | 'moderate' | 'high_risk';

export interface RepairPart {
  id: string;
  name: string;
  category: 'body_panel' | 'lighting' | 'mechanical' | 'airbag_interior' | 'paint_consumables';
  source: 'OEM New' | 'Quality Aftermarket' | 'Salvage Tested';
  estimatedCost: number;
  actualCost?: number;
  status: 'needed' | 'ordered' | 'received' | 'fitted';
  partNumber?: string;
}

export interface TechnicianLog {
  id: string;
  timestamp: string;
  technicianName: string;
  technicianRole: 'Master Panel Beater' | 'Chassis Jig Specialist' | 'Spray Painter' | 'Auto Electrician' | 'Workshop Foreman';
  stage: ProjectStage;
  actionSummary: string;
  hoursSpent: number;
  partsFitted?: string[];
  qualityPassed: boolean;
  notes: string;
  photoUrl?: string;
  isClientVisible?: boolean; // Management controls whether client sees this internal log
}

export interface PhotoEvidence {
  id: string;
  timestamp: string;
  stage: ProjectStage;
  title: string;
  description: string;
  imageUrl: string;
  photographer: string;
  tag: 'Auction Yard Initial' | 'Stripped / Chassis Check' | 'Panel Beating & Jig' | 'Primer & Oven Paint' | 'Assembly & Polish' | 'Final Showroom';
  isHighlighted?: boolean;
  isClientVisible?: boolean; // Management controls whether client sees this photo
}

export interface FinancialBreakdown {
  // Pre-purchase & Acquisition
  auctionEstimatedBid: number; // ZAR
  auctionActualBid?: number;
  auctionBuyerFeePercentage: number; // typically 8-10%
  auctionAdminNatisFee: number; // ZAR (e.g. R2,500)
  towingTransitCost: number; // ZAR (Auction Nation yard to workshop)
  
  // Workshop Panel Beating & Refurbishment
  panelBeatingLaborHours: number;
  panelBeatingHourlyRate: number; // ZAR/hr
  sprayPaintPanelsCount: number;
  sprayPaintCostPerPanel: number; // ZAR per panel including prep & bake
  partsTotalEstimate: number;
  mechanicalAndAlignmentFee: number;
  roadworthyAndCOFFee: number;
  contingencyBuffer: number; // buffer 5-10%
  
  // Market Comparison & Resale
  estimatedMarketRetailValue: number; // AutoTrader / TransUnion Book Value
  weBuyCarsInstantValuation: number; // Instant cash-out buyout value
}

export interface ClientVehicleRequest {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  preferredMake: string;
  preferredModel: string;
  yearRangeMin: number;
  yearRangeMax: number;
  targetMaxBudget: number; // ZAR
  purpose: 'personal_ownership' | 'resale_flip_webuycars';
  notes: string;
  dateCreated: string;
  status: 'searching' | 'matched_at_auction' | 'converted_to_project' | 'closed';
  matchedLotId?: string;
}

export interface VehicleProject {
  id: string;
  trackingRef: string; // e.g. AR-7842
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientWhatsApp: string;
  
  // Vehicle Specs
  make: string;
  model: string;
  year: number;
  vin: string;
  mileage: number;
  engine: string;
  transmission: 'Automatic' | 'Manual';
  colour: string;
  
  // Auction Details
  auctionSource: string; // 'Auction Nation JHB Central', 'AuctionNation PE', etc.
  auctionLotNumber: string;
  registrationCode?: 'CODE 2' | 'CODE 3' | 'CODE 4'; // CODE 2 = Used Motor Vehicle (Clean Title), CODE 3 = Built-up Salvage
  hasKeys?: boolean;
  hasSpareWheel?: boolean;
  hasBattery?: boolean;
  odometerReading?: string; // e.g. "unknown" or "64,200 km"
  damageDescription: string;
  damageSeverity: 'Light Cosmetic' | 'Medium Frontal' | 'Heavy Structural / Chassis' | 'Side Impact';
  runAndDriveStatus: 'Starts & Moves' | 'Turns Over Only' | 'Non-Runner';
  primaryPhoto: string;
  
  // Stage & Workflow
  stage: ProjectStage;
  transitStatus: TransitStatus;
  transitDriverName?: string;
  transitDriverPhone?: string;
  transitFlatbedReg?: string;
  estimatedTransitArrival?: string;
  transitNotes?: string;
  
  // Financials & Profit Calculator
  financials: FinancialBreakdown;
  parts: RepairPart[];
  technicianLogs: TechnicianLog[];
  photoEvidence: PhotoEvidence[];
  
  // Timestamps & Client Publishing
  createdAt: string;
  updatedAt: string;
  estimatedCompletionDate: string;
  actualCompletionDate?: string;
  lastPublishedToClientAt?: string; // e.g. "2026-10-01 11:30"
  clientAccessPin?: string; // Private PIN for client verification
  
  // WhatsApp notification history
  lastWhatsAppAlertSent?: string;
  clientNotes?: string;
}
