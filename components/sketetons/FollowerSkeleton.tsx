const FollowerSkeleton = ({ count }: { count: number }) => {
  return (
    <div className="mt-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center gap-2 mb-4 animate-pulse">
          <div className="w-[30px] h-[30px] rounded-full bg-gray-300" />
          <div className="flex flex-col">
            <div className="w-24 h-4 bg-gray-300 rounded-md mb-1" />
            <div className="w-16 h-3 bg-gray-300 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowerSkeleton;