"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { createContact } from "@/api/services/contactService";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  type: string;
  company: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
}

export default function NewContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Contact form state
  const [contactData, setContactData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    type: "CUSTOMER",
    company: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    notes: ""
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select input changes
  const handleSelectChange = (name: string, value: string) => {
    setContactData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = [];
    
    if (!contactData.name.trim()) {
      errors.push("Name is required");
    }
    
    if (contactData.email && !/^\S+@\S+\.\S+$/.test(contactData.email)) {
      errors.push("Email is invalid");
    }
    
    if (!contactData.type) {
      errors.push("Contact type is required");
    }
    
    return errors;
  };

  // Save contact
  const saveContact = async () => {
    const errors = validateForm();
    
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(". "),
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      await createContact(contactData);
      
      toast({
        title: "Success",
        description: "Contact created successfully",
      });
      
      // Redirect to contacts list
      router.push("/dashboard/contacts");
    } catch (error) {
      console.error("Error creating contact:", error);
      
      toast({
        title: "Error",
        description: "Failed to create contact. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/contacts" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">New Contact</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Enter the details of your new contact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={contactData.name}
                    onChange={handleInputChange}
                    placeholder="Enter contact name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={contactData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={contactData.phone}
                    onChange={handleInputChange}
                    placeholder="(123) 456-7890"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Contact Type *</Label>
                  <Select
                    value={contactData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select contact type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CUSTOMER">Customer</SelectItem>
                      <SelectItem value="VENDOR">Vendor</SelectItem>
                      <SelectItem value="BOTH">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={contactData.company}
                  onChange={handleInputChange}
                  placeholder="Company name (optional)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={contactData.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={contactData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    value={contactData.state}
                    onChange={handleInputChange}
                    placeholder="State/Province"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={contactData.postalCode}
                    onChange={handleInputChange}
                    placeholder="Postal code"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={contactData.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={contactData.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes about this contact"
                  rows={4}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Link href="/dashboard/contacts">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button 
                onClick={saveContact} 
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Contact"}
                {!loading && <Save className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
              <CardDescription>
                Additional information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Creating a contact allows you to better track your relationship with this person or organization.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">What's next?</h3>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2 space-y-1">
                    <li>Send them an invoice</li>
                    <li>Record expenses paid to them</li>
                    <li>Track your communication history</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium">Tips</h3>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2 space-y-1">
                    <li>Use a consistent naming convention</li>
                    <li>Include as much contact info as available</li>
                    <li>Categorize correctly as customer or vendor</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 