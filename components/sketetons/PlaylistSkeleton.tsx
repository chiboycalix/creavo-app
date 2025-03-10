export const PlaylistSkeleton = () => {
  return (
    <div className="w-full h-[23rem] flex flex-col rounded-md overflow-hidden border animate-pulse">
      {/* Image/Video Placeholder */}
      <div className="w-full h-60 bg-gray-300" />

      {/* Content Placeholder */}
      <div className="flex-1 flex flex-col justify-between p-3">
        <div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-300 rounded w-1/2" />
          <div className="flex items-center justify-between mt-2">
            <div className="h-3 bg-gray-300 rounded w-1/3" />
            <div className="h-3 bg-gray-300 rounded w-1/4" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="h-4 bg-gray-300 rounded w-1/3" />
          <div className="h-6 bg-gray-300 rounded w-16" />
        </div>
      </div>
    </div>
  );
};