import React from 'react';
import { Gem, Radio } from 'lucide-react';

/**
 * Universal Suspense Loader for RFID Jewellery App
 * Features jewelry and RFID-themed animations
 */
const SuspenseLoader = ({ 
  message = "Loading...", 
  size = "default",
  variant = "full" // full, inline, minimal
}) => {
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-16 h-16",
    large: "w-24 h-24"
  };

  const gemSizeClasses = {
    small: "w-6 h-6",
    default: "w-12 h-12",
    large: "w-16 h-16"
  };

  // Full screen loader
  if (variant === "full") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary-200 dark:bg-primary-800 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-200 dark:bg-blue-800 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 text-center">
          {/* Main loader container */}
          <div className="relative inline-block">
            {/* RFID Wave Animation - Outer rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-32 h-32 border-2 border-primary-300 dark:border-primary-600 rounded-full animate-rfid-pulse opacity-75"></div>
              <div className="absolute w-40 h-40 border-2 border-primary-200 dark:border-primary-700 rounded-full animate-rfid-pulse opacity-50" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute w-48 h-48 border-2 border-primary-100 dark:border-primary-800 rounded-full animate-rfid-pulse opacity-25" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Center Gem with rotation and sparkle */}
            <div className="relative z-10 w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 rounded-2xl animate-gem-rotate shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tl from-white/40 via-transparent to-transparent rounded-2xl"></div>
              </div>
              <Gem className="relative z-10 w-12 h-12 text-white animate-gem-pulse drop-shadow-lg" />
              
              {/* Sparkle effects */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full animate-sparkle"></div>
              <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-white rounded-full animate-sparkle" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-1/2 -left-4 w-2 h-2 bg-white rounded-full animate-sparkle" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* RFID Signal Icon */}
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Radio className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Brand name */}
          <div className="mt-8 mb-3">
            <h2 className="text-2xl font-bold text-gradient font-elegant flex items-center justify-center gap-2">
              <Gem className="w-6 h-6 text-primary-500" />
              JewelRFID
            </h2>
          </div>

          {/* Loading text with dots animation */}
          <div className="flex items-center justify-center space-x-1">
            <span className="text-gray-600 dark:text-gray-300 font-medium">
              {message}
            </span>
            <span className="flex space-x-1">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </span>
          </div>

          {/* Subtitle */}
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Securing your jewelry with RFID technology
          </p>
        </div>
      </div>
    );
  }

  // Inline loader (for smaller spaces)
  if (variant === "inline") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="relative inline-block">
            {/* Simplified RFID rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-20 h-20 border-2 border-primary-300 dark:border-primary-600 rounded-full animate-rfid-pulse opacity-75"></div>
              <div className="absolute w-24 h-24 border-2 border-primary-200 dark:border-primary-700 rounded-full animate-rfid-pulse opacity-50" style={{ animationDelay: '0.5s' }}></div>
            </div>

            {/* Center Gem */}
            <div className={`relative z-10 ${sizeClasses[size]} flex items-center justify-center`}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 rounded-xl animate-gem-rotate shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-tl from-white/40 via-transparent to-transparent rounded-xl"></div>
              </div>
              <Gem className={`relative z-10 ${gemSizeClasses[size]} text-white animate-gem-pulse`} />
            </div>
          </div>

          {message && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1">
              {message}
              <span className="flex space-x-1 ml-1">
                <span className="w-1 h-1 bg-primary-500 rounded-full animate-bounce"></span>
                <span className="w-1 h-1 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1 h-1 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </span>
            </p>
          )}
        </div>
      </div>
    );
  }

  // Minimal loader (very compact)
  if (variant === "minimal") {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`absolute ${sizeClasses[size]} border-2 border-primary-300 dark:border-primary-600 rounded-full animate-rfid-pulse`}></div>
          </div>
          <div className={`relative z-10 ${sizeClasses[size]} bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl animate-spin-slow flex items-center justify-center shadow-lg`}>
            <Gem className={`${gemSizeClasses[size]} text-white`} />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SuspenseLoader;

