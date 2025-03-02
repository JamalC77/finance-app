// Mock data for the entire application
import { addDays, subDays, format, subMonths } from 'date-fns';

// Helper function to generate random integer between min and max (inclusive)
export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to generate a random floating point number with 2 decimal places
export const getRandomAmount = (min: number, max: number) => {
  return +(Math.random() * (max - min) + min).toFixed(2);
};

// Helper function to generate a random ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Generate dates for the past 30 days
const generateDates = (count: number) => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    dates.push(subDays(today, i));
  }
  
  return dates;
};

const dates = generateDates(30);

// Organizations
export const organizations = [
  {
    id: '1',
    name: 'Acme Corporation',
    address: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'USA',
    phoneNumber: '(555) 123-4567',
    email: 'info@acmecorp.com',
    website: 'www.acmecorp.com',
    taxIdentifier: '12-3456789',
    fiscalYearStart: new Date(2025, 0, 1), 
    defaultCurrency: 'USD',
  },
];

// Users
export const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@acmecorp.com',
    organizationId: '1',
    role: 'ADMIN',
    createdAt: new Date(2025, 0, 1),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@acmecorp.com',
    organizationId: '1',
    role: 'USER',
    createdAt: new Date(2025, 1, 15),
  },
];

// Accounts (Chart of Accounts)
export const accounts = [
  // Assets
  {
    id: '1000',
    accountNumber: '1000',
    name: 'Checking Account',
    type: 'ASSET',
    subtype: 'BANK',
    description: 'Primary business checking account',
    currentBalance: 24500.75,
    organizationId: '1',
  },
  {
    id: '1001',
    accountNumber: '1001',
    name: 'Savings Account',
    type: 'ASSET',
    subtype: 'BANK',
    description: 'Business savings account',
    currentBalance: 15000.00,
    organizationId: '1',
  },
  {
    id: '1100',
    accountNumber: '1100',
    name: 'Accounts Receivable',
    type: 'ASSET',
    subtype: 'RECEIVABLE',
    description: 'Money owed by customers',
    currentBalance: 8750.50,
    organizationId: '1',
  },
  {
    id: '1200',
    accountNumber: '1200',
    name: 'Inventory',
    type: 'ASSET',
    subtype: 'INVENTORY',
    description: 'Value of goods in stock',
    currentBalance: 12350.25,
    organizationId: '1',
  },
  {
    id: '1300',
    accountNumber: '1300',
    name: 'Office Equipment',
    type: 'ASSET',
    subtype: 'FIXED_ASSET',
    description: 'Computers, furniture, etc.',
    currentBalance: 5000.00,
    organizationId: '1',
  },
  
  // Liabilities
  {
    id: '2000',
    accountNumber: '2000',
    name: 'Accounts Payable',
    type: 'LIABILITY',
    subtype: 'PAYABLE',
    description: 'Money owed to vendors',
    currentBalance: 3250.75,
    organizationId: '1',
  },
  {
    id: '2100',
    accountNumber: '2100',
    name: 'Credit Card',
    type: 'LIABILITY',
    subtype: 'CREDIT_CARD',
    description: 'Business credit card',
    currentBalance: 1875.50,
    organizationId: '1',
  },
  {
    id: '2200',
    accountNumber: '2200',
    name: 'Loan Payable',
    type: 'LIABILITY',
    subtype: 'LOAN',
    description: 'Business loan',
    currentBalance: 25000.00,
    organizationId: '1',
  },
  {
    id: '2300',
    accountNumber: '2300',
    name: 'Sales Tax Payable',
    type: 'LIABILITY',
    subtype: 'TAX',
    description: 'Sales tax collected but not yet paid',
    currentBalance: 1250.25,
    organizationId: '1',
  },
  
  // Equity
  {
    id: '3000',
    accountNumber: '3000',
    name: "Owner's Equity",
    type: 'EQUITY',
    subtype: 'EQUITY',
    description: "Owner's investment in the business",
    currentBalance: 35000.00,
    organizationId: '1',
  },
  {
    id: '3100',
    accountNumber: '3100',
    name: 'Retained Earnings',
    type: 'EQUITY',
    subtype: 'EQUITY',
    description: 'Accumulated earnings reinvested in the business',
    currentBalance: 12500.00,
    organizationId: '1',
  },
  
  // Income
  {
    id: '4000',
    accountNumber: '4000',
    name: 'Sales Revenue',
    type: 'INCOME',
    subtype: 'REVENUE',
    description: 'Revenue from sales',
    currentBalance: 75000.00,
    organizationId: '1',
  },
  {
    id: '4100',
    accountNumber: '4100',
    name: 'Service Revenue',
    type: 'INCOME',
    subtype: 'REVENUE',
    description: 'Revenue from services',
    currentBalance: 25000.00,
    organizationId: '1',
  },
  {
    id: '4200',
    accountNumber: '4200',
    name: 'Interest Income',
    type: 'INCOME',
    subtype: 'OTHER_INCOME',
    description: 'Interest earned on bank accounts',
    currentBalance: 250.50,
    organizationId: '1',
  },
  
  // Expenses
  {
    id: '5000',
    accountNumber: '5000',
    name: 'Rent Expense',
    type: 'EXPENSE',
    subtype: 'OPERATING_EXPENSE',
    description: 'Office rent',
    currentBalance: 12000.00,
    organizationId: '1',
  },
  {
    id: '5100',
    accountNumber: '5100',
    name: 'Utilities Expense',
    type: 'EXPENSE',
    subtype: 'OPERATING_EXPENSE',
    description: 'Electricity, water, etc.',
    currentBalance: 3500.00,
    organizationId: '1',
  },
  {
    id: '5200',
    accountNumber: '5200',
    name: 'Salaries Expense',
    type: 'EXPENSE',
    subtype: 'OPERATING_EXPENSE',
    description: 'Employee salaries',
    currentBalance: 45000.00,
    organizationId: '1',
  },
  {
    id: '5300',
    accountNumber: '5300',
    name: 'Advertising Expense',
    type: 'EXPENSE',
    subtype: 'OPERATING_EXPENSE',
    description: 'Marketing and advertising',
    currentBalance: 5000.00,
    organizationId: '1',
  },
  {
    id: '5400',
    accountNumber: '5400',
    name: 'Office Supplies Expense',
    type: 'EXPENSE',
    subtype: 'OPERATING_EXPENSE',
    description: 'Office supplies',
    currentBalance: 1250.75,
    organizationId: '1',
  },
];

