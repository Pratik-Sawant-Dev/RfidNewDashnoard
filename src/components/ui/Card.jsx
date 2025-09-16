import React from 'react';
import { clsx } from 'clsx';

const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = true,
  ...props 
}) => {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4 lg:p-6',
    lg: 'p-6 lg:p-8',
    none: 'p-0',
  };

  return (
    <div
      className={clsx(
        'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700',
        shadow && 'shadow-lg',
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={clsx('mb-4', className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={clsx('text-lg font-semibold text-gray-900 dark:text-white', className)} {...props}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={clsx('text-gray-600 dark:text-gray-300', className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={clsx('mt-4 pt-4 border-t border-gray-200 dark:border-gray-700', className)} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
