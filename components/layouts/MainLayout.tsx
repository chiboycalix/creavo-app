/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import SidebarSkeleton from "../sketetons/SidebarSkeleton";
import Header from "./includes/Header";
import Sidebar from "./includes/Sidebar";
import { NavItem, HeaderButton } from "@/types/navigation";
import { SidebarProvider } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import {
  Video,
  User,
  Compass,
  CompassIcon,
  LightbulbIcon,
  Store,
  UserPlusIcon,
  PlusSquareIcon,
  TvMinimalPlay,
  Calendar,
  ChartAreaIcon,
  LayoutDashboardIcon,
  BellIcon,
  Bookmark,
  BoxesIcon,
  Users2
} from "lucide-react";
import { shouldUseMainLayout } from "@/utils/path-utils";
import { RiHome8Fill } from "react-icons/ri";
import { useUserProfile } from "@/hooks/useUserProfile";
import CustomImageIcon from "../CustomImageIcon";
import { cn } from "@/lib/utils";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { loading, currentUser } = useAuth();
  const { data: profileData } = useUserProfile(currentUser?.id);
  const [isCommunityRoute, setIsCommunityRoute] = useState<boolean>(false);

  useEffect(() => {
    const communityRoutePattern = /^\/studio\/community\/[^/]+$/;
    setIsCommunityRoute(communityRoutePattern.test(pathname || ""));

  }, [pathname]);

  const headerButtons: HeaderButton[] = React.useMemo(() => [
    {
      id: "socials",
      label: "Explore",
      icon: CompassIcon,
      navItems: [
        { title: "For You", href: "/socials", icon: Compass },
        { title: "Following", href: "/socials/following", icon: UserPlusIcon },
        { title: "Upload Post", href: "/socials/uploads", icon: PlusSquareIcon },
        { title: "Watchlist", href: "/socials/watchlist", icon: TvMinimalPlay },
        {
          title: "Profile",
          href: `/socials/profile`,
          icon: <CustomImageIcon
            imageUrl={profileData?.data
              ? profileData?.data?.profile?.avatar
              : "https://i.postimg.cc/Bv2nscWb/icon-default-avatar.png"}
            className="rounded-full"
            alt="Custom Image"

          />
        },
      ],
    },
    {
      id: "studio",
      label: "Studio",
      icon: LightbulbIcon,
      navItems: [
        { title: 'Dashboard', href: '/studio', icon: <RiHome8Fill size={20} /> },
        { title: 'Create course', href: '/studio/course', icon: PlusSquareIcon },
        { title: 'Course Management', href: '/studio/course-management', icon: BoxesIcon },
        { title: 'Learners', href: '/studio/learners', icon: User },
        { title: 'Calendar', href: '/studio/calendar', icon: Calendar },
        {
          title: 'Event', href: '/studio/meeting', icon: Video,
          children: [
            { title: 'Video conference', href: '/studio/event/meeting' },

            { title: 'Classroom', href: '/studio/event/classroom' },
          ]
        },
        { title: 'Community', href: '/studio/community', icon: Users2 },
        {
          title: "Analytics",
          href: "/studio/analytics",
          icon: ChartAreaIcon,
          children: [
            { title: 'Overview', href: '/studio/analytics/overview' },
            { title: 'Sales Metrics', href: '/studio/analytics/sales-metrics' },
            { title: 'Engagement Metrics', href: '/studio/analytics/engagement-metrics' },
            { title: 'Revenue and ROI', href: '/studio/analytics/revenue-and-ROI' },
            { title: 'Feedback', href: '/studio/analytics/feedback' },
          ]
        }
      ]
    },
    {
      id: "market",
      label: "Marketplace",
      icon: Store,
      navItems: [
        { title: "Explore", href: "/market", icon: CompassIcon },
        { title: "Saved", href: "/market/saved", icon: Bookmark },
        { title: "Notifications", href: "/market/notifications", icon: BellIcon },
      ],
      dashboardItems: [
        { title: "Seller dashboard", href: "/market/seller-dashboard", icon: LayoutDashboardIcon },
      ]
    }
  ], [currentUser]);

  const [currentNavItems, setCurrentNavItems] = useState<NavItem[]>(headerButtons[0].navItems);
  const [currentDashboardItems, setCurrentdashboardItems] = useState<NavItem[]>(headerButtons[2]?.dashboardItems || []);

  const findNavItemsForPath = React.useCallback((path: string) => {
    for (const button of headerButtons) {
      const matchingNavItem = button.navItems.find(item => {
        if (path.startsWith(item.href)) {
          return true;
        }
        if (item.children) {
          return item.children.some(child => path.startsWith(child.href));
        }
        return false;
      });

      if (matchingNavItem) {
        return button.navItems;
      }
    }
    return headerButtons[0].navItems;
  }, [headerButtons]);

  useEffect(() => {
    const navItems = findNavItemsForPath(pathname);
    setCurrentNavItems(navItems);
  }, [pathname, currentUser, findNavItemsForPath]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const useMainLayout = shouldUseMainLayout(pathname || "");
  console.log({ pathname })
  if (!useMainLayout) {
    return <div>{children}</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 pb-14 overflow-hidden">
        <aside className="fixed left-0 top-0 h-full z-50">
          {loading ? <SidebarSkeleton /> : <Sidebar navItems={currentNavItems} dashboardItems={currentDashboardItems} />}
        </aside>

        <div className={`flex-1 ${isCommunityRoute ? "lg:ml-16" : "lg:ml-72"}`}>
          <header className={`fixed top-0 right-0 z-30 ${isCommunityRoute ? "left-16" : "left-0 lg:left-72"}`}>
            <Header
              onButtonClick={setCurrentNavItems}
              headerButtons={headerButtons}
            />
          </header>
          <main className="relative h-full mt-16 overflow-y-auto">
            <div className={cn("p-0", pathname === "/socials" || pathname === "/socials/following" ? "sm:py-6 sm:px-16" : "sm:p-12")}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}