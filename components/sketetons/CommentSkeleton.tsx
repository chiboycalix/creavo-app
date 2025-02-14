import { Skeleton } from "@/components/ui/skeleton";

function CommentSkeleton() {
  return (
    <div className="animate-pulse flex gap-3 p-4">
      {/* Avatar */}
      <Skeleton className="w-10 h-10 rounded-full" />

      <div className="flex-1 space-y-2">
        {/* Name & Date */}
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/4 rounded-md" />
          <Skeleton className="h-3 w-1/6 rounded-md" />
        </div>

        {/* Comment Body */}
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-3/4 rounded-md" />

        {/* Action Buttons */}
        <div className="flex gap-6 mt-3 justify-end">
          <Skeleton className="h-4 w-4 rounded-md" />
          <Skeleton className="h-4 w-4 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default CommentSkeleton;
