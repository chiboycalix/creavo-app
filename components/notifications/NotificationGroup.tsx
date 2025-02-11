import { FC } from 'react';

interface NotificationGroupProps {
  title: string;
  children: React.ReactNode;
}

export const NotificationGroup: FC<NotificationGroupProps> = ({ title, children }) => {
  return (
    <div className="py-2">
      <h3 className="px-4 py-2 text-sm font-medium text-gray-600">{title}</h3>
      <div className="divide-y divide-gray-100">
        {children}
      </div>
    </div>
  );
};