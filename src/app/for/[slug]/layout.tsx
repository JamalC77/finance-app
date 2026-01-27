import { Metadata } from 'next';
import { getProspectBySlug, getAllProspectSlugs } from '@/lib/prospects';
import { siteConfig } from '@/lib/seo.config';

interface ProspectLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllProspectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProspectLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const prospect = getProspectBySlug(slug);

  if (!prospect) {
    return {
      title: 'Not Found | CFO Line',
    };
  }

  return {
    title: `${prospect.companyName} | CFO Line`,
    description: `Financial insights prepared for ${prospect.ownerName} at ${prospect.companyName}`,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `Prepared for ${prospect.companyName}`,
      description: `Financial insights prepared for ${prospect.ownerName}`,
      url: `${siteConfig.url}/for/${slug}`,
      type: 'website',
    },
  };
}

export default function ProspectLayout({ children }: ProspectLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
