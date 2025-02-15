import React from 'react'

const SocialPostSkeleton = () => {
  return (
    <div className="max-w-xl bg-white rounded-xl overflow-hidden animate animate-pulse sm:mb-10 mb-0">
      <div className="relative">
        {/* Basic Badge Skeleton */}
        <div className="absolute top-4 left-4 z-10">
          <div className="h-6 w-16 bg-slate-500 rounded-full animate-pulse" />
        </div>

        {/* Main Image Skeleton */}
        <div className="aspect-[12.5/16] relative bg-slate-400 animate-pulse" />

        {/* Metrics Skeleton */}
        <div className="absolute right-4 bottom-40 flex flex-col gap-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 bg-slate-500/80 backdrop-blur rounded-full animate-pulse" />
              <div className="w-8 h-4 bg-slate-500/80 backdrop-blur rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Profile Section Skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              {/* Profile Picture Skeleton */}
              <div className="w-[70px] h-[55px] bg-slate-500 rounded-full animate-pulse" />

              <div>
                {/* Username and Name Skeleton */}
                <div className="flex items-center gap-2">
                  <div className="h-4 w-20 bg-slate-500 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-slate-500 rounded animate-pulse" />
                </div>

                {/* Tags Skeleton */}
                <div className="flex flex-wrap gap-2 mt-1">
                  {[...Array(8)].map((_, index) => (
                    <div
                      key={index}
                      className="h-4 w-16 bg-slate-500 rounded animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Follow Button Skeleton */}
            <div className="h-10 w-24 bg-slate-500 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialPostSkeleton