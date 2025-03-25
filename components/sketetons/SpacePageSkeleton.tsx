"use client";

export default function SpacePageSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b p-4 shadow-md shadow-primary-50 flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-3 w-48 bg-gray-200 rounded"></div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="p-4 py-10 bg-gray-100 w-[50%] mx-auto mt-20 rounded-md flex items-center flex-col space-y-4">
        <div className="h-4 w-64 bg-gray-300 rounded"></div>
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}