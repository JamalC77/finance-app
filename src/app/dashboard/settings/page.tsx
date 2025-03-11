"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  User, 
  Building, 
  CreditCard, 
  Users, 
  FileText, 
  Settings, 
  Bell, 
  Lock, 
  HelpCircle,
  Save,
  Link2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/contexts/AuthContext";
import { apiService } from "@/lib/contexts/ApiContext";
import { toast } from "@/components/ui/use-toast";
import type { User as UserType } from "@/lib/contexts/AuthContext";

export default function SettingsPage() {
  const { user, isLoading, setUserData } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const initialLoadDone = useRef(false);
  
  console.log("SettingsPage - Auth User Data:", user);

  // Profile form data
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    phone: "",
    timezone: "utc-5", // Default to Eastern Time
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Initialize profile data when user data is loaded
  useEffect(() => {
    const initializeUserData = async () => {
      if (!isLoading) {
        // If user is already loaded from auth context
        if (user) {
          console.log("SettingsPage - Initializing with user data from context:", user);
          
          // Get metadata from user object
          const metadata = user.metadata || {};
          const profile = metadata.profile || {};
          const preferences = metadata.preferences || {};
          
          // Use firstName and lastName from metadata if available, otherwise split from full name
          let firstName = profile.firstName || "";
          let lastName = profile.lastName || "";
          
          // If we don't have first/last name in metadata, try to get from full name
          if (!firstName && !lastName && user.name) {
            const nameParts = user.name.split(' ');
            firstName = nameParts[0] || "";
            lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : "";
          }
          
          setProfileData({
            // Core user data
            name: user.name || "",
            email: user.email || "",
            firstName: firstName,
            lastName: lastName,
            phone: profile.phone || "",
            timezone: preferences.timeZone || "utc-5",
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
          });
        } else {
          // Not logged in - use demo data
          console.log("SettingsPage - Setting demo data (no user)");
          
          setProfileData({
            name: "Jane Doe",
            email: "jane.doe@example.com",
            firstName: "Jane",
            lastName: "Doe",
            phone: "(555) 123-4567",
            timezone: "utc-5",
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
          });
        }
      }
    };
    
    initializeUserData();
  }, [user, isLoading]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for first and last name to update the full name
    if (name === "firstName" || name === "lastName") {
      const firstName = name === "firstName" ? value : profileData.firstName;
      const lastName = name === "lastName" ? value : profileData.lastName;
      const fullName = `${firstName} ${lastName}`.trim();
      
      setProfileData(prev => ({ 
        ...prev, 
        [name]: value,
        name: fullName
      }));
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    try {
      // Create update data with all fields
      const userUpdateData = {
        // Core User model fields
        name: profileData.name,
        // Only include email if it was changed from the original
        ...(user?.email !== profileData.email && { email: profileData.email }),
        
        // Extended profile fields
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        
        // Update timeZone in preferences
        timeZone: profileData.timezone,
        
        // Handle password change if provided
        ...(profileData.newPassword && profileData.currentPassword && {
          password: profileData.currentPassword,
          newPassword: profileData.newPassword
        })
      };
      
      console.log("SettingsPage - Saving user data:", userUpdateData);
      
      // Call the API to update the user profile
      interface UserApiResponse {
        user: UserType;
        message: string;
      }
      
      const response = await apiService.put<UserApiResponse>('/api/users/me', userUpdateData);
      console.log("SettingsPage - API response:", response);
      
      // Check if the API returned the updated user
      if (response && response.user && setUserData) {
        console.log("SettingsPage - Updating auth context with API response user:", response.user);
        
        // Update the auth context with the user from the response
        setUserData(response.user);
      } else if (user && setUserData) {
        // Fallback: Create updated user object by merging existing user data with updates
        const updatedUser = {
          ...user,
          ...userUpdateData
        };
        
        console.log("SettingsPage - Fallback: updating with merged user data:", updatedUser);
        setUserData(updatedUser);
      }
      
      toast({
        title: "Profile updated",
        description: response?.message || "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Current section getter
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId.replace("#", ""));
  };

  // Handle currency select change
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Handle currency change logic
    console.log("Currency changed to:", e.target.value);
  };

  // If auth is still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Loading settings data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-0">
              <nav className="flex flex-col">
                <a 
                  href="#profile" 
                  onClick={() => handleSectionClick("profile")}
                  className={`flex items-center px-4 py-3 border-l-2 ${
                    activeSection === "profile" ? "border-primary bg-muted/50" : "border-transparent hover:bg-muted/50"
                  }`}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </a>
                <a 
                  href="#company" 
                  onClick={() => handleSectionClick("company")}
                  className={`flex items-center px-4 py-3 border-l-2 ${
                    activeSection === "company" ? "border-primary bg-muted/50" : "border-transparent hover:bg-muted/50"
                  }`}
                >
                  <Building className="mr-2 h-4 w-4" />
                  <span>Company</span>
                </a>
                <a 
                  href="#billing" 
                  onClick={() => handleSectionClick("billing")}
                  className={`flex items-center px-4 py-3 border-l-2 ${
                    activeSection === "billing" ? "border-primary bg-muted/50" : "border-transparent hover:bg-muted/50"
                  }`}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </a>
                <a 
                  href="#team" 
                  onClick={() => handleSectionClick("team")}
                  className={`flex items-center px-4 py-3 border-l-2 ${
                    activeSection === "team" ? "border-primary bg-muted/50" : "border-transparent hover:bg-muted/50"
                  }`}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span>Team</span>
                </a>
                <a 
                  href="#invoices" 
                  onClick={() => handleSectionClick("invoices")}
                  className={`flex items-center px-4 py-3 border-l-2 ${
                    activeSection === "invoices" ? "border-primary bg-muted/50" : "border-transparent hover:bg-muted/50"
                  }`}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Invoice Settings</span>
                </a>
                <a 
                  href="#taxes" 
                  onClick={() => handleSectionClick("taxes")}
                  className={`flex items-center px-4 py-3 border-l-2 ${
                    activeSection === "taxes" ? "border-primary bg-muted/50" : "border-transparent hover:bg-muted/50"
                  }`}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Tax Settings</span>
                </a>
                <Link 
                  href="/settings/integrations" 
                  className="flex items-center px-4 py-3 border-l-2 border-transparent hover:bg-muted/50"
                >
                  <Link2 className="mr-2 h-4 w-4" />
                  <span>Integrations</span>
                </Link>
                <a href="#preferences" className="flex items-center px-4 py-3 border-l-2 border-transparent hover:bg-muted/50">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Preferences</span>
                </a>
                <a href="#notifications" className="flex items-center px-4 py-3 border-l-2 border-transparent hover:bg-muted/50">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </a>
                <a href="#security" className="flex items-center px-4 py-3 border-l-2 border-transparent hover:bg-muted/50">
                  <Lock className="mr-2 h-4 w-4" />
                  <span>Security</span>
                </a>
                <a href="#help" className="flex items-center px-4 py-3 border-l-2 border-transparent hover:bg-muted/50">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </a>
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card className="mb-6" id="profile">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                    <span className="text-xl font-bold">JD</span>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-medium mb-1">
                      First Name
                    </label>
                    <Input
                      id="first-name"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-medium mb-1">
                      Last Name
                    </label>
                    <Input
                      id="last-name"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                  />
                </div>

                <div>
                  <label htmlFor="timezone" className="block text-sm font-medium mb-1">
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    name="timezone"
                    value={profileData.timezone}
                    onChange={handleProfileChange}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="utc-8">Pacific Time (UTC-8)</option>
                    <option value="utc-7">Mountain Time (UTC-7)</option>
                    <option value="utc-6">Central Time (UTC-6)</option>
                    <option value="utc-5">Eastern Time (UTC-5)</option>
                    <option value="utc-4">Atlantic Time (UTC-4)</option>
                    <option value="utc">UTC</option>
                    <option value="utc+1">Central European Time (UTC+1)</option>
                    <option value="utc+2">Eastern European Time (UTC+2)</option>
                    <option value="utc+3">Moscow Time (UTC+3)</option>
                    <option value="utc+5:30">Indian Standard Time (UTC+5:30)</option>
                    <option value="utc+8">China Standard Time (UTC+8)</option>
                    <option value="utc+9">Japan Standard Time (UTC+9)</option>
                    <option value="utc+10">Australian Eastern Time (UTC+10)</option>
                    <option value="utc+12">New Zealand Time (UTC+12)</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="mb-6" id="company">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Manage your company details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label htmlFor="company-name" className="block text-sm font-medium mb-1">
                    Company Name
                  </label>
                  <Input
                    id="company-name"
                    defaultValue="Acme Inc."
                  />
                </div>

                <div>
                  <label htmlFor="company-address" className="block text-sm font-medium mb-1">
                    Address
                  </label>
                  <Input
                    id="company-address"
                    defaultValue="123 Main St."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="company-city" className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <Input
                      id="company-city"
                      defaultValue="New York"
                    />
                  </div>
                  <div>
                    <label htmlFor="company-state" className="block text-sm font-medium mb-1">
                      State/Province
                    </label>
                    <Input
                      id="company-state"
                      defaultValue="NY"
                    />
                  </div>
                  <div>
                    <label htmlFor="company-zip" className="block text-sm font-medium mb-1">
                      Zip/Postal Code
                    </label>
                    <Input
                      id="company-zip"
                      defaultValue="10001"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company-country" className="block text-sm font-medium mb-1">
                    Country
                  </label>
                  <select
                    id="company-country"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="us" selected>United States</option>
                    <option value="ca">Canada</option>
                    <option value="uk">United Kingdom</option>
                    <option value="au">Australia</option>
                    <option value="de">Germany</option>
                    <option value="fr">France</option>
                    <option value="jp">Japan</option>
                    <option value="in">India</option>
                    <option value="br">Brazil</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="company-tax-id" className="block text-sm font-medium mb-1">
                    Tax ID / VAT Number
                  </label>
                  <Input
                    id="company-tax-id"
                    defaultValue="12-3456789"
                  />
                </div>

                <div>
                  <label htmlFor="company-website" className="block text-sm font-medium mb-1">
                    Website
                  </label>
                  <Input
                    id="company-website"
                    type="url"
                    defaultValue="https://www.acmeinc.com"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card className="mb-6" id="billing">
            <CardHeader>
              <CardTitle>Billing Settings</CardTitle>
              <CardDescription>
                Manage your subscription and payment methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Current Plan</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold">Free Plan</p>
                      <p className="text-sm text-muted-foreground">Basic features for small businesses</p>
                    </div>
                    <Button variant="outline">Upgrade</Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Payment Methods</h3>
                  <div className="border rounded-lg p-4 mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-6 bg-blue-600 rounded mr-3 flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Remove</Button>
                    </div>
                  </div>
                  <Button variant="outline">Add Payment Method</Button>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Billing History</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left py-2 px-4 font-medium">Date</th>
                          <th className="text-left py-2 px-4 font-medium">Description</th>
                          <th className="text-left py-2 px-4 font-medium">Amount</th>
                          <th className="text-left py-2 px-4 font-medium">Status</th>
                          <th className="text-right py-2 px-4 font-medium">Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="py-2 px-4">May 1, 2025</td>
                          <td className="py-2 px-4">Monthly Subscription</td>
                          <td className="py-2 px-4">$0.00</td>
                          <td className="py-2 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Paid
                            </span>
                          </td>
                          <td className="py-2 px-4 text-right">
                            <Button variant="ghost" size="sm">Download</Button>
                          </td>
                        </tr>
                        <tr className="border-t">
                          <td className="py-2 px-4">Apr 1, 2025</td>
                          <td className="py-2 px-4">Monthly Subscription</td>
                          <td className="py-2 px-4">$0.00</td>
                          <td className="py-2 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Paid
                            </span>
                          </td>
                          <td className="py-2 px-4 text-right">
                            <Button variant="ghost" size="sm">Download</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 