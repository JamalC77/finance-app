"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Link2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const integrations = [
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Connect your QuickBooks account to sync your accounting data',
    icon: 'https://cdn.cdnlogo.com/logos/q/54/quickbooks.svg',
    status: 'available',
    href: '/settings/integrations/quickbooks',
  },
  {
    id: 'xero',
    name: 'Xero',
    description: 'Sync with Xero to manage invoices, bills, and financial reporting',
    icon: 'https://cdn.cdnlogo.com/logos/x/82/xero.svg',
    status: 'coming-soon',
    href: '#',
  },
];

export default function IntegrationsPage() {
  return (
    <div className="container max-w-5xl py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Integrations</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div>
                <CardTitle>{integration.name}</CardTitle>
                <CardDescription>{integration.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-12">
                {integration.status === 'coming-soon' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    Coming Soon
                  </span>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-3">
              {integration.status === 'available' ? (
                <Link href={integration.href} className="w-full">
                  <Button variant="default" className="w-full">
                    <span>Configure</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" className="w-full" disabled>
                  Coming Soon
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 