// Contacts (Customers & Vendors)
export const contacts = [
  {
    id: "CTT-001",
    name: "Acme Corporation",
    type: "CUSTOMER",
    email: "billing@acmecorp.com",
    phone: "555-123-4567",
    address: "123 Business Ave, Suite 100, San Francisco, CA 94107",
    notes: "Large enterprise client"
  },
  {
    id: "CTT-002",
    name: "TechStart Inc.",
    type: "CUSTOMER",
    email: "accounts@techstart.io",
    phone: "555-987-6543",
    address: "456 Startup Blvd, Austin, TX 78701",
    notes: "Growing startup, NET-30 terms"
  },
  {
    id: "CTT-003",
    name: "GlobalMedia Group",
    type: "CUSTOMER",
    email: "finance@globalmedia.com",
    phone: "555-456-7890",
    address: "789 Media Row, New York, NY 10018",
    notes: "Media conglomerate, requires PO numbers"
  },
  {
    id: "CTT-004",
    name: "Office Supplies Co",
    type: "VENDOR",
    email: "sales@officesupplies.com",
    phone: "555-222-3333",
    address: "321 Retail Street, Chicago, IL 60611",
    notes: "Preferred vendor for office supplies"
  },
  {
    id: "CTT-005",
    name: "City Power & Light",
    type: "VENDOR",
    email: "support@citypower.com",
    phone: "555-444-5555",
    address: "555 Utility Avenue, Seattle, WA 98101",
    notes: "Utility provider"
  },
  {
    id: "CTT-006",
    name: "Premium Web Hosting",
    type: "VENDOR",
    email: "billing@premiumhost.com",
    phone: "555-666-7777",
    address: "888 Server Lane, Denver, CO 80202",
    notes: "Web hosting provider, auto-billed monthly"
  },
  {
    id: "CTT-007",
    name: "Downtown Cafe",
    type: "VENDOR",
    email: "manager@downtowncafe.com",
    phone: "555-888-9999",
    address: "123 Main Street, Portland, OR 97204",
    notes: "Local cafe, client meetings"
  },
  {
    id: "CTT-008",
    name: "Metro Transit",
    type: "VENDOR",
    email: "info@metrotransit.org",
    phone: "555-111-2222",
    address: "456 Transit Center, Boston, MA 02110",
    notes: "Transportation services"
  }
];

