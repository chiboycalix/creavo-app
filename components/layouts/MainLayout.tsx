/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useState, useEffect } from 'react';
import ProfileCompletionManager from '../ProfileCompletionManager';
import SidebarSkeleton from '../sketetons/SidebarSkeleton';
import Header from './includes/Header';
import Sidebar from './includes/Sidebar';
import { NavItem, HeaderButton } from '@/types/navigation';
import { SidebarProvider } from '@/context/SidebarContext';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import {
  FolderOpen,
  Archive,
  Video,
  User,
  Shield,
  Sliders,
  Compass,
  CompassIcon,
  LightbulbIcon,
  Store,
  UserPlusIcon,
  PlusSquareIcon,
  TvMinimalPlay,
  Calendar,
  ChartAreaIcon
} from 'lucide-react';
import { shouldUseMainLayout } from '@/utils/path-utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { RiHome8Line, RiHome2Fill, RiHome8Fill } from "react-icons/ri";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const { loading, currentUser } = useAuth();
  const headerButtons: HeaderButton[] = [
    {
      id: 'socials',
      label: 'Explore',
      icon: CompassIcon,
      navItems: [
        { title: 'For You', href: '/socials', icon: Compass },
        { title: 'Following', href: '/socials/following', icon: UserPlusIcon },
        { title: 'Upload Post', href: '/socials/uploads', icon: PlusSquareIcon },
        { title: 'Watchlist', href: '/socials/watchlist', icon: TvMinimalPlay },
        {
          title: 'Profile', href: `/socials/profile`,
          icon: (
            <Avatar className="w-1 h-1">
              <AvatarImage src={currentUser ? currentUser?.avatar : "https://i.postimg.cc/Bv2nscWb/icon-default-avatar.png"} sizes='sm' />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
          )
        },
      ]
    },
    {
      id: 'studio',
      label: 'Studio',
      icon: LightbulbIcon,
      navItems: [
        { title: 'Dashboard', href: '/studio', icon: <RiHome8Fill size={20} /> },
        { title: 'Create course', href: '/studio/create-course', icon: PlusSquareIcon },
        { title: 'Module Management', href: '/studio/module-management', icon: PlusSquareIcon },
        { title: 'Calendar', href: '/studio/schedule', icon: Calendar },
        { title: 'Classroom & webinar', href: '/studio/meeting', icon: Video},
        { title: 'Analytics', href: '/studio/analytics', icon: ChartAreaIcon,
          children: [
            { title: 'Schedule', href: '/studio/meeting/schedule', icon: Calendar },
            { title: 'Join Meeting', href: '/studio/meeting/join', icon: Video },
            { title: 'Meeting History', href: '/studio/meeting/history', icon: Archive }
          ]
        }
      ]
    },
    {
      id: 'market',
      label: 'Marketplace',
      icon: Store,
      navItems: [
        { title: 'Profile', href: '/market', icon: User },
        { title: 'Security', href: '/market/security', icon: Shield },
        { title: 'Preferences', href: '/market/preferences', icon: Sliders }
      ]
    }
  ];

  const [currentNavItems, setCurrentNavItems] = useState<NavItem[]>(headerButtons[0].navItems);

  const findNavItemsForPath = (path: string) => {
    for (const button of headerButtons) {
      const matchingNavItem = button.navItems.find(item =>
        path.startsWith(item.href) ||
        (item.href.split('/')[1] === path.split('/')[1])
      );

      if (matchingNavItem) {
        return button.navItems;
      }
    }
    return headerButtons[0].navItems;
  };

  useEffect(() => {
    const navItems = findNavItemsForPath(pathname);
    setCurrentNavItems(navItems);
  }, [pathname, currentUser]);

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
          {
            loading ? <SidebarSkeleton /> : <Sidebar navItems={currentNavItems} />
          }

        </aside>

        <div className="flex-1 lg:ml-64">
          <header className="fixed top-0 right-0 left-0 lg:left-64 z-30">
            <Header
              onButtonClick={setCurrentNavItems}
              headerButtons={headerButtons}
            />
          </header>
          <main className="relative h-full mt-16 overflow-y-auto">
            <div className="p-0 sm:p-6">
              <ProfileCompletionManager />
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}