import React from "react";

export default function SocialPostSkeleton() {
  return (
    <div className="flex items-end gap-4 w-full md:max-w-xl mx-auto h-full mb-0">
      {/* Main Post Container */}
      <div className="bg-gray-200 text-white sm:rounded-xl rounded-none overflow-hidden flex-grow">
        <div className="relative">
          {/* Main Image Skeleton */}
          <div className="aspect-[12.5/16] relative bg-gray-300 animate-pulse"></div>

          {/* Metrics - Mobile & Tablet Skeleton */}
          <div className="absolute right-4 bottom-10 flex flex-col gap-1 lg:hidden">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex flex-col items-center mb-4">
                <div className="w-8 h-8 bg-gray-400 rounded-full animate-pulse"></div>
                <span className="w-4 h-4 bg-gray-400 mt-1 rounded-full animate-pulse"></span>
              </div>
            ))}
          </div>

          {/* Profile Section Skeleton */}
          <div className="absolute w-[80%] md:w-full bottom-2 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 pt-4">
                  <div className="w-24 h-6 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-20 h-6 bg-gray-400 rounded-full animate-pulse"></div>
                </div>
                <div className="relative w-full">
                  <div className="flex flex-wrap gap-2 mt-1">
                    <div className="w-full h-4 bg-gray-400 rounded-full animate-pulse"></div>
                    {[...Array(3)].map((_, index) => (
                      <span key={index} className="w-12 h-4 bg-gray-400 rounded-full animate-pulse"></span>
                    ))}
                  </div>
                  <div className="w-16 h-4 bg-gray-400 mt-1 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics - Desktop Skeleton */}
      <div className="hidden lg:flex flex-col h-full justify-center mb-10">
        <div className="flex flex-col gap-4 mt-auto">
          <div className="w-8 h-8 bg-gray-400 rounded-full animate-pulse"></div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex flex-col items-center mb-0">
              <div className="w-8 h-8 bg-gray-400 rounded-full animate-pulse"></div>
              <span className="w-4 h-4 bg-gray-400 mt-1 rounded-full animate-pulse"></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}