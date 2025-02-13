import React from 'react';

const NotificationSkeleton = () => {
  return (
    <div className="divide-y divide-gray-200">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="flex items-center justify-between py-3 px-4">
          <div className="flex items-center space-x-3">
            {/* Avatar skeleton */}
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />

            <div className="flex flex-col space-y-2">
              {/* Name and action skeleton */}
              <div className="flex items-center space-x-1">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Timestamp skeleton */}
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Button skeleton */}
          <div className="h-7 w-20 bg-gray-200 rounded-md animate-pulse" />
        </div>
      ))}
    </div>
  );
};

export default NotificationSkeleton;