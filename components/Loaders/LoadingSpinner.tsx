// app/components/LoadingSpinner.tsx
import React from "react";

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      {/* Animated Loader Container */}
      <div className="relative w-8 h-8">
        {/* Faster Rotating Outer Ring */}
        <div className="absolute inset-0 animate-[spin_0.5s_linear_infinite] rounded-full border-4 border-t-blue-600 border-b-transparent border-l-blue-50 border-r-blue-50"></div>
      </div>
    </div>
  );
};
