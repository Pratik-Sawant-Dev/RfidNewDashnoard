import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { clsx } from 'clsx';

const Select = ({ 
  label, 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select an option",
  searchable = true,
  icon: Icon,
  error,
  className = '',
  disabled = false,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef(null);
  const searchRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
      setHighlightedIndex(-1);
    }
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="w-full" ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Select Button */}
        <button
          type="button"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={clsx(
            'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
            'placeholder-gray-500 dark:placeholder-gray-400',
            'flex items-center justify-between',
            Icon && 'pl-10',
            error && 'border-red-500 focus:ring-red-500',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          {...props}
        >
          <div className="flex items-center">
            {Icon && (
              <Icon className="h-5 w-5 text-gray-400 mr-3" />
            )}
            <span className={clsx(
              selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
            )}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown 
            className={clsx(
              'h-5 w-5 text-gray-400 transition-transform duration-200',
              isOpen && 'rotate-180'
            )} 
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search options..."
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={clsx(
                      'w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600',
                      'flex items-center justify-between',
                      index === highlightedIndex && 'bg-gray-100 dark:bg-gray-600',
                      value === option.value && 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    )}
                  >
                    <span>{option.label}</span>
                    {value === option.value && (
                      <Check className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Select;
