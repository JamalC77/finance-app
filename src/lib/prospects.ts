import fs from 'fs';
import path from 'path';

const prospectsDirectory = path.join(process.cwd(), 'content/prospects');

// Types for prospect data
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
  summary?: string;
  opener: string;
  question: string;
  options: string[];
}

export interface BotContext {
  systemPromptAdditions: string;
  knownFacts: string[];
}

export interface CTAConfig {
  headline: string;
  subhead: string;
  buttonText: string;
  calendarLink: string;
}

export interface Prospect {
  slug: string;
  companyName: string;
  ownerName: string;
  location?: string;
  industry?: string;
  estimatedRevenue?: string;
  employeeCount?: number;
  intelCards: IntelCard[];
  painPoints: PainPoint[];
  botContext: BotContext;
  cta: CTAConfig;
}

// Public prospect data (excludes sensitive bot context)
export interface ProspectPublic {
  slug: string;
  companyName: string;
  ownerName: string;
  location?: string;
  industry?: string;
  estimatedRevenue?: string;
  employeeCount?: number;
  intelCards: IntelCard[];
  painPoints: Omit<PainPoint, 'opener'>[];
  cta: CTAConfig;
}

export function getAllProspectSlugs(): string[] {
  if (!fs.existsSync(prospectsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(prospectsDirectory);
  return files
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace(/\.json$/, ''));
}

export function getProspectBySlug(slug: string): Prospect | null {
  const filePath = path.join(prospectsDirectory, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return data as Prospect;
  } catch (error) {
    console.error(`Error reading prospect file ${slug}:`, error);
    return null;
  }
}

// Get prospect data safe for public consumption (no bot context details)
export function getProspectPublicData(slug: string): ProspectPublic | null {
  const prospect = getProspectBySlug(slug);
  if (!prospect) return null;

  // Strip sensitive bot context and opener text (those are for the AI only)
  return {
    slug: prospect.slug,
    companyName: prospect.companyName,
    ownerName: prospect.ownerName,
    location: prospect.location,
    industry: prospect.industry,
    estimatedRevenue: prospect.estimatedRevenue,
    employeeCount: prospect.employeeCount,
    intelCards: prospect.intelCards,
    painPoints: prospect.painPoints.map(({ opener, ...rest }) => rest),
    cta: prospect.cta,
  };
}

export function getAllProspects(): Prospect[] {
  const slugs = getAllProspectSlugs();
  return slugs
    .map((slug) => getProspectBySlug(slug))
    .filter((prospect): prospect is Prospect => prospect !== null);
}
