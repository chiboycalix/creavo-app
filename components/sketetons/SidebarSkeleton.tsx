import React from "react";

export default function SidebarSkeleton() {
  return (
    <aside className="bg-white w-64 min-h-screen fixed top-0 left-0 bottom-0 z-50 flex flex-col">
      <nav className="px-4">
        {/* Logo Skeleton */}
        <div className="mb-6">
          <div className="flex justify-start">
            <div className="w-36 h-12 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Nav Items Skeleton */}
        <div className="flex-1 overflow-y-auto">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center px-4 mb-2 py-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse mr-3"></div>
              <div className="w-32 h-4 bg-gray-300 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Divider Skeleton */}
        <div className="border-b mx-3 my-6 bg-gray-300 animate-pulse"></div>

        {/* Footer Links Skeleton */}
        <div className="mt-4 px-3 text-[11px] text-gray-500">
          <ul className="flex flex-wrap gap-x-5 items-start text-gray-600 gap-y-3 my-2.5">
            {[...Array(3)].map((_, index) => (
              <li key={index} className="w-16 h-4 bg-gray-300 rounded animate-pulse"></li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-x-5 items-start text-gray-600 gap-y-3 my-2.5">
            {[...Array(5)].map((_, index) => (
              <li key={index} className="w-20 h-4 bg-gray-300 rounded animate-pulse"></li>
            ))}
          </ul>

          {/* Copyright Skeleton */}
          <div className="w-24 h-4 bg-gray-300 rounded animate-pulse mt-2"></div>
        </div>

        {/* Bottom Padding Skeleton */}
        <div className="pb-6"></div>
      </nav>
    </aside>
  );
}