"use client";

export function CommunityHeaderSkeleton() {
  return (
    <div className="flex items-center space-x-2 pt-2 pb-4 mb-6 border-b">
      <div className="rounded-full h-10 w-10 bg-gray-200"></div>
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
    </div>
  );
}

export function CommunitySidebarSkeleton() {
  return (
    <div className="rounded-md h-[88vh] bg-white w-64 p-4">
      <CommunityHeaderSkeleton />

      <div className="space-y-2">
        <div className="inline-flex justify-between items-center gap-4 w-full">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
        </div>

        {/* Spaces loading */}
        <div className="py-2 space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 w-full bg-gray-100 rounded-md"></div>
          ))}
        </div>
      </div>
    </div>
  );
}