import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { reconciliationApi } from '@/lib/api';

interface StatementUploaderProps {
  accounts: { id: string; name: string }[];
  onSuccess: (data: any) => void;
}

export function StatementUploader({ accounts, onSuccess }: StatementUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setError(null);
    setUploadSuccess(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files?.length) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setError(null);
      setUploadSuccess(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async () => {
    setError(null);
    
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    
    if (!selectedAccount) {
      setError('Please select an account');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('accountId', selectedAccount);
    
    setIsUploading(true);
    
    try {
      // Read the file as text to pass directly to the API
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const fileContent = e.target?.result as string;
        
        try {
          // Use the reconciliation API to import the statement
          const response = await reconciliationApi.importStatement({
            accountId: selectedAccount,
            fileContent,
            fileName: selectedFile.name
          });
          
          setUploadSuccess(true);
          onSuccess(response);
        } catch (err) {
          console.error('Upload error:', err);
          setError(err instanceof Error ? err.message : 'Failed to upload statement file');
        } finally {
          setIsUploading(false);
        }
      };
      
      fileReader.readAsText(selectedFile);
    } catch (err) {
      console.error('File reading error:', err);
      setError('Failed to read the file');
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import Bank Statement</CardTitle>
        <CardDescription>
          Upload a CSV or OFX file from your bank to reconcile transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="account">Select Account</Label>
          <Select
            value={selectedAccount}
            onValueChange={setSelectedAccount}
          >
            <SelectTrigger id="account">
              <SelectValue placeholder="Select an account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div
          className={`
            border-2 border-dashed rounded-lg p-12
            flex flex-col items-center justify-center
            cursor-pointer transition-colors
            ${selectedFile ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept=".csv,.ofx,.qfx,.qbo"
            onChange={handleFileChange}
          />
          
          {selectedFile ? (
            <>
              <FileText className="h-12 w-12 text-blue-500 mb-3" />
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
              <Button
                variant="link"
                size="sm"
                className="mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
              >
                Remove
              </Button>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 mb-3" />
              <p className="text-sm font-medium">Drag & drop your file here</p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports CSV, OFX, QFX, and QBO files
              </p>
              <Button variant="secondary" size="sm" className="mt-4">
                Browse Files
              </Button>
            </>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {uploadSuccess && (
          <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Statement imported successfully. You can now proceed to reconciliation.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedFile || !selectedAccount || isUploading}
          className="w-full"
        >
          {isUploading ? 'Uploading...' : 'Import Statement'}
        </Button>
      </CardFooter>
    </Card>
  );
} 