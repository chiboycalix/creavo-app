"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NavItem } from "@/types/navigation";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { CrevoeLogo } from "@/public/assets";
import { NavItemComponent } from "./NavItem";
import { cn } from "@/lib/utils";

interface SidebarProps {
  navItems: NavItem[];
  dashboardItems: NavItem[];
}

export default function Sidebar({ navItems, dashboardItems }: SidebarProps) {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  const [dashboardMenu, setDashboardMenu] = useState<boolean>(false);
  const [isCommunityRoute, setIsCommunityRoute] = useState<boolean>(false);

  useEffect(() => {
    const communityRoutePattern = /^\/studio\/community\/[^/]+(\/[^/]+)?$/;
    setIsCommunityRoute(communityRoutePattern.test(window.location.pathname));
  }, [pathname]);

  useEffect(() => {
    const marketPath = pathname?.includes("/market");
    setDashboardMenu(marketPath);
  }, [pathname]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={`bg-white min-h-screen fixed top-0 left-0 bottom-0 z-50
        transform transition-transform duration-300 ease-in-out flex flex-col
        md:translate-x-0 ${isCommunityRoute ? "w-16" : "w-72"} ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="px-4 flex flex-col h-full">
          <ul className="flex-1">
            <div className="mb-6">
              <div
                className={cn("flex justify-start", isCommunityRoute && "mt-8")}
              >
                <Link href="/" className="relative">
                  <Image
                    width={144}
                    height={50}
                    src={
                      !isCommunityRoute
                        ? CrevoeLogo
                        : "/assets/crevoe-short.svg"
                    }
                    alt="Crevoe logo"
                    priority
                    style={{ width: "auto", height: "auto" }}
                    className="ml-2"
                  />
                </Link>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {navItems?.map((item, index) => {
                const tourClassMap: Record<string, string> = {
                  "/socials": "tour-for-you",
                  "/socials/following": "tour-following",
                  "/socials/uploads": "tour-upload",
                  "/socials/watchlist": "tour-watchlist",
                  "/socials/profile": "tour-profile",
                  // Studio routes
                  "/studio": "tour-studio-dashboard",
                  "/studio/course": "tour-studio-create",
                  "/studio/course-management": "tour-studio-manage",
                  "/studio/learners": "tour-studio-learners",
                  "/studio/calendar": "tour-studio-calendar",
                  "/studio/meeting": "tour-studio-meeting",
                  "/studio/community": "tour-studio-community",
                  "/studio/analytics": "tour-studio-analytics",
                  //market place route
                  "/market": "tour-market",
                  "/market/saved": "tour-market-saved",
                  "/market/notifications": "tour-market-notifications",
                  // "/market/seller-dashboard":"tour-market-seller-dashboard",
                };

                const className = tourClassMap[item.href] || "";

                return (
                  <li key={index} className={className}>
                    <NavItemComponent
                      item={item}
                      pathname={pathname}
                      showText={!isCommunityRoute}
                    />
                  </li>
                );
              })}

              {dashboardMenu && !isCommunityRoute && (
                <>
                  <div className="mt-4 mb-3 pl-4 font-medium text-sm">
                    Your Account
                  </div>
                  {dashboardItems?.map((item, index) => (
                    <li id="tour-market-seller-dashboard" key={index}>
                      <NavItemComponent
                        item={item}
                        pathname={pathname}
                        showText={!isCommunityRoute}
                      />
                    </li>
                  ))}
                </>
              )}
            </div>
          </ul>

          {!isCommunityRoute && (
            <>
              <div className="border-b mx-3 my-6" />
              <div className="mt-4 px-3 text-[11px] text-gray-500">
                <ul className="flex flex-wrap gap-x-5 items-start text-gray-600 gap-y-3 my-2.5">
                  <Link href="/company">
                    <li className="hover:font-medium cursor-pointer transition-all">
                      Company
                    </li>
                  </Link>
                  <Link href="/about">
                    <li className="hover:font-medium cursor-pointer transition-all">
                      About
                    </li>
                  </Link>
                  <Link href="/contact">
                    <li className="hover:font-medium cursor-pointer transition-all">
                      Contact
                    </li>
                  </Link>
                </ul>
                <ul className="flex flex-wrap gap-x-5 items-start text-gray-600 gap-y-3 my-2.5">
                  <Link href="/help">
                    <li className="hover:font-medium cursor-pointer transition-all">
                      Help
                    </li>
                  </Link>
                  <Link href="/safety">
                    <li className="hover:font-medium cursor-pointer transition-all">
                      Safety
                    </li>
                  </Link>

                  <Link href="/privacy">
                    <li className="hover:font-medium cursor-pointer transition-all">
                      Privacy Center
                    </li>
                  </Link>
                  <Link href="/terms-policies">
                    <li className="text-xs hover:font-medium cursor-pointer transition-all">
                      Terms & Policies
                    </li>
                  </Link>
                  <Link href="/community-guidelines">
                    <li className="text-xs hover:font-medium cursor-pointer transition-all">
                      Community Guidelines
                    </li>
                  </Link>
                </ul>
                <p className="mt-2">© 2025 CREVOE</p>
              </div>
            </>
          )}

          <div className="pb-6" />
        </nav>
      </aside>
    </>
  );
}
