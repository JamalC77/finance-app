"use client";

import React from 'react';
import { 
  DownloadIcon,
  FileText,
  FileSpreadsheet,
  Sheet,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportToPDF, exportToExcel, exportToCSV } from '@/lib/export';

interface ExportButtonProps {
  title: string;
  data: any[];
  columns: {
    header: string;
    accessor: string;
  }[];
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export default function ExportButton({ 
  title, 
  data, 
  columns,
  variant = 'outline',
  size = 'sm'
}: ExportButtonProps) {
  const handleExportPDF = () => {
    try {
      console.log('Exporting to PDF...');
      exportToPDF({ title, data, columns });
      console.log('PDF export completed');
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const handleExportExcel = () => {
    try {
      console.log('Exporting to Excel...');
      exportToExcel({ title, data, columns });
      console.log('Excel export completed');
    } catch (error) {
      console.error('Excel export failed:', error);
      alert('Failed to export Excel. Please try again.');
    }
  };

  const handleExportCSV = () => {
    try {
      console.log('Exporting to CSV...');
      exportToCSV({ title, data, columns });
      console.log('CSV export completed');
    } catch (error) {
      console.error('CSV export failed:', error);
      alert('Failed to export CSV. Please try again.');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size}>
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV}>
          <Sheet className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 