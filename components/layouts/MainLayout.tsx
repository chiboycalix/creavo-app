'use client';

import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/context/SidebarContext';
import Sidebar from './includes/Sidebar';
import Header from './includes/Header';
import { NavItem, HeaderButton } from '@/types/navigation';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Home,
  BarChart,
  FileText,
  FolderKanban,
  FolderOpen,
  Archive,
  Video,
  Settings,
  User,
  Shield,
  Sliders
} from 'lucide-react';
import { shouldUseMainLayout } from '@/utils/path-utils';

// Define header buttons at the top level so it can be used in multiple places
export const headerButtons: HeaderButton[] = [
  {
    id: 'socials',
    label: 'Socials',
    icon: LayoutDashboard,
    navItems: [
      { title: 'Overview', href: '/socials', icon: Home },
      { title: 'Analytics', href: '/socials/analytics', icon: BarChart },
      { title: 'Reports', href: '/socials/reports', icon: FileText }
    ]
  },
  {
    id: 'studio',
    label: 'Studio',
    icon: FolderKanban,
    navItems: [
      { title: 'All Projects', href: '/studio', icon: FolderOpen },
      { title: 'Active', href: '/studio/active', icon: FolderOpen },
      { title: 'Archived', href: '/studio/archived', icon: Archive },
      { title: 'Video conferencing', href: '/studio/meeting', icon: Video }
    ]
  },
  {
    id: 'market',
    label: 'Market Place',
    icon: Settings,
    navItems: [
      { title: 'Profile', href: '/market', icon: User },
      { title: 'Security', href: '/market/security', icon: Shield },
      { title: 'Preferences', href: '/market/preferences', icon: Sliders }
    ]
  }
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const { loading } = useAuth();
  const [currentNavItems, setCurrentNavItems] = useState<NavItem[]>(headerButtons[0].navItems);

  // Function to find the appropriate nav items based on the current path
  const findNavItemsForPath = (path: string) => {
    for (const button of headerButtons) {
      // Check if the current path starts with any of the nav item paths
      const matchingNavItem = button.navItems.find(item =>
        path.startsWith(item.href) ||
        // Special case for root paths like /studio, /socials, /market
        (item.href.split('/')[1] === path.split('/')[1])
      );

      if (matchingNavItem) {
        return button.navItems;
      }
    }
    // Default to socials if no match found
    return headerButtons[0].navItems;
  };

  // Update sidebar nav items when pathname changes or on initial load
  useEffect(() => {
    const navItems = findNavItemsForPath(pathname);
    setCurrentNavItems(navItems);
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const useMainLayout = shouldUseMainLayout(pathname || '');

  if (!useMainLayout) {
    return <div>{children}</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 pb-14 overflow-hidden">
        <aside className="fixed left-0 top-0 h-full z-50">
          <Sidebar navItems={currentNavItems} />
        </aside>

        <div className="flex-1 lg:ml-64">
          <header className="fixed top-0 right-0 left-0 lg:left-64 z-30">
            <Header
              onButtonClick={setCurrentNavItems}
              headerButtons={headerButtons}  // Pass headerButtons to Header
            />
          </header>
          <main className="relative h-full mt-16 overflow-y-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}