// Products/Services
export const products = [
  {
    id: '1',
    name: 'Standard Plan',
    description: 'Basic software subscription',
    type: 'SERVICE',
    price: 29.99,
    organizationId: '1',
  },
  {
    id: '2',
    name: 'Premium Plan',
    description: 'Advanced software subscription with support',
    type: 'SERVICE',
    price: 99.99,
    organizationId: '1',
  },
  {
    id: '3',
    name: 'Enterprise Plan',
    description: 'Full-featured software with dedicated support',
    type: 'SERVICE',
    price: 299.99,
    organizationId: '1',
  },
  {
    id: '4',
    name: 'Consulting (hourly)',
    description: 'Professional consulting services',
    type: 'SERVICE',
    price: 150.00,
    organizationId: '1',
  },
  {
    id: '5',
    name: 'Hardware Device',
    description: 'IoT hardware device',
    type: 'PRODUCT',
    price: 199.99,
    organizationId: '1',
  },
];

// Invoices
export const invoices = [
  {
    id: "INV-001",
    contactId: "CTT-001",
    description: "Website Development Services",
    issueDate: new Date("2025-04-15"),
    dueDate: new Date("2025-05-15"),
    paidDate: new Date("2025-05-10"),
    subtotal: 5000.00,
    tax: 250.00,
    total: 5250.00,
    status: "PAID",
    notes: "Payment received via wire transfer",
    items: [
      {
        description: "Website Design",
        quantity: 1,
        unitPrice: 2000.00,
        amount: 2000.00
      },
      {
        description: "Frontend Development",
        quantity: 20,
        unitPrice: 75.00,
        amount: 1500.00
      },
      {
        description: "Backend Integration",
        quantity: 20,
        unitPrice: 75.00,
        amount: 1500.00
      }
    ]
  },
  {
    id: "INV-002",
    contactId: "CTT-002",
    description: "Mobile App Development - Phase 1",
    issueDate: new Date("2025-05-01"),
    dueDate: new Date("2025-06-01"),
    paidDate: new Date("2025-05-28"),
    subtotal: 10000.00,
    tax: 500.00,
    total: 10500.00,
    status: "PAID",
    notes: "Payment received via ACH transfer",
    items: [
      {
        description: "Mobile App UI/UX Design",
        quantity: 1,
        unitPrice: 3500.00,
        amount: 3500.00
      },
      {
        description: "iOS Development",
        quantity: 40,
        unitPrice: 85.00,
        amount: 3400.00
      },
      {
        description: "Android Development",
        quantity: 40,
        unitPrice: 85.00,
        amount: 3400.00
      }
    ]
  },
  {
    id: "INV-003",
    contactId: "CTT-003",
    description: "Content Management System Implementation",
    issueDate: new Date("2025-05-15"),
    dueDate: new Date("2025-06-15"),
    paidDate: null,
    subtotal: 7500.00,
    tax: 375.00,
    total: 7875.00,
    status: "PENDING",
    notes: "Awaiting PO approval",
    items: [
      {
        description: "CMS Installation & Configuration",
        quantity: 1,
        unitPrice: 1500.00,
        amount: 1500.00
      },
      {
        description: "Custom Templates Development",
        quantity: 40,
        unitPrice: 100.00,
        amount: 4000.00
      },
      {
        description: "Training & Documentation",
        quantity: 20,
        unitPrice: 100.00,
        amount: 2000.00
      }
    ]
  },
  {
    id: "INV-004",
    contactId: "CTT-001",
    description: "Website Maintenance - Q2 2025",
    issueDate: new Date("2025-06-01"),
    dueDate: new Date("2025-07-01"),
    paidDate: null,
    subtotal: 3000.00,
    tax: 150.00,
    total: 3150.00,
    status: "PENDING",
    notes: "Quarterly maintenance contract",
    items: [
      {
        description: "Standard Maintenance Package",
        quantity: 3,
        unitPrice: 800.00,
        amount: 2400.00
      },
      {
        description: "Additional Performance Optimization",
        quantity: 6,
        unitPrice: 100.00,
        amount: 600.00
      }
    ]
  },
  {
    id: "INV-005",
    contactId: "CTT-002",
    description: "Mobile App Development - Phase 2",
    issueDate: new Date("2025-06-15"),
    dueDate: new Date("2025-07-15"),
    paidDate: null,
    subtotal: 12000.00,
    tax: 600.00,
    total: 12600.00,
    status: "DRAFT",
    notes: "Pending client approval for Phase 2",
    items: [
      {
        description: "Advanced Feature Development",
        quantity: 80,
        unitPrice: 85.00,
        amount: 6800.00
      },
      {
        description: "API Integration",
        quantity: 40,
        unitPrice: 95.00,
        amount: 3800.00
      },
      {
        description: "Testing & Quality Assurance",
        quantity: 20,
        unitPrice: 70.00,
        amount: 1400.00
      }
    ]
  }
];

