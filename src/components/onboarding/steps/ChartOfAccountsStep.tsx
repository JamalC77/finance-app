"use client";

import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';

interface ChartOfAccountsStepProps {
  onValidityChange: (isValid: boolean) => void;
}

const TEMPLATE_OPTIONS = [
  {
    id: 'standard',
    name: 'Standard Business',
    description: 'Best for most small businesses',
    accounts: ['Cash', 'Accounts Receivable', 'Inventory', 'Fixed Assets', 'Accounts Payable', 'Revenue', 'Expenses']
  },
  {
    id: 'retail',
    name: 'Retail Business',
    description: 'Optimized for retail and inventory management',
    accounts: ['Cash', 'Inventory', 'Cost of Goods Sold', 'Sales Revenue', 'Store Expenses', 'Marketing']
  },
  {
    id: 'service',
    name: 'Service Business',
    description: 'Perfect for professional services and consulting',
    accounts: ['Cash', 'Accounts Receivable', 'Service Revenue', 'Professional Development', 'Office Expenses']
  },
  {
    id: 'custom',
    name: 'Custom Setup',
    description: 'Start with a blank slate and build your own',
    accounts: []
  }
];

export default function ChartOfAccountsStep({ onValidityChange }: ChartOfAccountsStepProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  useEffect(() => {
    // Form is valid if any template is selected
    onValidityChange(selectedTemplate !== '');
  }, [selectedTemplate, onValidityChange]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Choose a chart of accounts template or start from scratch. You can customize these later.
      </p>

      <RadioGroup
        value={selectedTemplate}
        onValueChange={setSelectedTemplate}
        className="space-y-3"
      >
        {TEMPLATE_OPTIONS.map((template) => (
          <Label
            key={template.id}
            className="cursor-pointer"
            htmlFor={template.id}
          >
            <Card className={`${selectedTemplate === template.id ? 'border-primary' : 'border-border'}`}>
              <CardContent className="flex items-start p-3">
                <RadioGroupItem
                  value={template.id}
                  id={template.id}
                  className="mt-1"
                />
                <div className="ml-3 space-y-1">
                  <div className="flex items-center">
                    <p className="font-medium">{template.name}</p>
                    {selectedTemplate === template.id && (
                      <CheckIcon className="ml-2 h-4 w-4 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                  {template.accounts.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium">Includes:</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {template.accounts.map((account) => (
                          <span
                            key={account}
                            className="inline-block rounded-full bg-muted px-2 py-1 text-xs"
                          >
                            {account}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Label>
        ))}
      </RadioGroup>

      {selectedTemplate === 'custom' && (
        <div className="rounded-lg border border-dashed p-4 mt-4">
          <p className="text-sm text-center text-muted-foreground">
            You'll be able to add accounts after completing the onboarding process.
          </p>
        </div>
      )}
    </div>
  );
} 