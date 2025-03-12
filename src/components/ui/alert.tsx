import * as React from "react"
import { cn } from "@/lib/utils"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'info' | 'warning' | 'error' | 'success';
  onClose?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", onClose, children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-gray-50 text-gray-800 border-gray-200',
      destructive: 'bg-red-50 text-red-800 border-red-200',
      info: 'bg-blue-50 text-blue-800 border-blue-200',
      warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      error: 'bg-red-50 text-red-800 border-red-200',
      success: 'bg-green-50 text-green-800 border-green-200',
    };

    return (
      <div 
        ref={ref}
        className={cn(
          'p-4 rounded-md border flex items-start',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <div className="flex-1">{children}</div>
        {onClose && (
          <button 
            onClick={onClose}
            className="ml-3 -mt-1 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";

interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("font-medium text-sm", className)}
      {...props}
    >
      {children}
    </h5>
  )
);

AlertTitle.displayName = "AlertTitle";

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm mt-1", className)}
      {...props}
    >
      {children}
    </p>
  )
);

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription }; 