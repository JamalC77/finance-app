import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

type ExportData = {
  title: string;
  data: any[];
  columns: {
    header: string;
    accessor: string;
  }[];
};

// Export to PDF
export const exportToPDF = ({ title, data, columns }: ExportData): void => {
  try {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Generated on: ${currentDate}`, 14, 30);
    
    // Format data for the table
    const tableData = data.map(item => 
      columns.map(column => item[column.accessor])
    );
    
    // Column headers
    const tableHeaders = columns.map(column => column.header);
    
    // Add table
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 40,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    // Save the PDF
    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}_${currentDate.replace(/\//g, '-')}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};

// Export to Excel
export const exportToExcel = ({ title, data, columns }: ExportData): void => {
  // Create a workbook
  const workbook = XLSX.utils.book_new();
  
  // Format data for Excel
  const formattedData = data.map(item => {
    const row: Record<string, any> = {};
    columns.forEach(column => {
      row[column.header] = item[column.accessor];
    });
    return row;
  });
  
  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, title);
  
  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  // Save file
  const currentDate = new Date().toLocaleDateString().replace(/\//g, '-');
  const fileName = `${title.replace(/\s+/g, '_').toLowerCase()}_${currentDate}.xlsx`;
  
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  FileSaver.saveAs(blob, fileName);
};

// Export to CSV
export const exportToCSV = ({ title, data, columns }: ExportData): void => {
  // Format data for CSV
  const formattedData = data.map(item => {
    const row: Record<string, any> = {};
    columns.forEach(column => {
      row[column.header] = item[column.accessor];
    });
    return row;
  });
  
  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  
  // Generate CSV
  const csvContent = XLSX.utils.sheet_to_csv(worksheet);
  
  // Save file
  const currentDate = new Date().toLocaleDateString().replace(/\//g, '-');
  const fileName = `${title.replace(/\s+/g, '_').toLowerCase()}_${currentDate}.csv`;
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  FileSaver.saveAs(blob, fileName);
}; 