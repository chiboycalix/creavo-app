"use client";
import React, { useState, useEffect } from "react";
import SidebarSkeleton from "../sketetons/SidebarSkeleton";
import Header from "./includes/Header";
import Sidebar from "./includes/Sidebar";
import CustomImageIcon from "../CustomImageIcon";
import SimpleLayout from "./includes/SimpleLayout";
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
  Users2,
} from "lucide-react";
import { shouldUseMainLayout } from "@/utils/path-utils";
import { RiHome8Fill } from "react-icons/ri";
import { useUserProfile } from "@/hooks/useUserProfile";
import { cn } from "@/lib/utils";
import Footer from "./includes/Footer";
import { ROUTES } from "@/constants/routes";
import { useListMemberCommunities } from "@/hooks/communities/useListMemberCommunities";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading, currentUser } = useAuth();
  const [isCommunityRoute, setIsCommunityRoute] = useState<boolean>(false);
  const { data: profileData, isLoading: profileLoading } = useUserProfile(currentUser?.id);
  const { data: communities, isLoading: isFetchingCommunity } = useListMemberCommunities(profileData && profileData?.data?.id)

  useEffect(() => {
    const communityRoutePattern = /^\/studio\/community\/[^/]+(\/[^/]+)?$/;
    setIsCommunityRoute(communityRoutePattern.test(window.location.pathname));
  }, [pathname]);

  const defaultAvatar = "https://i.postimg.cc/Bv2nscWb/icon-default-avatar.png";
  const avatarUrl = profileLoading
    ? defaultAvatar
    : profileData?.data?.profile?.avatar || defaultAvatar;

  const headerButtons: HeaderButton[] = React.useMemo(
    () => [
      {
        id: "socials",
        label: "Explore",
        icon: CompassIcon,
        navItems: [
          { title: "For You", href: "/socials", icon: Compass },
          { title: "Following", href: "/socials/following", icon: UserPlusIcon },
          { title: "Upload Post", href: "/socials/uploads", icon: PlusSquareIcon },
          { title: "Watchlist", href: "/socials/watchlist", icon: TvMinimalPlay },
          ...(communities && communities?.data?.communities?.length > 0
            ? [{ title: "Community", href: "/socials/community", icon: Users2 }]
            : []),
          {
            title: "Profile",
            href: `/socials/profile`,
            icon: (
              <CustomImageIcon
                imageUrl={avatarUrl}
                className="rounded-full w-6 h-6"
                alt="Profile Avatar"
              />
            ),
          },
        ],
      },
      {
        id: "studio",
        label: "Studio",
        icon: LightbulbIcon,
        navItems: [
          { title: "Dashboard", href: "/studio", icon: <RiHome8Fill size={20} /> },
          { title: "Create course", href: "/studio/course", icon: PlusSquareIcon },
          { title: "Course Management", href: "/studio/course-management", icon: BoxesIcon },
          { title: "Learners", href: "/studio/learners", icon: User },
          { title: "Calendar", href: "/studio/calendar", icon: Calendar },
          {
            title: "Event",
            href: "/studio/meeting",
            icon: Video,
            children: [
              { title: "Video conference", href: "/studio/event/meeting" },
              { title: "Classroom", href: "/studio/event/classroom" },
            ],
          },
          { title: "Community", href: "/studio/community", icon: Users2 },
          {
            title: "Analytics",
            href: "/studio/analytics",
            icon: ChartAreaIcon,
            children: [
              { title: "Overview", href: "/studio/analytics/overview" },
              { title: "Sales Metrics", href: "/studio/analytics/sales-metrics" },
              { title: "Engagement Metrics", href: "/studio/analytics/engagement-metrics" },
              { title: "Revenue and ROI", href: "/studio/analytics/revenue-and-roi" },
              { title: "Feedback", href: "/studio/analytics/feedback" },
            ],
          },
        ],
      },
      {
        id: "market",
        label: "Marketplace",
        icon: Store,
        navItems: [
          { title: "Explore", href: ROUTES?.MARKET.EXPLORE, icon: CompassIcon },
          { title: "Saved", href: ROUTES?.MARKET.SAVED, icon: Bookmark },
          { title: "Notifications", href: "/market/notifications", icon: BellIcon },
        ],
        dashboardItems: [
          { title: "Seller dashboard", href: ROUTES?.MARKET.SELLER_DASHBOARD, icon: LayoutDashboardIcon },
        ],
      },
    ],
    [avatarUrl, communities]
  );

  const [currentNavItems, setCurrentNavItems] = useState<NavItem[]>(headerButtons[0].navItems);
  const [currentDashboardItems, setCurrentdashboardItems] = useState<NavItem[]>(
    headerButtons[2]?.dashboardItems || []
  );

  const findNavItemsForPath = React.useCallback(
    (path: string) => {
      for (const button of headerButtons) {
        const matchingNavItem = button.navItems.find((item) => {
          if (path.startsWith(item.href)) {
            return true;
          }
          if (item.children) {
            return item.children.some((child) => path.startsWith(child.href));
          }
          return false;
        });

        if (matchingNavItem) {
          return button.navItems;
        }
      }
      return headerButtons[0].navItems;
    },
    [headerButtons]
  );

  useEffect(() => {
    const navItems = findNavItemsForPath(pathname);
    setCurrentNavItems(navItems);
  }, [pathname, findNavItemsForPath]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const useMainLayout = shouldUseMainLayout(pathname || "");

  if (!useMainLayout) {
    return (<SimpleLayout>{children} </SimpleLayout>)
  }

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <aside className="fixed left-0 top-0 h-full z-50">
          {loading || isFetchingCommunity ? <SidebarSkeleton /> : <Sidebar navItems={currentNavItems} dashboardItems={currentDashboardItems} />}
        </aside>

        <div className={`flex-1 ${isCommunityRoute ? "lg:ml-16" : "lg:ml-72"} flex flex-col relative`}>
          <header className={`fixed top-0 right-0 z-30 ${isCommunityRoute ? "left-16" : "left-0 lg:left-72"}`}>
            <Header
              onButtonClick={setCurrentNavItems}
              headerButtons={headerButtons}
            />
          </header>

          <main className="flex-1 mt-16 overflow-y-auto">
            <div
              className={cn(
                "p-0",
                pathname === "/socials" || pathname === "/socials/following"
                  ? "py-0 md:py-6 sm:px-16"
                  : "sm:p-12",
                "pb-[60px] md:pb-0"
              )}
            >
              {children}
            </div>
          </main>

          <footer className="fixed bottom-0 left-0 right-0 z-20 block md:hidden">
            <Footer
              onButtonClick={setCurrentNavItems}
              headerButtons={headerButtons}
            />
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}