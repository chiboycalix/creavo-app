import { Loader } from "lucide-react";
import React from "react";

export const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative flex flex-col items-center">
        <Loader className="w-16 h-16 text-white animate-spin" />
        <div className="flex gap-2 mt-4">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse animation-delay-0"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse animation-delay-200"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse animation-delay-400"></div>
        </div>
        <p className="mt-4 text-white text-lg font-medium animate-pulse-slow">
          Please wait
        </p>
      </div>
    </div>
  );
};