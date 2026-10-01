import { FinancialBreakdown, ProjectStage, TransitStatus, FeasibilityVerdict } from '../types';

export const formatZAR = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(amount).replace('ZAR', 'R');
};

export const calculateAcquisitionCost = (fin: FinancialBreakdown): number => {
  const bid = fin.auctionActualBid ?? fin.auctionEstimatedBid;
  const buyerFee = bid * (fin.auctionBuyerFeePercentage / 100);
  return bid + buyerFee + fin.auctionAdminNatisFee + fin.towingTransitCost;
};

export const calculateRepairCost = (fin: FinancialBreakdown): number => {
  const panelLabor = fin.panelBeatingLaborHours * fin.panelBeatingHourlyRate;
  const paintCost = fin.sprayPaintPanelsCount * fin.sprayPaintCostPerPanel;
  return (
    panelLabor +
    paintCost +
    fin.partsTotalEstimate +
    fin.mechanicalAndAlignmentFee +
    fin.roadworthyAndCOFFee +
    fin.contingencyBuffer
  );
};

export const calculateTotalInvestment = (fin: FinancialBreakdown): number => {
  return calculateAcquisitionCost(fin) + calculateRepairCost(fin);
};

export const calculateSavings = (fin: FinancialBreakdown): { amount: number; percentage: number } => {
  const total = calculateTotalInvestment(fin);
  const savings = fin.estimatedMarketRetailValue - total;
  const percentage = fin.estimatedMarketRetailValue > 0 ? (savings / fin.estimatedMarketRetailValue) * 100 : 0;
  return { amount: savings, percentage: Math.max(0, Math.round(percentage)) };
};

export const calculateWeBuyCarsProfit = (fin: FinancialBreakdown): { profit: number; marginPct: number } => {
  const total = calculateTotalInvestment(fin);
  const profit = fin.weBuyCarsInstantValuation - total;
  const marginPct = total > 0 ? (profit / total) * 100 : 0;
  return { profit, marginPct: Math.round(marginPct * 10) / 10 };
};

export const evaluateFeasibility = (fin: FinancialBreakdown): { verdict: FeasibilityVerdict; label: string; explanation: string } => {
  const { amount: savings, percentage: savingsPct } = calculateSavings(fin);
  const { profit: wbcProfit } = calculateWeBuyCarsProfit(fin);

  if (savingsPct >= 28 || wbcProfit >= 35000) {
    return {
      verdict: 'exceptional_margin',
      label: 'High Profit / Exceptional Savings',
      explanation: `Client saves ${savingsPct}% (${formatZAR(savings)}) vs retail, or secure +${formatZAR(wbcProfit)} instant flip profit. Strong buy!`,
    };
  } else if (savingsPct >= 18 || wbcProfit >= 18000) {
    return {
      verdict: 'good_savings',
      label: 'Solid Value & Safe Margin',
      explanation: `Client saves ${savingsPct}% (${formatZAR(savings)}) below dealer retail value. Safe restoration project.`,
    };
  } else if (savingsPct >= 10 || wbcProfit > 5000) {
    return {
      verdict: 'moderate',
      label: 'Moderate Savings / Tight Buffer',
      explanation: `Savings of ${savingsPct}% (${formatZAR(savings)}). Keep strict control on parts and paint labor.`,
    };
  } else {
    return {
      verdict: 'high_risk',
      label: 'High Risk / Low Feasibility',
      explanation: 'Repair costs or bid price are too high relative to retail and WeBuyCars values. Not recommended.',
    };
  }
};

export const STAGES_LIST: { id: ProjectStage; label: string; stepNumber: number; description: string }[] = [
  { id: 'sourcing', label: 'Vehicle Sourcing', stepNumber: 1, description: 'Client wishlist matching at Auction Nation' },
  { id: 'quoted', label: 'Feasibility Quoted', stepNumber: 2, description: 'Pre-purchase repair cost & profit check approved' },
  { id: 'auction_won', label: 'Auction Nation Won', stepNumber: 3, description: 'Vehicle secured on Auction platform, payment processed' },
  { id: 'in_transit', label: 'Transit & Delivery', stepNumber: 4, description: 'Flatbed recovery from Auction yard to workshop' },
  { id: 'stripping', label: 'Disassembly & Jig', stepNumber: 5, description: 'Body panels stripped, internal chassis scan' },
  { id: 'panel_beating', label: 'Panel Beating', stepNumber: 6, description: 'Metal work, chassis straightening, panel fitting' },
  { id: 'spray_booth', label: 'Spray Booth & Bake', stepNumber: 7, description: 'Primer, color coat, and high-temp oven bake' },
  { id: 'mechanical_assembly', label: 'Mechanical & Electrics', stepNumber: 8, description: 'Airbags, lights, suspension alignment, diagnostics' },
  { id: 'roadworthy_detailing', label: 'Roadworthy & Detail', stepNumber: 9, description: 'DEKRA/COF roadworthy inspection and showroom polish' },
  { id: 'completed', label: 'Delivered / Sold', stepNumber: 10, description: 'Handed over to happy client or WeBuyCars settlement' },
];

export const getStageIndex = (stage: ProjectStage): number => {
  return STAGES_LIST.findIndex((s) => s.id === stage);
};

export const getStageDetails = (stage: ProjectStage) => {
  return STAGES_LIST.find((s) => s.id === stage) || STAGES_LIST[0];
};

export const TRANSIT_STEPS: { id: TransitStatus; label: string; icon: string }[] = [
  { id: 'pending_payment', label: 'Pending Auction Release', icon: 'Clock' },
  { id: 'release_authorized', label: 'Release Document Ready', icon: 'FileCheck' },
  { id: 'flatbed_dispatched', label: 'Flatbed Dispatched', icon: 'Truck' },
  { id: 'loaded_at_yard', label: 'Loaded at Yard', icon: 'Box' },
  { id: 'in_transit', label: 'In Transit on Route', icon: 'Navigation' },
  { id: 'arrived_at_workshop', label: 'Delivered to Workshop Bay', icon: 'CheckCircle2' },
];

export const getTransitStatusTitle = (status: TransitStatus): string => {
  const match = TRANSIT_STEPS.find((s) => s.id === status);
  return match ? match.label : status.replace(/_/g, ' ');
};

export const generateWhatsAppLink = (phone: string, text: string): string => {
  // Clean phone number: remove spaces, dashes, parentheses
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '27' + cleanPhone.substring(1);
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};
