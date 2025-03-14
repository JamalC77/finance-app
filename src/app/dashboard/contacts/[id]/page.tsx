"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Building, 
  UserCircle, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getContact } from '@/api/services/contactService';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to get the appropriate icon for contact type
const getContactTypeIcon = (type: string) => {
  switch (type) {
    case 'CUSTOMER':
      return <UserCircle className="h-5 w-5 text-blue-500" />;
    case 'VENDOR':
      return <Building className="h-5 w-5 text-purple-500" />;
    default:
      return <UserCircle className="h-5 w-5" />;
  }
};

export default function ContactDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        setLoading(true);
        const data = await getContact(params.id);
        setContact(data);
        setError(null);
        setUsingMockData(false);
      } catch (err) {
        console.error('Error fetching contact details:', err);
        setContact(null);
        setError('Contact not found or API unavailable. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContactDetails();
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return <ContactDetailsSkeleton />;
  }

  if (error && !contact) {
    return (
      <div className="p-6 space-y-6">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contacts
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="p-6 space-y-6">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contacts
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Contact not found</p>
            <Button onClick={handleBack}>Return to Contacts</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Contacts
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Contact Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <div className="flex flex-1 items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            {getContactTypeIcon(contact.type)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{contact.name}</h1>
            <div className="flex items-center text-muted-foreground">
              {getContactTypeIcon(contact.type)}
              <span className="ml-1">{contact.type === 'CUSTOMER' ? 'Customer' : 'Vendor'}</span>
              {contact.isActive === false && (
                <span className="ml-2 text-xs bg-red-100 text-red-800 rounded-full px-2 py-0.5">Inactive</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {contact.email && (
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          )}
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Contact Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contact.email && (
              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div>{contact.email}</div>
                </div>
              </div>
            )}
            
            {contact.phone && (
              <div className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div>{contact.phone}</div>
                </div>
              </div>
            )}
            
            {(contact.address || contact.city || contact.state || contact.zip || contact.country) && (
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Address</div>
                  <div>
                    {contact.address && <div>{contact.address}</div>}
                    {(contact.city || contact.state || contact.zip) && (
                      <div>
                        {contact.city}{contact.city && contact.state ? ', ' : ''}{contact.state} {contact.zip}
                      </div>
                    )}
                    {contact.country && <div>{contact.country}</div>}
                  </div>
                </div>
              </div>
            )}
            
            {contact.taxIdentifier && (
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Tax ID</div>
                  <div>{contact.taxIdentifier}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {contact.notes ? (
              <p className="whitespace-pre-wrap">{contact.notes}</p>
            ) : (
              <p className="text-muted-foreground text-sm italic">No notes available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity and Financial Summary could be added here */}
    </div>
  );
}

// Skeleton loader for the contact details page
function ContactDetailsSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" disabled className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Contacts
      </Button>

      {/* Contact Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <div className="flex flex-1 items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* Contact Details Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-36" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 