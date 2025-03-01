import { Checkbox } from "@/components/ui/check-box";

export const UserListItem = ({
  user,
  isSelected,
  onToggle
}: {
  user: any;
  isSelected: boolean;
  onToggle: () => void;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-200 rounded-full" />
      <div>
        <p className="font-medium">{user.username}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>
    <Checkbox
      checked={isSelected}
      onCheckedChange={onToggle}
      className="h-5 w-5"
    />
  </div>
);