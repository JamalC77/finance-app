import { apiClient } from '../utils/apiClient';

/**
 * Get profit and loss report
 */
export async function getProfitLossReport(params: {
  startDate: string;
  endDate: string;
  comparisonPeriod?: boolean;
  comparisonStartDate?: string;
  comparisonEndDate?: string;
}) {
  try {
    const response = await apiClient.get('/api/reports/profit-loss', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting profit and loss report:', error);
    throw error;
  }
}

/**
 * Get balance sheet report
 */
export async function getBalanceSheetReport(params: {
  asOfDate: string;
  comparisonDate?: string;
}) {
  try {
    const response = await apiClient.get('/api/reports/balance-sheet', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting balance sheet report:', error);
    throw error;
  }
}

/**
 * Get cash flow report
 */
export async function getCashFlowReport(params: {
  startDate: string;
  endDate: string;
}) {
  try {
    const response = await apiClient.get('/api/reports/cash-flow', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting cash flow report:', error);
    throw error;
  }
}

/**
 * Get accounts receivable aging report
 */
export async function getAccountsReceivableReport(params: {
  asOfDate: string;
  agingPeriods?: number[];
}) {
  try {
    const response = await apiClient.get('/api/reports/accounts-receivable', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting accounts receivable report:', error);
    throw error;
  }
}

/**
 * Get accounts payable aging report
 */
export async function getAccountsPayableReport(params: {
  asOfDate: string;
  agingPeriods?: number[];
}) {
  try {
    const response = await apiClient.get('/api/reports/accounts-payable', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting accounts payable report:', error);
    throw error;
  }
}

/**
 * Get tax summary report
 */
export async function getTaxSummaryReport(params: {
  startDate: string;
  endDate: string;
  taxCategoryId?: string;
}) {
  try {
    const response = await apiClient.get('/api/reports/tax-summary', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting tax summary report:', error);
    throw error;
  }
}

/**
 * Get custom report
 */
export async function getCustomReport(params: {
  reportType: string;
  startDate?: string;
  endDate?: string;
  asOfDate?: string;
  filters?: Record<string, any>;
  groupBy?: string[];
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}) {
  try {
    const response = await apiClient.get('/api/reports/custom', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting custom report:', error);
    throw error;
  }
}

/**
 * Export report
 */
export async function exportReport(data: {
  reportType: string;
  format: 'csv' | 'xlsx' | 'pdf';
  reportData: any;
  fileName?: string;
}) {
  try {
    const response = await apiClient.post('/api/reports/export', data, {
      responseType: 'blob',
    });
    
    // Create a download link for the file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', data.fileName || `${data.reportType}.${data.format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    console.error('Error exporting report:', error);
    throw error;
  }
} 