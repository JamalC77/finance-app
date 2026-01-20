import { Metadata } from 'next';
import { AboutContent } from '@/components/pages/AboutContent';
import { pageMetadata } from '@/lib/seo.config';

export const metadata: Metadata = {
  title: pageMetadata.about.title,
  description: pageMetadata.about.description,
  alternates: {
    canonical: pageMetadata.about.canonical,
  },
  openGraph: {
    title: pageMetadata.about.title,
    description: pageMetadata.about.description,
    url: pageMetadata.about.canonical,
    type: 'website',
  },
  twitter: {
    title: pageMetadata.about.title,
    description: pageMetadata.about.description,
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
