"use client"
import { HeaderButton, NavItem } from '@/types/navigation';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'

interface FooterProps {
  onButtonClick: (navItems: NavItem[]) => void;
  headerButtons: HeaderButton[];
}

const Footer = ({ onButtonClick, headerButtons }: FooterProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isButtonActive = (navItems: NavItem[]) => {
    return navItems.some((item) => pathname.startsWith(item.href));
  };

  return (
    <div className={`bg-white shadow-md border py-3`}>
      <div className=" md:hidden flex items-center justify-center space-x-0 basis-4/12">
        {headerButtons.map((button) => {
          const isActive = isButtonActive(button.navItems);
          const Icon = button.icon;
          return (
            <button
              key={button.id}
              onClick={() => {
                onButtonClick(button.navItems);
                const firstRoute = button.navItems[0].href;
                router.push(firstRoute);
              }}
              className={`p-2 sm:px-3 lg:px-4 lg:py-2 rounded-lg transition-all flex flex-col items-center space-x-2 space-y-0`}
            >
              <div
                className={`px-6 rounded-full py-1.5 ${isActive ? "bg-primary-700" : "bg-gray-100"
                  }`}
              >
                <Icon
                  size={20}
                  className={`${isActive ? "text-white" : "text-gray-500"
                    } transition-colors`}
                />
              </div>
              <span
                className={`${isActive ? "text-primary-500" : "text-gray-700"
                  } text-sm hidden lg:inline transition-colors`}
              >
                {button.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  )
}

export default Footer