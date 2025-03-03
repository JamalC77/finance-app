"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlusIcon, XIcon, Send, CheckIcon } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface InviteUsersStepProps {
  onValidityChange: (isValid: boolean) => void;
}

type Invitation = {
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'pending' | 'sent';
};

export default function InviteUsersStep({ onValidityChange }: InviteUsersStepProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Invitation['role']>('editor');
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  
  // Allow skipping this step
  useEffect(() => {
    // This step is optional, so it's always "valid"
    onValidityChange(true);
  }, [onValidityChange]);
  
  const handleAddInvitation = () => {
    if (email && isValidEmail(email)) {
      setInvitations([
        ...invitations,
        { email, role, status: 'pending' }
      ]);
      setEmail('');
    }
  };
  
  const handleSendInvitations = () => {
    // Simulate sending invitations
    setInvitations(
      invitations.map(invite => ({ ...invite, status: 'sent' }))
    );
  };
  
  const handleRemoveInvitation = (emailToRemove: string) => {
    setInvitations(invitations.filter(invite => invite.email !== emailToRemove));
  };
  
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Invite team members to collaborate on your financial records. Each person can be assigned different permission levels.
      </p>
      
      <div className="flex items-end gap-2 mb-4">
        <div className="flex-1">
          <Label htmlFor="email" className="mb-2 block text-sm">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="colleague@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="w-32">
          <Label htmlFor="role" className="mb-2 block text-sm">
            Role
          </Label>
          <Select
            value={role}
            onValueChange={(value) => setRole(value as Invitation['role'])}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          onClick={handleAddInvitation}
          disabled={!email || !isValidEmail(email)}
          className="flex-shrink-0"
        >
          <UserPlusIcon className="h-4 w-4" />
        </Button>
      </div>
      
      {invitations.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-3">
            <div className="text-sm font-medium mb-2">
              Invitations ({invitations.length})
            </div>
            <div className="space-y-2">
              {invitations.map((invite) => (
                <div
                  key={invite.email}
                  className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{invite.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{invite.role}</p>
                  </div>
                  <div className="flex items-center">
                    {invite.status === 'sent' ? (
                      <span className="text-xs text-green-600 flex items-center">
                        <CheckIcon className="h-3 w-3 mr-1" />
                        Sent
                      </span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveInvitation(invite.email)}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {invitations.some(invite => invite.status === 'pending') && (
              <div className="mt-3">
                <Button
                  onClick={handleSendInvitations}
                  className="w-full"
                  size="sm"
                  variant="outline"
                >
                  <Send className="h-3 w-3 mr-2" />
                  Send Invitations
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-center text-muted-foreground">
          Team members will receive an email invitation to join your organization.
          You can add more members later from Settings.
        </p>
      </div>
    </div>
  );
} 