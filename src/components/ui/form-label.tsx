import React from 'react';
import { cn } from '@/lib/utils';

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        className={cn(
          'block text-sm font-medium text-gray-700 mb-1',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </label>
    );
  }
);

FormLabel.displayName = 'FormLabel';

export default FormLabel; 