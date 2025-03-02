import React from "react";
import Link from "next/link";
import { PlusCircle, Search, ChevronDown, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Mock data for accounts
const accounts = [
  // Assets
  {
    id: "1000",
    name: "Checking Account",
    type: "asset",
    subtype: "bank",
    balance: 24500.75,
    description: "Primary business checking account",
  },
  {
    id: "1001",
    name: "Savings Account",
    type: "asset",
    subtype: "bank",
    balance: 15000.00,
    description: "Business savings account",
  },
  {
    id: "1100",
    name: "Accounts Receivable",
    type: "asset",
    subtype: "receivable",
    balance: 8750.50,
    description: "Money owed by customers",
  },
  {
    id: "1200",
    name: "Inventory",
    type: "asset",
    subtype: "inventory",
    balance: 12350.25,
    description: "Value of goods in stock",
  },
  {
    id: "1300",
    name: "Office Equipment",
    type: "asset",
    subtype: "fixed-asset",
    balance: 5000.00,
    description: "Computers, furniture, etc.",
  },
  
  // Liabilities
  {
    id: "2000",
    name: "Accounts Payable",
    type: "liability",
    subtype: "payable",
    balance: 3250.75,
    description: "Money owed to vendors",
  },
  {
    id: "2100",
    name: "Credit Card",
    type: "liability",
    subtype: "credit-card",
    balance: 1875.50,
    description: "Business credit card",
  },
  {
    id: "2200",
    name: "Loan Payable",
    type: "liability",
    subtype: "loan",
    balance: 25000.00,
    description: "Business loan",
  },
  {
    id: "2300",
    name: "Sales Tax Payable",
    type: "liability",
    subtype: "tax",
    balance: 1250.25,
    description: "Sales tax collected but not yet paid",
  },
  
  // Equity
  {
    id: "3000",
    name: "Owner's Equity",
    type: "equity",
    subtype: "equity",
    balance: 35000.00,
    description: "Owner's investment in the business",
  },
  {
    id: "3100",
    name: "Retained Earnings",
    type: "equity",
    subtype: "equity",
    balance: 12500.00,
    description: "Accumulated earnings reinvested in the business",
  },
  
  // Income
  {
    id: "4000",
    name: "Sales Revenue",
    type: "income",
    subtype: "revenue",
    balance: 75000.00,
    description: "Revenue from sales",
  },
  {
    id: "4100",
    name: "Service Revenue",
    type: "income",
    subtype: "revenue",
    balance: 25000.00,
    description: "Revenue from services",
  },
  {
    id: "4200",
    name: "Interest Income",
    type: "income",
    subtype: "other-income",
    balance: 250.50,
    description: "Interest earned on bank accounts",
  },
  
  // Expenses
  {
    id: "5000",
    name: "Rent Expense",
    type: "expense",
    subtype: "operating-expense",
    balance: 12000.00,
    description: "Office rent",
  },
  {
    id: "5100",
    name: "Utilities Expense",
    type: "expense",
    subtype: "operating-expense",
    balance: 3500.00,
    description: "Electricity, water, etc.",
  },
  {
    id: "5200",
    name: "Salaries Expense",
    type: "expense",
    subtype: "operating-expense",
    balance: 45000.00,
    description: "Employee salaries",
  },
  {
    id: "5300",
    name: "Advertising Expense",
    type: "expense",
    subtype: "operating-expense",
    balance: 5000.00,
    description: "Marketing and advertising",
  },
  {
    id: "5400",
    name: "Office Supplies Expense",
    type: "expense",
    subtype: "operating-expense",
    balance: 1250.75,
    description: "Office supplies",
  },
];

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Helper function to get account type display name
const getAccountTypeDisplay = (type: string) => {
  switch (type) {
    case 'asset':
      return 'Assets';
    case 'liability':
      return 'Liabilities';
    case 'equity':
      return 'Equity';
    case 'income':
      return 'Income';
    case 'expense':
      return 'Expenses';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

export default function ChartOfAccountsPage() {
  // Group accounts by type
  const accountsByType = accounts.reduce((acc, account) => {
    if (!acc[account.type]) {
      acc[account.type] = [];
    }
    acc[account.type].push(account);
    return acc;
  }, {} as Record<string, typeof accounts>);

  // Order of account types
  const accountTypeOrder = ['asset', 'liability', 'equity', 'income', 'expense'];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Chart of Accounts</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Account
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Manage Accounts</CardTitle>
          <CardDescription>
            View and manage your chart of accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search accounts..."
                className="pl-8"
              />
            </div>
            <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="">All Account Types</option>
              <option value="asset">Assets</option>
              <option value="liability">Liabilities</option>
              <option value="equity">Equity</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>

          <div className="space-y-4">
            {accountTypeOrder.map((type) => (
              <div key={type} className="border rounded-md">
                <div className="flex items-center justify-between p-3 bg-muted/50">
                  <div className="flex items-center">
                    <ChevronDown className="h-5 w-5 mr-2" />
                    <h3 className="font-medium">{getAccountTypeDisplay(type)}</h3>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {accountsByType[type]?.length || 0} accounts
                  </div>
                </div>
                <div className="divide-y">
                  {accountsByType[type]?.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-3 hover:bg-muted/50">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-medium">{account.id}</span>
                          <span className="mx-2">•</span>
                          <Link href={`/dashboard/chart-of-accounts/${account.id}`} className="font-medium text-primary hover:underline">
                            {account.name}
                          </Link>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {account.description}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(account.balance)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {account.subtype.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </div>
                      </div>
                      <div className="flex items-center ml-4">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 