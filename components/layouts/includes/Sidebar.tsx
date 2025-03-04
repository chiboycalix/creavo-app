"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NavItem } from "@/types/navigation";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { CrevoeLogo } from "@/public/assets";
import { NavItemComponent } from "./NavItem";

interface SidebarProps {
  navItems: NavItem[];
  dashboardItems: NavItem[];
}

export default function Sidebar({ navItems, dashboardItems }: SidebarProps) {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  const [dashboardMenu, setDashboardMenu] = useState<boolean>(false);

  useEffect(() => {
    const marketPath = window?.location?.pathname?.includes("/market");
    const checkPath = () => {
      if (typeof window !== "undefined" && marketPath) {
        setDashboardMenu(true);
      } else setDashboardMenu(false);
    };
    checkPath();
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
        className={`bg-white w-72 min-h-screen fixed top-0 left-0 bottom-0 z-50
        transform transition-transform duration-300 ease-in-out flex flex-col
        md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <nav className="px-4">
          <ul className="">
            <div className="mb-6">
              <div className="flex justify-start">
                <Link href="/" className="relative">
                  <Image
                    width={144}
                    height={50}
                    src={CrevoeLogo}
                    alt="Crevoe logo"
                    priority
                    style={{ width: "auto", height: "auto" }}
                  />
                </Link>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {navItems?.map((item, index) => (
                <li key={index}>
                  <NavItemComponent item={item} pathname={pathname} />
                </li>
              ))}
              {dashboardMenu && (
                <>
                  <div className="mt-4 mb-3 pl-4 font-bold">Your Account</div>
                  {dashboardItems?.map((item, index) => (
                    <li key={index}>
                      <NavItemComponent item={item} pathname={pathname} />
                    </li>
                  ))}
                </>
              )}
            </div>
          </ul>

          <div className="border-b mx-3 my-6" />

          <div className="mt-4 px-3 text-[11px] text-gray-500">
            <ul className="flex flex-wrap gap-x-5 items-start text-gray-600 gap-y-3 my-2.5">
              <li className="hover:font-medium cursor-pointer transition-all">
                Company
              </li>
              <li className="hover:font-medium cursor-pointer transition-all">
                About
              </li>
              <li className="hover:font-medium cursor-pointer transition-all">
                Contact
              </li>
            </ul>
            <ul className="flex flex-wrap gap-x-5 items-start text-gray-600 gap-y-3 my-2.5">
              <li className="hover:font-medium cursor-pointer transition-all">
                Help
              </li>
              <li className="hover:font-medium cursor-pointer transition-all">
                Safety
              </li>
              <li className="hover:font-medium cursor-pointer transition-all">
                Privacy Center
              </li>
              <li className="text-xs hover:font-medium cursor-pointer transition-all">
                Terms & Policies
              </li>
              <li className="text-xs hover:font-medium cursor-pointer transition-all">
                Community Guidelines
              </li>
            </ul>

            <p className="mt-2">© 2025 CREVOE</p>
          </div>

          <div className="pb-6" />
        </nav>
      </aside>
    </>
  );
}
