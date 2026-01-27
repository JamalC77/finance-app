// Types for prospect components

export interface IntelCard {
  id: string;
  icon: string;
  title: string;
  content: string;
  alert?: boolean;
}

export interface PainPoint {
  id: string;
  title: string;
  question: string;
  options: string[];
}

export interface CTAConfig {
  headline: string;
  subhead: string;
  buttonText: string;
  calendarLink: string;
}

export interface ProspectPublic {
  slug: string;
  companyName: string;
  ownerName: string;
  location?: string;
  industry?: string;
  estimatedRevenue?: string;
  employeeCount?: number;
  intelCards: IntelCard[];
  painPoints: PainPoint[];
  cta: CTAConfig;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