// Expenses
export const expenses = [
  {
    id: "EXP-001",
    contactId: "CTT-004",
    accountId: "ACC-003",
    category: "OFFICE_SUPPLIES",
    description: "Office supplies for Q2",
    amount: 235.45,
    date: new Date("2025-05-10"),
    receiptUrl: "/receipts/EXP-001.pdf",
    status: "PAID"
  },
  {
    id: "EXP-002",
    contactId: "CTT-005",
    accountId: "ACC-001",
    category: "UTILITIES",
    description: "Electricity bill for May",
    amount: 245.75,
    date: new Date("2025-05-15"),
    receiptUrl: "/receipts/EXP-002.pdf",
    status: "PAID"
  },
  {
    id: "EXP-003",
    contactId: "CTT-006",
    accountId: "ACC-003",
    category: "SOFTWARE_SERVICES",
    description: "Web hosting monthly fee",
    amount: 49.99,
    date: new Date("2025-05-18"),
    receiptUrl: "/receipts/EXP-003.pdf",
    status: "PAID"
  },
  {
    id: "EXP-004",
    contactId: "CTT-007",
    accountId: "ACC-003",
    category: "MEALS_ENTERTAINMENT",
    description: "Client lunch meeting",
    amount: 78.25,
    date: new Date("2025-05-22"),
    receiptUrl: null,
    status: "PENDING"
  },
  {
    id: "EXP-005",
    contactId: "CTT-008",
    accountId: "ACC-003",
    category: "TRAVEL",
    description: "Ride shares for client meetings",
    amount: 64.50,
    date: new Date("2025-05-28"),
    receiptUrl: null,
    status: "PENDING"
  },
  {
    id: "EXP-006",
    contactId: "CTT-004",
    accountId: "ACC-003",
    category: "OFFICE_SUPPLIES",
    description: "Printer ink and paper",
    amount: 125.30,
    date: new Date("2025-06-05"),
    receiptUrl: "/receipts/EXP-006.pdf",
    status: "PAID"
  },
  {
    id: "EXP-007",
    contactId: "CTT-006",
    accountId: "ACC-003",
    category: "SOFTWARE_SERVICES",
    description: "Adobe Creative Cloud subscription",
    amount: 52.99,
    date: new Date("2025-06-10"),
    receiptUrl: "/receipts/EXP-007.pdf",
    status: "PAID"
  }
];

