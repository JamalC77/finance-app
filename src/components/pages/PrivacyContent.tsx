'use client';

import Link from 'next/link';
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PrivacyContent() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <DollarSign className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold">CFO Line</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="prose prose-sm sm:prose lg:prose-lg mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-4">Last Updated: March 14, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              CFO Line (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) provides financial data integration and modeling services for accounting professionals. This Privacy Policy explains how we handle data when you use our QuickBooks integration platform.
            </p>
            <p>
              By using CFO Line, you agree to the practices described in this Privacy Policy. This service is intended for business use by accounting professionals and financial service providers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Process</h2>

            <h3 className="text-xl font-medium mb-2">2.1 Account Information</h3>
            <p>
              We collect basic business information necessary to provide our services, including your name, email address, business contact details, and account credentials.
            </p>

            <h3 className="text-xl font-medium mb-2">2.2 QuickBooks Integration Data</h3>
            <p>
              Our primary function is to process financial data from your QuickBooks account. This includes:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Financial transaction records</li>
              <li>Client and vendor information</li>
              <li>Account balances and statements</li>
              <li>Other financial data available through the QuickBooks API</li>
            </ul>
            <p>
              We access this data only with your explicit authorization through the QuickBooks API connection that you initiate.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Connect with your QuickBooks account and process your financial data</li>
              <li>Generate financial models and reports based on your data</li>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and manage your account</li>
              <li>Communicate with you about service updates and support</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication protocols</li>
              <li>Regular security assessments</li>
              <li>Limited personnel access to client data</li>
            </ul>
            <p>
              We treat your financial data with the highest level of confidentiality, consistent with professional accounting standards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Sharing</h2>
            <p>We limit sharing of your information to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Service Providers:</strong> Third-party vendors who help us provide our services (e.g., cloud hosting, analytics)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>With Your Permission:</strong> When you explicitly authorize us to share data</li>
            </ul>
            <p>
              We do not sell your data or your clients&apos; financial information to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active or as needed to provide services. We will retain and use your information as necessary to comply with legal obligations, resolve disputes, and enforce our agreements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p>
              You can request access to, correction of, or deletion of your data by contacting us. You may also disconnect the QuickBooks integration at any time through your account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of significant changes by posting the new policy on our website and updating the &quot;Last Updated&quot; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> privacy@thecfoline.com<br />
              <strong>Address:</strong> Brent Janss CPA PLLC, 1102 East 24th Houston, Texas, 77009
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-6 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <DollarSign className="h-5 w-5 text-primary mr-2" />
              <span className="font-bold">CFO Line</span>
            </div>
            <div className="flex space-x-4 text-sm">
              <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
              <Link href="/terms" className="hover:underline">Terms of Service</Link>
              <Link href="/eula" className="hover:underline">EULA</Link>
            </div>
            <div className="text-sm text-muted-foreground mt-4 md:mt-0">
              &copy; {new Date().getFullYear()} CFO Line. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
