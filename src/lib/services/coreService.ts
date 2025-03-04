import apiClient from '../api';
import { API_CONFIG } from '../config';
import { 
  Transaction, 
  Invoice, 
  Expense, 
  Contact, 
  Account, 
  ReconciliationStatement,
  Organization,
  User
} from '../types';

/**
 * Base Service class that implements common CRUD operations
 * This matches the backend BaseService interface to provide type-safe API calls
 */
export class BaseApiService<T> {
  private endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  /**
   * Create a new entity
   */
  async create(data: Partial<T>, token: string, organizationId?: string): Promise<T> {
    const payload = organizationId ? { ...data, organizationId } : data;
    return apiClient.post<T>(`${this.endpoint}`, payload, token);
  }

  /**
   * Find an entity by ID
   */
  async findById(id: string, token: string, organizationId?: string): Promise<T | null> {
    const queryParams = organizationId ? `?organizationId=${organizationId}` : '';
    return apiClient.get<T>(`${this.endpoint}/${id}${queryParams}`, token);
  }

  /**
   * Find all entities
   */
  async findAll(token: string, organizationId?: string, options?: Record<string, any>): Promise<T[]> {
    const queryParams = new URLSearchParams();
    
    if (organizationId) {
      queryParams.append('organizationId', organizationId);
    }
    
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return apiClient.get<T[]>(`${this.endpoint}${queryString}`, token);
  }

  /**
   * Update an entity
   */
  async update(id: string, data: Partial<T>, token: string, organizationId?: string): Promise<T> {
    const payload = organizationId ? { ...data, organizationId } : data;
    return apiClient.post<T>(`${this.endpoint}/${id}`, payload, token);
  }

  /**
   * Delete an entity
   */
  async delete(id: string, token: string, organizationId?: string): Promise<T> {
    const queryParams = organizationId ? `?organizationId=${organizationId}` : '';
    return apiClient.delete<T>(`${this.endpoint}/${id}${queryParams}`, token);
  }
}

// Core API endpoints
const endpoints = {
  invoices: API_CONFIG.ENDPOINTS.INVOICES.BASE,
  expenses: API_CONFIG.ENDPOINTS.EXPENSES.BASE,
  contacts: API_CONFIG.ENDPOINTS.CONTACTS.BASE,
  accounts: API_CONFIG.ENDPOINTS.ACCOUNTS.BASE,
  transactions: API_CONFIG.ENDPOINTS.TRANSACTIONS.BASE,
  reconciliations: API_CONFIG.ENDPOINTS.RECONCILIATION.BASE,
  organizations: API_CONFIG.ENDPOINTS.ORGANIZATIONS.BASE,
  users: API_CONFIG.ENDPOINTS.USERS.BASE
};

// Export typed service instances for each entity
export const invoiceService = new BaseApiService<Invoice>(endpoints.invoices);
export const expenseService = new BaseApiService<Expense>(endpoints.expenses);
export const contactService = new BaseApiService<Contact>(endpoints.contacts);
export const accountService = new BaseApiService<Account>(endpoints.accounts);
export const transactionService = new BaseApiService<Transaction>(endpoints.transactions);
export const reconciliationService = new BaseApiService<ReconciliationStatement>(endpoints.reconciliations);
export const organizationService = new BaseApiService<Organization>(endpoints.organizations);
export const userService = new BaseApiService<User>(endpoints.users);

// Export all services as a single object
const coreService = {
  invoices: invoiceService,
  expenses: expenseService,
  contacts: contactService,
  accounts: accountService,
  transactions: transactionService,
  reconciliations: reconciliationService,
  organizations: organizationService,
  users: userService
};

export default coreService;