// Transactions
export const transactions = [
  {
    id: '1',
    date: subDays(new Date(), 20),
    description: 'Office supplies purchase',
    reference: 'CC-1234',
    status: 'COMPLETED',
    organizationId: '1',
    ledgerEntries: [
      {
        id: '1',
        transactionId: '1',
        accountId: '5400',
        amount: 125.50,
        description: 'Office supplies',
      },
      {
        id: '2',
        transactionId: '1',
        accountId: '2100',
        amount: -125.50,
        description: 'Office supplies',
      },
    ],
  },
  {
    id: '2',
    date: subDays(new Date(), 15),
    description: 'Monthly hosting service',
    reference: 'BT-5678',
    status: 'COMPLETED',
    organizationId: '1',
    ledgerEntries: [
      {
        id: '3',
        transactionId: '2',
        accountId: '5100',
        amount: 99.99,
        description: 'Monthly hosting service',
      },
      {
        id: '4',
        transactionId: '2',
        accountId: '1000',
        amount: -99.99,
        description: 'Monthly hosting service',
      },
    ],
  },
  {
    id: '3',
    date: subDays(new Date(), 10),
    description: 'Customer payment',
    reference: 'TXREF123456',
    status: 'COMPLETED',
    organizationId: '1',
    ledgerEntries: [
      {
        id: '5',
        transactionId: '3',
        accountId: '1000',
        amount: 323.99,
        description: 'Payment for INV-2025-001',
      },
      {
        id: '6',
        transactionId: '3',
        accountId: '1100',
        amount: -323.99,
        description: 'Payment for INV-2025-001',
      },
    ],
  },
];

// Bank connections
export const bankConnections = [
  {
    id: '1',
    name: 'Business Bank',
    institutionId: 'ins_123',
    accessToken: 'access-sandbox-123',
    status: 'ACTIVE',
    lastSync: subDays(new Date(), 1),
    organizationId: '1',
    accounts: [
      {
        id: '1',
        bankConnectionId: '1',
        accountId: '1000',
        externalId: 'ext_checking_123',
        name: 'Business Checking',
        type: 'CHECKING',
        subtype: 'CHECKING',
        mask: '1234',
        currentBalance: 24500.75,
      },
      {
        id: '2',
        bankConnectionId: '1',
        accountId: '1001',
        externalId: 'ext_savings_456',
        name: 'Business Savings',
        type: 'SAVINGS',
        subtype: 'SAVINGS',
        mask: '5678',
        currentBalance: 15000.00,
      },
    ],
  },
];

// Financial reports data

// Monthly revenue data
export const monthlyRevenue = [
  { month: 'Jan', amount: 15000 },
  { month: 'Feb', amount: 20000 },
  { month: 'Mar', amount: 18000 },
  { month: 'Apr', amount: 22000 },
  { month: 'May', amount: 21000 },
  { month: 'Jun', amount: 25000 },
  { month: 'Jul', amount: 24000 },
  { month: 'Aug', amount: 28000 },
  { month: 'Sep', amount: 30000 },
  { month: 'Oct', amount: 32000 },
  { month: 'Nov', amount: 35000 },
  { month: 'Dec', amount: 40000 },
];

// Expense by category data
export const expensesByCategory = [
  { category: 'Rent', amount: 24000 },
  { category: 'Utilities', amount: 7000 },
  { category: 'Salaries', amount: 90000 },
  { category: 'Marketing', amount: 15000 },
  { category: 'Office Supplies', amount: 3000 },
  { category: 'Software', amount: 6000 },
  { category: 'Insurance', amount: 12000 },
  { category: 'Travel', amount: 8000 },
];

// Cash flow data for the last 6 months
export const cashFlowData = [
  { month: 'Jul', income: 24000, expenses: 20000, profit: 4000 },
  { month: 'Aug', income: 28000, expenses: 22000, profit: 6000 },
  { month: 'Sep', income: 30000, expenses: 21000, profit: 9000 },
  { month: 'Oct', income: 32000, expenses: 24000, profit: 8000 },
  { month: 'Nov', income: 35000, expenses: 25000, profit: 10000 },
  { month: 'Dec', income: 40000, expenses: 28000, profit: 12000 },
];

// Income statement data
export const incomeStatementData = {
  revenue: {
    sales: 75000,
    services: 25000,
    interest: 250.5,
    totalRevenue: 100250.5,
  },
  expenses: {
    rent: 12000,
    utilities: 3500,
    salaries: 45000,
    advertising: 5000,
    officeSupplies: 1250.75,
    totalExpenses: 66750.75,
  },
  netIncome: 33499.75,
};

