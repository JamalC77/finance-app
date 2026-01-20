// SEO Configuration for CFO Line
// Centralized metadata for consistency across all pages

export const siteConfig = {
  name: 'CFO Line',
  url: 'https://www.thecfoline.com',
  description: 'Transform your QuickBooks data into powerful financial insights. CFO Line provides advanced analytics, cash flow forecasting, and fractional CFO services for growing businesses.',
  shortDescription: 'Financial analytics and fractional CFO services for small businesses',
  keywords: [
    'CFO Line',
    'fractional CFO',
    'fractional CFO services',
    'CFO services for small business',
    'QuickBooks analytics',
    'QuickBooks reporting',
    'financial analytics',
    'cash flow forecasting',
    'small business CFO',
    'financial reporting software',
    'business financial insights',
    'QuickBooks integration',
  ],
  author: 'CFO Line',
  twitterHandle: '@thecfoline',
  locale: 'en_US',
  themeColor: '#000000',
}

// Page-specific metadata
export const pageMetadata = {
  home: {
    title: 'CFO Line | Financial Analytics & Fractional CFO Services',
    description: 'Transform your QuickBooks data into powerful financial insights. CFO Line provides advanced analytics, cash flow forecasting, and fractional CFO services for growing businesses.',
    canonical: 'https://www.thecfoline.com',
  },
  pricing: {
    title: 'Pricing | CFO Line - Affordable Financial Analytics Plans',
    description: 'Transparent pricing for CFO Line financial analytics. Choose from Basic Analytics at $50/month or custom Fractional CFO services. Start your free 14-day trial today.',
    canonical: 'https://www.thecfoline.com/pricing',
  },
  login: {
    title: 'Log In | CFO Line',
    description: 'Log in to your CFO Line account to access your financial dashboard, reports, and analytics.',
    canonical: 'https://www.thecfoline.com/auth/login',
  },
  register: {
    title: 'Sign Up | CFO Line - Start Your Free Trial',
    description: 'Create your free CFO Line account and start transforming your QuickBooks data into actionable financial insights. 14-day free trial included.',
    canonical: 'https://www.thecfoline.com/auth/register',
  },
  terms: {
    title: 'Terms of Service | CFO Line',
    description: 'Read the CFO Line Terms of Service. Learn about the terms and conditions for using our financial analytics platform.',
    canonical: 'https://www.thecfoline.com/terms',
  },
  privacy: {
    title: 'Privacy Policy | CFO Line',
    description: 'CFO Line Privacy Policy. Learn how we collect, use, and protect your personal and financial data.',
    canonical: 'https://www.thecfoline.com/privacy-policy',
  },
  eula: {
    title: 'End User License Agreement | CFO Line',
    description: 'CFO Line End User License Agreement (EULA). Read the software license terms for using CFO Line.',
    canonical: 'https://www.thecfoline.com/eula',
  },
  about: {
    title: 'About Us | CFO Line - Fractional Finance Leadership',
    description: 'Meet the team behind CFO Line. We provide fractional finance leadership for growing businesses, combining strategic expertise with AI-powered workflows.',
    canonical: 'https://www.thecfoline.com/about',
  },
}

// Structured data for Organization
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CFO Line',
  url: 'https://www.thecfoline.com',
  logo: 'https://www.thecfoline.com/logo.png',
  description: siteConfig.description,
  email: 'sales@thecfoline.com',
  sameAs: [],
}

// Structured data for SoftwareApplication (Product)
export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'CFO Line',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'Financial analytics and reporting software that integrates with QuickBooks to provide advanced business insights, cash flow forecasting, and fractional CFO services.',
  offers: {
    '@type': 'Offer',
    price: '50',
    priceCurrency: 'USD',
    priceValidUntil: '2026-12-31',
    availability: 'https://schema.org/InStock',
  },
  featureList: [
    'QuickBooks Integration',
    'Financial Reporting',
    'Cash Flow Forecasting',
    'Business Analytics',
    'Data Visualizations',
  ],
}

// FAQ Schema for pricing page
export const pricingFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I switch between CFO Line plans?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a free trial for CFO Line?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer a 14-day free trial for all new users to explore our Basic Analytics plan features. No credit card required.',
      },
    },
    {
      '@type': 'Question',
      name: "What's included in the Fractional CFO service?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our Fractional CFO service provides you with dedicated financial expertise, strategic planning, and personalized accounting services tailored to your business needs.',
      },
    },
    {
      '@type': 'Question',
      name: 'How secure is my financial data with CFO Line?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We use industry-standard encryption and security practices to keep your data safe. Your information is never shared with third parties without your explicit consent.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I cancel my CFO Line subscription?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.",
      },
    },
  ],
}
