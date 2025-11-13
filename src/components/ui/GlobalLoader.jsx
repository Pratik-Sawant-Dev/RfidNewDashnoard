import React from 'react';
import { Radio } from 'lucide-react';

/**
 * Premium Global Loader Component
 * Features smooth gradient animations with soft, translucent colors
 */
const GlobalLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#E6F2FF]/60 via-white/50 to-[#FFE6E6]/60 dark:from-gray-950/70 dark:via-gray-900/60 dark:to-gray-950/70 backdrop-blur-md transition-opacity duration-300">
      {/* Premium Glass Card with Soft Shadows */}
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 md:p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/20 dark:border-gray-700/30 max-w-md w-full mx-4">
        {/* Soft Gradient Background Orbs */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#0077D4]/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#D60000]/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s', animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-[#8B3D8B]/8 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '0.75s' }}></div>
        </div>

        <div className="relative z-10 text-center">
          {/* Main Loader Animation */}
          <div className="relative inline-block mb-6">
            {/* Outer Pulsing Rings - Soft and Subtle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-32 h-32 border-2 border-[#0077D4]/15 dark:border-[#0077D4]/10 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
              <div className="absolute w-40 h-40 border-2 border-[#D60000]/15 dark:border-[#D60000]/10 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
              <div className="absolute w-48 h-48 border border-[#8B3D8B]/10 dark:border-[#8B3D8B]/5 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }}></div>
            </div>

            {/* Gradient Spinning Ring - Soft Gradient */}
            <div className="relative w-24 h-24 mx-auto">
              {/* Animated Gradient Overlay - Conic Gradient */}
              <div 
                className="absolute inset-0 rounded-full opacity-50 animate-spin"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0%, rgba(0,119,212,0.25) 25%, rgba(139,61,139,0.2) 50%, rgba(214,0,0,0.25) 75%, transparent 100%)',
                  animationDuration: '2s',
                }}
              >
                <div className="absolute inset-[3px] rounded-full bg-white dark:bg-gray-800 backdrop-blur-sm"></div>
              </div>
              
              {/* Secondary Soft Ring */}
              <div 
                className="absolute inset-0 rounded-full opacity-40 animate-spin"
                style={{
                  background: 'conic-gradient(from 180deg, transparent 0%, rgba(214,0,0,0.2) 25%, rgba(139,61,139,0.15) 50%, rgba(0,119,212,0.2) 75%, transparent 100%)',
                  animationDuration: '2.5s',
                  animationDirection: 'reverse',
                }}
              >
                <div className="absolute inset-[2px] rounded-full bg-white dark:bg-gray-800"></div>
              </div>
              
              {/* Center Soft Gradient Circle */}
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-[#0077D4]/65 via-[#8B3D8B]/55 to-[#D60000]/65 dark:from-[#0077D4]/75 dark:via-[#8B3D8B]/65 dark:to-[#D60000]/75 flex items-center justify-center shadow-xl backdrop-blur-md border border-white/30 dark:border-white/15">
                <Radio className="w-8 h-8 text-white/95 dark:text-white/95 drop-shadow-md animate-pulse" style={{ animationDuration: '1.5s' }} />
              </div>
            </div>

            {/* Floating Sparkles - Soft and Subtle */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-br from-[#0077D4]/40 to-[#D60000]/40 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }}></div>
            <div className="absolute -bottom-2 -left-2 w-2.5 h-2.5 bg-gradient-to-br from-[#D60000]/40 to-[#0077D4]/40 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.7s' }}></div>
            <div className="absolute top-1/2 -left-4 w-2 h-2 bg-gradient-to-br from-[#0077D4]/35 to-[#8B3D8B]/35 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 -right-4 w-2 h-2 bg-gradient-to-br from-[#D60000]/35 to-[#8B3D8B]/35 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '1.3s' }}></div>
          </div>

          {/* Loading Text with Soft Gradient */}
          <div className="mb-4">
            <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-3">
              {message}
            </h3>
            <div className="flex items-center justify-center space-x-1.5">
              <span className="w-2 h-2 bg-gradient-to-r from-[#0077D4]/60 to-[#0099FF]/60 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0s', animationDuration: '1.2s' }}></span>
              <span className="w-2 h-2 bg-gradient-to-r from-[#8B3D8B]/60 to-[#AA55AA]/60 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.2s', animationDuration: '1.2s' }}></span>
              <span className="w-2 h-2 bg-gradient-to-r from-[#D60000]/60 to-[#FF3333]/60 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.4s', animationDuration: '1.2s' }}></span>
            </div>
          </div>

          {/* Subtitle with Soft Color */}
          <p className="text-sm text-gray-600/80 dark:text-gray-400/80 font-medium">
            Please wait while we process your request
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
