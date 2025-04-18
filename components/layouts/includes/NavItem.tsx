import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { NavItem } from '@/types/navigation';
import { cn } from '@/lib/utils';

export const NavItemComponent = ({
  item,
  pathname,
  level = 0,
  showText = true,
}: {
  item: NavItem;
  pathname: string;
  level?: number;
  showText?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isActive = pathname === item.href;
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  return (
    <>
      <div className="relative">
        <Link
          href={hasChildren ? '#' : item.href}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }
          }}
          className={cn(`group flex items-center justify-between
            px-4 mb-2 py-2 rounded-lg hover:bg-primary-500
            hover:text-white transition-colors ${isActive ? "bg-primary-700" : ""}`, !showText && "justify-center items-center text-center")}
          style={{ paddingLeft: showText ? `${level * 12 + 16}px` : `${level * 12 + 8}px` }}
        >
          <div className="flex items-center justify-center">
            <div className={showText ? "mr-3" : "mr-0 flex items-center justify-center"}>
              {React.isValidElement(Icon) ? (
                React.cloneElement(Icon as React.ReactElement<any>, {
                  className: `${isActive ? "text-white" : "text-gray-500 group-hover:text-white"}`,
                })
              ) : Icon ? (
                <Icon
                  size={20}
                  className={`${isActive ? "text-white" : "text-gray-500 group-hover:text-white"}`}
                />
              ) : null}
            </div>
            {showText && (
              <span
                className={isActive
                  ? "text-white font-medium"
                  : "text-gray-700 group-hover:text-white"}
              >
                {item.title}
              </span>
            )}
          </div>
          {hasChildren && showText && (
            <div className="flex items-center">
              {isExpanded ? (
                <ChevronUp className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500 group-hover:text-white"}`} />
              ) : (
                <ChevronDown className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500 group-hover:text-white"}`} />
              )}
            </div>
          )}
        </Link>
      </div>
      {hasChildren && isExpanded && showText && (
        <div className="ml-4">
          {item?.children!.map((child, index) => (
            <NavItemComponent
              key={index}
              item={child}
              pathname={pathname}
              level={level + 1}
              showText={showText}
            />
          ))}
        </div>
      )}
    </>
  );
};