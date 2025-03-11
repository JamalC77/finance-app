"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Settings } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function IntegrationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Extract the current integration name from the path if it exists
  const pathParts = pathname.split('/');
  const currentIntegration = pathParts.length > 3 ? pathParts[3] : null;
  
  // Capitalize the first letter of the integration name
  const formattedIntegration = currentIntegration 
    ? currentIntegration.charAt(0).toUpperCase() + currentIntegration.slice(1) 
    : null;
  
  return (
    <div className="container py-4">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            {pathname === '/settings/integrations' ? (
              <span>Integrations</span>
            ) : (
              <BreadcrumbLink asChild>
                <Link href="/settings/integrations">Integrations</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          
          {formattedIntegration && (
            <>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {pathParts.length > 4 ? (
                  <BreadcrumbLink asChild>
                    <Link href={`/settings/integrations/${currentIntegration}`}>{formattedIntegration}</Link>
                  </BreadcrumbLink>
                ) : (
                  <span>{formattedIntegration}</span>
                )}
              </BreadcrumbItem>
              
              {pathParts.length > 4 && (
                <>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <span>{pathParts[4].charAt(0).toUpperCase() + pathParts[4].slice(1)}</span>
                  </BreadcrumbItem>
                </>
              )}
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      
      {children}
    </div>
  );
} 