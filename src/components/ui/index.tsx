import React from 'react';

// Simple Card component
export const Card = {
  Header: ({ children }: { children: React.ReactNode }) => (
    <div className="border-b border-gray-200 px-4 py-5">{children}</div>
  ),
  Title: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-medium leading-6 text-gray-900">{children}</h3>
  ),
  Body: ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`px-4 py-5 ${className}`}>{children}</div>
  ),
  Footer: ({ children }: { children: React.ReactNode }) => (
    <div className="border-t border-gray-200 px-4 py-4">{children}</div>
  ),
};

// Simple Button component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  onClick,
  href,
  className = '',
}: { 
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive' | 'link' | 'text';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md focus:outline-none";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    link: "text-blue-600 underline hover:text-blue-800",
    text: "text-gray-700 hover:text-gray-900"
  };
  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base"
  };
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;
  
  if (href) {
    return (
      <a href={href} className={buttonClasses}>
        {children}
      </a>
    );
  }
  
  return (
    <button
      type="button"
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Simple Alert component
export const Alert = ({ 
  children, 
  variant = 'info',
  onClose,
}: {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
}) => {
  const variantClasses = {
    info: "bg-blue-50 text-blue-800 border-blue-200",
    success: "bg-green-50 text-green-800 border-green-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    error: "bg-red-50 text-red-800 border-red-200"
  };
  
  return (
    <div className={`p-4 rounded-md border ${variantClasses[variant]}`}>
      <div className="flex">
        <div className="flex-1">
          {children}
        </div>
        {onClose && (
          <button
            type="button"
            className={`ml-auto -mx-1.5 -my-1.5 rounded-md p-1.5 focus:outline-none ${
              variant === 'info' ? 'text-blue-500 hover:bg-blue-100' :
              variant === 'success' ? 'text-green-500 hover:bg-green-100' :
              variant === 'warning' ? 'text-yellow-500 hover:bg-yellow-100' :
              'text-red-500 hover:bg-red-100'
            }`}
            onClick={onClose}
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Simple Spinner component
export const Spinner = ({ 
  size = 'md',
  className = '',
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };
  
  return (
    <svg
      className={`animate-spin text-blue-600 ${sizeClasses[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

// Simple Select component
export const Select = ({
  value,
  onChange,
  children,
  disabled = false,
  className = '',
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${className}`}
    >
      {children}
    </select>
  );
};

// Simple FormLabel component
export const FormLabel = ({
  children,
  htmlFor,
  className = '',
}: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
    >
      {children}
    </label>
  );
};

// Simple FormControl component
export const FormControl = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}; 