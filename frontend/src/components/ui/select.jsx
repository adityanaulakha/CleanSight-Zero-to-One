import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={`
        flex h-10 w-full items-center justify-between rounded-md border border-input 
        bg-background px-3 py-2 text-sm ring-offset-background 
        placeholder:text-muted-foreground 
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
        disabled:cursor-not-allowed disabled:opacity-50
        appearance-none cursor-pointer
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
  </div>
));
Select.displayName = 'Select';

const SelectTrigger = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <select
    ref={ref}
    className={`
      flex h-10 w-full items-center justify-between rounded-md border border-input 
      bg-background px-3 py-2 text-sm ring-offset-background 
      placeholder:text-muted-foreground 
      focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
      disabled:cursor-not-allowed disabled:opacity-50
      appearance-none cursor-pointer
      ${className}
    `}
    {...props}
  >
    {children}
  </select>
));
SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = ({ placeholder = 'Select...', show = true }) => 
  show ? (
    <option value="" disabled>
      {placeholder}
    </option>
  ) : null;

const SelectContent = ({ children }) => children;

const SelectItem = ({ value, children, ...props }) => (
  <option value={value} {...props}>
    {children}
  </option>
);

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
};
