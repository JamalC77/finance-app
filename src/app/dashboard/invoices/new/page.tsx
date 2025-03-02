import React from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function NewInvoicePage() {
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/invoices" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">New Invoice</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>
                Select an existing client or enter new client details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="client" className="block text-sm font-medium mb-1">
                    Client
                  </label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="">Select a client</option>
                    <option value="1">Acme Corp</option>
                    <option value="2">Globex Inc</option>
                    <option value="3">Stark Industries</option>
                    <option value="4">Wayne Enterprises</option>
                    <option value="5">Umbrella Corp</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="new-client" className="block text-sm font-medium mb-1">
                    Or add a new client
                  </label>
                  <Button variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Client
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="billing-address" className="block text-sm font-medium mb-1">
                    Billing Address
                  </label>
                  <textarea
                    id="billing-address"
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Enter billing address"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="shipping-address" className="block text-sm font-medium mb-1">
                    Shipping Address
                  </label>
                  <textarea
                    id="shipping-address"
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Enter shipping address"
                  ></textarea>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Invoice Items</CardTitle>
              <CardDescription>
                Add products or services to your invoice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left font-medium">Item</th>
                      <th className="py-3 px-4 text-left font-medium">Description</th>
                      <th className="py-3 px-4 text-left font-medium">Quantity</th>
                      <th className="py-3 px-4 text-left font-medium">Price</th>
                      <th className="py-3 px-4 text-left font-medium">Tax</th>
                      <th className="py-3 px-4 text-left font-medium">Total</th>
                      <th className="py-3 px-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">
                        <Input type="text" placeholder="Item name" />
                      </td>
                      <td className="py-3 px-4">
                        <Input type="text" placeholder="Description" />
                      </td>
                      <td className="py-3 px-4">
                        <Input type="number" placeholder="1" min="1" />
                      </td>
                      <td className="py-3 px-4">
                        <Input type="number" placeholder="0.00" min="0" step="0.01" />
                      </td>
                      <td className="py-3 px-4">
                        <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                          <option value="0">No Tax (0%)</option>
                          <option value="5">5%</option>
                          <option value="10">10%</option>
                          <option value="15">15%</option>
                          <option value="20">20%</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        $0.00
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Notes & Terms</CardTitle>
              <CardDescription>
                Add any additional information to your invoice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium mb-1">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Enter any notes for the client"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="terms" className="block text-sm font-medium mb-1">
                    Terms & Conditions
                  </label>
                  <textarea
                    id="terms"
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Enter terms and conditions"
                  ></textarea>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="mb-6 sticky top-6">
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
              <CardDescription>
                Invoice details and totals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="invoice-number" className="block text-sm font-medium mb-1">
                    Invoice Number
                  </label>
                  <Input
                    id="invoice-number"
                    type="text"
                    defaultValue="INV-006"
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="invoice-date" className="block text-sm font-medium mb-1">
                    Invoice Date
                  </label>
                  <Input
                    id="invoice-date"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label htmlFor="due-date" className="block text-sm font-medium mb-1">
                    Due Date
                  </label>
                  <Input
                    id="due-date"
                    type="date"
                  />
                </div>
                <div>
                  <label htmlFor="payment-terms" className="block text-sm font-medium mb-1">
                    Payment Terms
                  </label>
                  <select
                    id="payment-terms"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="due-receipt">Due on Receipt</option>
                    <option value="net-15">Net 15</option>
                    <option value="net-30">Net 30</option>
                    <option value="net-45">Net 45</option>
                    <option value="net-60">Net 60</option>
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between py-2">
                    <span className="text-sm">Subtotal:</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm">Tax:</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between py-2 border-t">
                    <span className="text-base font-medium">Total:</span>
                    <span className="text-base font-bold">$0.00</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </Button>
              <Button className="w-full" variant="default">
                <Send className="mr-2 h-4 w-4" />
                Save & Send
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 