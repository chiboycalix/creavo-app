// app/components/RouterSpinner.tsx
import React from 'react';

export const RouterSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="flex flex-col justify-center items-center">
        {/* Animated Loader Container */}
        <div className="relative w-32 h-32">
          {/* Pulsating Background */}
          <div className="absolute inset-0 rounded-full bg-blue-600 opacity-20 animate-ping"></div>

          {/* Rotating Outer Ring */}
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-t-blue-600 border-b-transparent border-l-blue-50 border-r-blue-50"></div>

          {/* Center Glow Effect */}
          <div className="absolute inset-2 rounded-full bg-white shadow-lg shadow-blue-800"></div>

          {/* Logo in the Center */}
          <div className="absolute inset-4 flex justify-center items-center rounded-full">
            <div className="p-2 bg-white rounded-full">
              <img
                src="/assets/crevoe.svg"
                alt="App Logo"
                className="w-16"
                aria-label="Loading Logo"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};