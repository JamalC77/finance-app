"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Lock, 
  Save,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/contexts/AuthContext";
import { apiService } from "@/lib/contexts/ApiContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// User type from AuthContext
import { User } from "@/lib/contexts/AuthContext";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const { user, isLoading, setUserData } = useAuth();
  const initialLoadDone = useRef(false);
  
  // Password change state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  console.log("ProfilePage - Auth User Data:", user);
  
  // Form data state
  const [formData, setFormData] = useState({
    // Core user fields from User schema
    name: "",
    email: "",
    
    // Extended profile fields (not yet in schema, but could be added)
    firstName: "",
    lastName: "",
    phone: "",
    jobTitle: "",
    company: "",
    bio: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    website: "",
    twitter: "",
    linkedin: "",
    
    // Preferences
    dateFormat: "MM/DD/YYYY",
    timeZone: "America/New_York",
    twoFactorEnabled: false,
    emailNotifications: true,
    appNotifications: true,
  });

  // Initialize form data when user data is loaded or changed
  useEffect(() => {
    const initializeUserData = async () => {
      if (!isLoading) {
        // If user is already loaded from auth context
        if (user) {
          console.log("ProfilePage - Initializing with user data from context:", user);
          
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
          
          setFormData({
            // Core user data
            name: user.name || "",
            email: user.email || "",
            
            // Profile data
            firstName: firstName,
            lastName: lastName,
            phone: profile.phone || "",
            jobTitle: profile.jobTitle || "",
            company: profile.company || "",
            bio: profile.bio || "",
            address: profile.address || "",
            city: profile.city || "",
            state: profile.state || "",
            zipCode: profile.zipCode || "",
            country: profile.country || "",
            website: profile.website || "",
            twitter: profile.twitter || "",
            linkedin: profile.linkedin || "",
            
            // Preferences
            dateFormat: preferences.dateFormat || "MM/DD/YYYY",
            timeZone: preferences.timeZone || "America/New_York",
            twoFactorEnabled: preferences.twoFactorEnabled || false,
            emailNotifications: preferences.emailNotifications !== undefined ? preferences.emailNotifications : true,
            appNotifications: preferences.appNotifications !== undefined ? preferences.appNotifications : true,
          });
        } else {
          // Not logged in - use demo data
          console.log("ProfilePage - Setting demo data (no user)");
          
          setFormData({
            name: "Jane Doe",
            email: "jane.doe@example.com",
            firstName: "Jane",
            lastName: "Doe",
            phone: "+1 (555) 123-4567",
            jobTitle: "Financial Analyst",
            company: "Acme Corp",
            bio: "Experienced financial professional with a passion for accurate accounting and financial management.",
            address: "123 Finance Street",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "United States",
            website: "https://janedoe.com",
            twitter: "@janedoe",
            linkedin: "linkedin.com/in/janedoe",
            dateFormat: "MM/DD/YYYY",
            timeZone: "America/New_York",
            twoFactorEnabled: false,
            emailNotifications: true,
            appNotifications: true,
          });
        }
        
        initialLoadDone.current = true;
      }
    };
    
    initializeUserData();
  }, [user, isLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for first and last name to update the full name
    if (name === "firstName" || name === "lastName") {
      const firstName = name === "firstName" ? value : formData.firstName;
      const lastName = name === "lastName" ? value : formData.lastName;
      const fullName = `${firstName} ${lastName}`.trim();
      
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        name: fullName
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Include all form fields in the update data
      const userUpdateData = {
        // Core User model fields
        name: formData.name,
        // Only include email if it was changed from the original
        ...(user?.email !== formData.email && { email: formData.email }),
        
        // Extended profile fields
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        jobTitle: formData.jobTitle,
        company: formData.company,
        bio: formData.bio,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        website: formData.website,
        twitter: formData.twitter,
        linkedin: formData.linkedin,
        
        // Preferences
        dateFormat: formData.dateFormat,
        timeZone: formData.timeZone,
        twoFactorEnabled: formData.twoFactorEnabled,
        emailNotifications: formData.emailNotifications,
        appNotifications: formData.appNotifications,
      };
      
      console.log("ProfilePage - Saving user data:", userUpdateData);
      
      // Call the API to update the user profile
      const response = await apiService.put<{user: User; message: string}>('/api/users/me', userUpdateData);
      console.log("ProfilePage - API response:", response);
      
      // Check if the API returned the updated user
      if (response && response.user && setUserData) {
        console.log("ProfilePage - Updating auth context with API response user:", response.user);
        
        // Update the auth context with the user from the response
        setUserData(response.user);
      } else if (user && setUserData) {
        // Fallback: Create updated user object by merging existing user data with updates
        const updatedUser = {
          ...user,
          ...userUpdateData
        };
        
        console.log("ProfilePage - Fallback: updating with merged user data:", updatedUser);
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
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Password change handlers
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (passwordError) {
      setPasswordError("");
    }
  };

  const togglePasswordVisibility = (field: 'currentPassword' | 'newPassword' | 'confirmPassword') => {
    if (field === 'currentPassword') {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (field === 'newPassword') {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const validatePasswordData = () => {
    // Check if current password is provided
    if (!passwordData.currentPassword) {
      setPasswordError("Current password is required");
      return false;
    }
    
    // Check if new password is provided
    if (!passwordData.newPassword) {
      setPasswordError("New password is required");
      return false;
    }
    
    // Check if new password meets minimum requirements (e.g., 8 characters)
    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return false;
    }
    
    // Check if passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return false;
    }
    
    return true;
  };

  const handleChangePassword = async () => {
    // Validate password data
    if (!validatePasswordData()) {
      return;
    }
    
    setPasswordLoading(true);
    setPasswordError("");
    
    try {
      // Call API to change password
      const response = await apiService.post<{message: string}>('/api/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      console.log("ProfilePage - Password change response:", response);
      
      // Show success message
      toast({
        title: "Password updated",
        description: response?.message || "Your password has been updated successfully.",
      });
      
      // Close dialog and reset form
      setPasswordDialogOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: unknown) {
      console.error("Error changing password:", error);
      
      // Set error message
      const errorObj = error as { 
        response?: { data?: { message?: string } },
        message?: string 
      };
      
      setPasswordError(
        errorObj?.response?.data?.message || 
        errorObj?.message || 
        "Failed to change password. Please try again."
      );
      
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // If auth is still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
          {!loading && <Save className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user?.name ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}` : ""} />
                  <AvatarFallback className="text-xl">
                    {formData.firstName?.charAt(0)}{formData.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-semibold">{formData.name}</h2>
                <p className="text-muted-foreground">{formData.jobTitle}</p>
                <p className="text-sm text-muted-foreground">{formData.company}</p>
                
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{formData.email}</span>
                </div>
                {formData.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{formData.phone}</span>
                  </div>
                )}
                {formData.city && formData.country && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{formData.city}, {formData.country}</span>
                  </div>
                )}
              </div>
              
              {user?.role && (
                <>
                  <Separator className="my-6" />
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm font-medium">Role: {user.role}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="personal">
            <TabsList className="mb-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="contact">Contact Details</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-medium mb-1">
                        Job Title
                      </label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium mb-1">
                        Company
                      </label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium mb-1">
                      Bio
                    </label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Manage your contact details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">
                        Phone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="address" className="block text-sm font-medium mb-1">
                      Address
                    </label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-1">
                        City
                      </label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium mb-1">
                        State
                      </label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                        Zip Code
                      </label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="country" className="block text-sm font-medium mb-1">
                      Country
                    </label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium mb-1">
                        Website
                      </label>
                      <Input
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="twitter" className="block text-sm font-medium mb-1">
                        Twitter
                      </label>
                      <Input
                        id="twitter"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="linkedin" className="block text-sm font-medium mb-1">
                        LinkedIn
                      </label>
                      <Input
                        id="linkedin"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>User Preferences</CardTitle>
                  <CardDescription>Customize your account settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="dateFormat" className="block text-sm font-medium mb-1">
                        Date Format
                      </label>
                      <Input
                        id="dateFormat"
                        name="dateFormat"
                        value={formData.dateFormat}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="timeZone" className="block text-sm font-medium mb-1">
                        Time Zone
                      </label>
                      <Input
                        id="timeZone"
                        name="timeZone"
                        value={formData.timeZone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={formData.emailNotifications}
                        onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">App Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications within the app
                        </p>
                      </div>
                      <Switch
                        checked={formData.appNotifications}
                        onCheckedChange={(checked) => handleSwitchChange('appNotifications', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Button variant="outline" onClick={() => setPasswordDialogOpen(true)}>
                      <Lock className="mr-2 h-4 w-4" /> Change Password
                    </Button>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        checked={formData.twoFactorEnabled}
                        onCheckedChange={(checked) => handleSwitchChange('twoFactorEnabled', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Password Change Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and a new password to update your credentials.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {passwordError && (
              <div className="text-sm font-medium text-destructive">{passwordError}</div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('currentPassword')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('newPassword')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long.
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword} disabled={passwordLoading}>
              {passwordLoading ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 