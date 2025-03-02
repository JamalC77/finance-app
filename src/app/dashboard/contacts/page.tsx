"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown,
  MoreHorizontal,
  Mail,
  FileText,
  Edit,
  Trash2,
  UserCircle,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { contacts } from '@/lib/mock-data';

const getContactTypeIcon = (type: string) => {
  switch (type) {
    case 'CUSTOMER':
      return <UserCircle className="h-4 w-4 text-blue-500" />;
    case 'VENDOR':
      return <Building className="h-4 w-4 text-purple-500" />;
    default:
      return <UserCircle className="h-4 w-4" />;
  }
};

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  
  // Filter contacts based on search query and type
  const filteredContacts = contacts.filter(contact => {
    // Filter by search query
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by type
    const matchesType = typeFilter ? contact.type === typeFilter : true;
    
    return matchesSearch && matchesType;
  });
  
  // Get counts
  const totalCount = filteredContacts.length;
  const customerCount = filteredContacts.filter(c => c.type === 'CUSTOMER').length;
  const vendorCount = filteredContacts.filter(c => c.type === 'VENDOR').length;

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <Link href="/dashboard/contacts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Contact
          </Button>
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">All Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total people and businesses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{customerCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              People who buy from you
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium">Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{vendorCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              People you buy from
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Directory</CardTitle>
          <CardDescription>
            Manage your customers and vendors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search contacts..."
                  className="pl-8 w-full md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Type</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTypeFilter(null)}>
                    All Contacts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('CUSTOMER')}>
                    Customers
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTypeFilter('VENDOR')}>
                    Vendors
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {typeFilter && (
              <div className="flex items-center space-x-1">
                <div className="text-sm text-muted-foreground">
                  Type: <span className="font-medium">{typeFilter === 'CUSTOMER' ? 'Customers' : 'Vendors'}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setTypeFilter(null)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Clear filter</span>
                </Button>
              </div>
            )}
          </div>
          
          {/* Contacts Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>Name</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>Type</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>Email</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <span>Phone</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="h-12 px-4 text-center text-muted-foreground">
                      No contacts found
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr key={contact.id} className="border-b hover:bg-muted/50">
                      <td className="h-12 px-4 align-middle">
                        <Link href={`/dashboard/contacts/${contact.id}`} className="text-primary hover:underline">
                          {contact.name}
                        </Link>
                      </td>
                      <td className="h-12 px-4 align-middle">
                        <div className="flex items-center">
                          {getContactTypeIcon(contact.type)}
                          <span className="ml-2">{contact.type === 'CUSTOMER' ? 'Customer' : 'Vendor'}</span>
                        </div>
                      </td>
                      <td className="h-12 px-4 align-middle">{contact.email}</td>
                      <td className="h-12 px-4 align-middle">{contact.phone}</td>
                      <td className="h-12 px-4 align-middle text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              <span>Send Email</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 