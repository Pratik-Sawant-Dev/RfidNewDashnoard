import React from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

const SimpleSelect = ({ 
  value, 
  onChange, 
  options = [], 
  className = '',
  disabled = false,
  ...props 
}) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={clsx(
          'appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md',
          'px-3 py-1.5 text-sm text-gray-900 dark:text-white',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'pr-8 cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Custom Chevron Down Icon */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};

export default SimpleSelect;
