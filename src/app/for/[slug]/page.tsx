import { notFound } from 'next/navigation';
import { getProspectPublicData, getAllProspectSlugs } from '@/lib/prospects';
import { ProspectLandingPage } from '@/components/prospect/ProspectLandingPage';

interface ProspectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllProspectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProspectPage({ params }: ProspectPageProps) {
  const { slug } = await params;
  const prospect = getProspectPublicData(slug);

  if (!prospect) {
    notFound();
  }

  return <ProspectLandingPage prospect={prospect} />;
}
