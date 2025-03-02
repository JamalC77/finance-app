import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

// Format date
export function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

// Calculate due date (e.g., for invoices)
export function calculateDueDate(date: Date, days = 30): Date {
  const dueDate = new Date(date);
  dueDate.setDate(dueDate.getDate() + days);
  return dueDate;
}

// Generate an invoice number
export function generateInvoiceNumber(
  prefix = "INV",
  lastInvoiceNumber?: string
): string {
  if (lastInvoiceNumber) {
    const num = parseInt(lastInvoiceNumber.replace(/[^0-9]/g, ""), 10);
    return `${prefix}-${(num + 1).toString().padStart(4, "0")}`;
  }
  return `${prefix}-0001`;
}

// Check if a value is empty (null, undefined, "", [], {})
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  )
    return true;
  return false;
} 