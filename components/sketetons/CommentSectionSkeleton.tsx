import CommentSkeleton from "./CommentSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommentSectionSkeleton() {
  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <CommentSkeleton key={index} />
        ))}
      </div>

      <div className="w-full p-4">
        <div className="flex items-center gap-2 w-full">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
