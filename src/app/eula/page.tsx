'use client';

import Link from 'next/link';
import { Database, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EULA() {
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
          <h1 className="text-3xl font-bold mb-6">End User License Agreement (EULA)</h1>
          <p className="text-muted-foreground mb-4">Last Updated: March 14, 2025</p>
          
          <section className="mb-8">
            <p>
              This End User License Agreement (&quot;Agreement&quot;) is between you and CFO Line (&quot;Company,&quot; &quot;we,&quot; or &quot;us&quot;) for the use of our QuickBooks integration and financial data modeling service (&quot;Service&quot;).
            </p>
            <p>
              By using the Service, you agree to be bound by this Agreement. If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization to this Agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Service Description</h2>
            <p>
              CFO Line provides a platform that integrates with QuickBooks to process financial data and generate financial models and reports for accounting professionals and their clients.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. QuickBooks Integration</h2>
            <p>
              Our Service connects with QuickBooks through their official API. By using our Service, you authorize us to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your QuickBooks account data through the QuickBooks API</li>
              <li>Process and analyze your financial data</li>
              <li>Generate reports and financial models based on this data</li>
            </ul>
            <p>
              You acknowledge that:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your use of QuickBooks is subject to Intuit&apos;s terms of service</li>
              <li>You have the right to provide us access to the QuickBooks data</li>
              <li>You are responsible for maintaining your QuickBooks account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Subscription and Payment</h2>
            <p>
              The Service is provided on a subscription basis. Payment terms are as specified during the registration process or as subsequently agreed upon. We reserve the right to change our fees with notice before your next billing cycle.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Your Data</h2>
            <p>
              You retain all ownership rights to your data. You grant us a license to use, process, and display your data solely to provide the Service to you. We will handle your data in accordance with our Privacy Policy.
            </p>
            <p>
              We implement appropriate security measures to protect your data, but you acknowledge that no method of electronic transmission or storage is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use</h2>
            <p>
              You agree to use the Service only for lawful purposes and in accordance with this Agreement. You shall not:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use the Service to violate any law or regulation</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the integrity of the Service</li>
              <li>Reproduce, duplicate, copy, sell, or resell any portion of the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Professional Responsibility</h2>
            <p>
              Our Service provides tools for financial analysis, but you remain responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>The accuracy of data entered into QuickBooks</li>
              <li>Professional judgments made using our reports and models</li>
              <li>Compliance with applicable accounting standards and regulations</li>
              <li>Maintaining appropriate client confidentiality</li>
            </ul>
            <p>
              The Service is not a substitute for professional accounting judgment.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p>
              WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE, OR THAT DEFECTS WILL BE CORRECTED.
            </p>
            <p>
              THE SERVICE IS NOT INTENDED TO PROVIDE TAX, LEGAL, OR INVESTMENT ADVICE. YOU SHOULD CONSULT WITH QUALIFIED PROFESSIONALS FOR ADVICE TAILORED TO SPECIFIC SITUATIONS.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
            </p>
            <p>
              OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING UNDER THIS AGREEMENT SHALL NOT EXCEED THE AMOUNT PAID BY YOU TO US DURING THE TWELVE (12) MONTH PERIOD PRECEDING THE EVENT GIVING RISE TO THE LIABILITY.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Term and Termination</h2>
            <p>
              This Agreement remains in effect until terminated. You may terminate by discontinuing use of the Service and canceling your subscription. We may terminate or suspend your access if you violate this Agreement.
            </p>
            <p>
              Upon termination, your right to use the Service will cease immediately, and we may delete your account data after a reasonable period.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
            <p>
              This Agreement shall be governed by the laws of the State of Texas, without regard to its conflict of law provisions. Any dispute arising from this Agreement shall be resolved in the courts located in Texas.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to This Agreement</h2>
            <p>
              We may modify this Agreement at any time by posting the revised version on our website. Your continued use of the Service after such changes constitutes your acceptance of the revised Agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
            <p>
              If you have questions about this Agreement, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> legal@thecfoline.com<br />
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
              <Link href="/eula" className="text-primary hover:underline">EULA</Link>
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
 