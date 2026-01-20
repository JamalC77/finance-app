'use client';

import Link from 'next/link';
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TermsContent() {
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
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-4">Last Updated: March 14, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using CFO Line (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of the terms, you may not access the Service.
            </p>
            <p>
              These Terms apply to all visitors, users, and others who access or use the Service. By using our Service, you also agree to our Privacy Policy, which is incorporated by reference.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>
              CFO Line provides financial data integration and modeling services for accounting professionals, primarily through integration with QuickBooks and other financial platforms. Our Service allows users to analyze, model, and visualize financial data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Account Registration and Security</h2>
            <p>
              To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. QuickBooks Integration</h2>
            <p>
              Our Service integrates with QuickBooks and other third-party services. By connecting your QuickBooks account, you authorize us to access and process your financial data as necessary to provide our Service.
            </p>
            <p>
              You acknowledge that:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>You have the authority to connect your QuickBooks account to our Service</li>
              <li>You are responsible for complying with QuickBooks' terms of service</li>
              <li>We are not responsible for any issues arising from the QuickBooks platform itself</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Subscription and Billing</h2>
            <p>
              Some aspects of the Service may be offered on a subscription basis. By selecting a subscription plan, you agree to pay the subscription fees according to the pricing terms presented to you at the time of purchase.
            </p>
            <p>
              Subscription fees are billed in advance on a monthly or annual basis. Your subscription will automatically renew unless you cancel it at least 24 hours before the end of the current billing period.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of CFO Line and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
            </p>
            <p>
              Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of CFO Line.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. User Data</h2>
            <p>
              You retain all rights to your data. By using our Service, you grant us a license to access, process, and store your data as necessary to provide the Service.
            </p>
            <p>
              We will maintain appropriate administrative, physical, and technical safeguards for protection of the security, confidentiality, and integrity of your data. We will not share your data except as described in our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p>
              In no event shall CFO Line, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your access to or use of or inability to access or use the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use or alteration of your transmissions or content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Disclaimer</h2>
            <p>
              Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the State of Texas, United States, without regard to its conflict of law provisions.
            </p>
            <p>
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p>
              By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> legal@cfoline.com<br />
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
              <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
              <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
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
