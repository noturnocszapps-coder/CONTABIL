export type PlanTier = 'FREE' | 'PRO' | 'CONTADOR';

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: PlanTier;
  name: string;
  priceMonthly: string;
  description: string;
  popular?: boolean;
  features: PlanFeature[];
  ctaText: string;
}

export interface PlanPermissions {
  maxCompanies: number;
  unlimitedReports: boolean;
  aiAdvisorAccess: boolean;
  pdfExport: boolean;
  multiUserPortfolio: boolean;
  whiteLabel: boolean;
}