// Balance sheet data
export const balanceSheetData = {
  assets: {
    currentAssets: {
      cash: 39500.75, // Checking + Savings
      accountsReceivable: 8750.5,
      inventory: 12350.25,
      totalCurrentAssets: 60601.5,
    },
    fixedAssets: {
      officeEquipment: 5000,
      totalFixedAssets: 5000,
    },
    totalAssets: 65601.5,
  },
  liabilities: {
    currentLiabilities: {
      accountsPayable: 3250.75,
      creditCard: 1875.5,
      salesTaxPayable: 1250.25,
      totalCurrentLiabilities: 6376.5,
    },
    longTermLiabilities: {
      loanPayable: 25000,
      totalLongTermLiabilities: 25000,
    },
    totalLiabilities: 31376.5,
  },
  equity: {
    ownersEquity: 35000,
    retainedEarnings: 12500,
    netIncome: -13275,
    totalEquity: 34225,
  },
};

// Dashboard summary data
export const dashboardSummary = {
  cash: {
    balance: 74750.55,
    change: 8450.25,
    changePercentage: 12.74
  },
  income: {
    mtd: 15750.00,
    ytd: 87500.00,
    previousMonth: 12200.00,
    changePercentage: 29.10
  },
  expenses: {
    mtd: 852.23,
    ytd: 14520.85,
    previousMonth: 940.56,
    changePercentage: -9.39
  },
  profitLoss: {
    mtd: 14897.77,
    ytd: 72979.15,
    previousMonth: 11259.44,
    changePercentage: 32.31
  },
  recentActivity: [
    {
      id: "ACT-001",
      type: "INVOICE_PAID",
      description: "Payment received for INV-002",
      amount: 10500.00,
      date: new Date("2025-05-28")
    },
    {
      id: "ACT-002",
      type: "EXPENSE_PAID",
      description: "Paid EXP-003: Web hosting monthly fee",
      amount: -49.99,
      date: new Date("2025-05-18")
    },
    {
      id: "ACT-003",
      type: "EXPENSE_RECORDED",
      description: "Recorded EXP-005: Ride shares for client meetings",
      amount: -64.50,
      date: new Date("2025-05-28")
    },
    {
      id: "ACT-004",
      type: "INVOICE_SENT",
      description: "Sent INV-004: Website Maintenance - Q2 2025",
      amount: 3150.00,
      date: new Date("2025-06-01")
    },
    {
      id: "ACT-005",
      type: "EXPENSE_PAID",
      description: "Paid EXP-006: Printer ink and paper",
      amount: -125.30,
      date: new Date("2025-06-05")
    }
  ],
  cashFlow: [
    { month: "Jan", income: 12500, expenses: 2340 },
    { month: "Feb", income: 14200, expenses: 2100 },
    { month: "Mar", income: 16800, expenses: 2800 },
    { month: "Apr", income: 15000, expenses: 2500 },
    { month: "May", income: 17250, expenses: 2600 },
    { month: "Jun", income: 11750, expenses: 2180 },
    { month: "Jul", income: 0, expenses: 0 },
    { month: "Aug", income: 0, expenses: 0 },
    { month: "Sep", income: 0, expenses: 0 },
    { month: "Oct", income: 0, expenses: 0 },
    { month: "Nov", income: 0, expenses: 0 },
    { month: "Dec", income: 0, expenses: 0 }
  ],
  topCustomers: [
    { name: "Acme Corporation", revenue: 8400.00 },
    { name: "TechStart Inc.", revenue: 10500.00 },
    { name: "GlobalMedia Group", revenue: 0.00 }
  ],
  topExpenseCategories: [
    { category: "Software & Services", amount: 102.98 },
    { category: "Office Supplies", amount: 360.75 },
    { category: "Utilities", amount: 245.75 },
    { category: "Travel", amount: 64.50 },
    { category: "Meals & Entertainment", amount: 78.25 }
  ]
}; 