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
    icon: '/icons/quickbooks.svg',
    status: 'available',
    href: '/settings/integrations/quickbooks',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Process payments and manage subscriptions',
    icon: '/icons/stripe.svg',
    status: 'coming-soon',
    href: '#',
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Track website traffic and user behavior',
    icon: '/icons/google-analytics.svg',
    status: 'coming-soon',
    href: '#',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect with thousands of other apps',
    icon: '/icons/zapier.svg',
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
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-muted">
                {integration.icon ? (
                  <img 
                    src={integration.icon} 
                    alt={integration.name} 
                    className="w-6 h-6"
                    onError={(e) => {
                      e.currentTarget.src = '';
                      e.currentTarget.onerror = null;
                      e.currentTarget.parentElement!.innerHTML = `<Link2 className="h-6 w-6 text-muted-foreground" />`;
                    }}
                  />
                ) : (
                  <Link2 className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
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