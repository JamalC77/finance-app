import React from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function NewExpensePage() {
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/expenses" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">New Expense</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Expense Details</CardTitle>
              <CardDescription>
                Enter the details of your expense
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="vendor" className="block text-sm font-medium mb-1">
                    Vendor
                  </label>
                  <Input
                    id="vendor"
                    type="text"
                    placeholder="Enter vendor name"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select a category</option>
                    <option value="office-supplies">Office Supplies</option>
                    <option value="utilities">Utilities</option>
                    <option value="software-services">Software & Services</option>
                    <option value="meals-entertainment">Meals & Entertainment</option>
                    <option value="travel">Travel</option>
                    <option value="rent">Rent</option>
                    <option value="insurance">Insurance</option>
                    <option value="taxes">Taxes</option>
                    <option value="salaries">Salaries & Wages</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-7"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="tax" className="block text-sm font-medium mb-1">
                    Tax
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      id="tax"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-7"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-1">
                    Date
                  </label>
                  <Input
                    id="date"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label htmlFor="payment-method" className="block text-sm font-medium mb-1">
                    Payment Method
                  </label>
                  <select
                    id="payment-method"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select payment method</option>
                    <option value="credit-card">Credit Card</option>
                    <option value="debit-card">Debit Card</option>
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="paypal">PayPal</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Enter a description of the expense"
                ></textarea>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Accounting Details</CardTitle>
              <CardDescription>
                Specify how this expense should be recorded in your books
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="account" className="block text-sm font-medium mb-1">
                    Expense Account
                  </label>
                  <select
                    id="account"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select an account</option>
                    <option value="office-expenses">Office Expenses</option>
                    <option value="utilities">Utilities</option>
                    <option value="software-subscriptions">Software Subscriptions</option>
                    <option value="meals-entertainment">Meals & Entertainment</option>
                    <option value="travel-expenses">Travel Expenses</option>
                    <option value="rent-expense">Rent Expense</option>
                    <option value="insurance-expense">Insurance Expense</option>
                    <option value="tax-expense">Tax Expense</option>
                    <option value="salary-expense">Salary Expense</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="payment-account" className="block text-sm font-medium mb-1">
                    Payment Account
                  </label>
                  <select
                    id="payment-account"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select an account</option>
                    <option value="checking">Checking Account</option>
                    <option value="savings">Savings Account</option>
                    <option value="credit-card">Credit Card</option>
                    <option value="petty-cash">Petty Cash</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="tax-deductible" className="flex items-center">
                  <input
                    id="tax-deductible"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm">This expense is tax deductible</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="mb-6 sticky top-6">
            <CardHeader>
              <CardTitle>Receipt</CardTitle>
              <CardDescription>
                Upload a receipt for this expense
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-1">Drag and drop your receipt here</p>
                <p className="text-xs text-muted-foreground mb-4">Supports JPG, PNG, and PDF up to 10MB</p>
                <Button variant="outline" size="sm">
                  Browse Files
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Expense
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 