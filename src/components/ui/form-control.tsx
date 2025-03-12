import React from 'react';
import { cn } from '@/lib/utils';

interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn('mb-4', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormControl.displayName = 'FormControl';

export default FormControl; 