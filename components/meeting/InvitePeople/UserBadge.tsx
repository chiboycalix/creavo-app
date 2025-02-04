import { X } from "lucide-react";

export const UserBadge = ({
  label,
  onRemove
}: {
  label: string;
  onRemove: () => void;
}) => (
  <div className="flex items-center gap-1 bg-primary-100 text-primary-900 px-2 py-1 rounded-full text-sm">
    <span>{label}</span>
    <button
      onClick={onRemove}
      className="hover:bg-primary-200 rounded-full p-0.5"
    >
      <X className="w-3 h-3" />
    </button>
  </div>
);