import { Metadata } from 'next';
import { PricingContent } from '@/components/pages/PricingContent';
import { pageMetadata, pricingFaqSchema } from '@/lib/seo.config';

export const metadata: Metadata = {
  title: pageMetadata.pricing.title,
  description: pageMetadata.pricing.description,
  alternates: {
    canonical: pageMetadata.pricing.canonical,
  },
  openGraph: {
    title: pageMetadata.pricing.title,
    description: pageMetadata.pricing.description,
    url: pageMetadata.pricing.canonical,
    type: 'website',
  },
  twitter: {
    title: pageMetadata.pricing.title,
    description: pageMetadata.pricing.description,
  },
};

export default function PricingPage() {
  return (
    <>
      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingFaqSchema) }}
      />
      <PricingContent />
    </>
  );
}
