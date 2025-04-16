"use client";

import Link from "next/link";
import Image from "next/image";
import NotificationsPopover from "@/components/notifications";
import QuickActions from "@/components/quickactions";
import { Input } from "@/components/Input";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Search,
  ChevronDown,
  X,
  Menu,
  Grip,
  SettingsIcon,
  Settings2Icon,
} from "lucide-react";
import { HeaderButton, NavItem } from "@/types/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import {
  Menu as NavMenu,
  Transition,
  Switch,
  MenuItems,
  MenuButton,
  MenuItem,
} from "@headlessui/react";
import { Fragment } from "react";
import { FaUser, FaBookmark, FaSignOutAlt, FaMoon } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/search/search-input";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useSettings } from "@/context/SettingsContext";
import ProfileSettings from "@/app/socials/profile/_components/SettingsPage";

interface HeaderProps {
  onButtonClick: (navItems: NavItem[]) => void;
  headerButtons: HeaderButton[];
}

export default function Header({ onButtonClick, headerButtons }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { currentUser, isAuthenticated, signOut } = useAuth();
  const [isCommunityRoute, setIsCommunityRoute] = useState<boolean>(false);
  const { data: profileData, isLoading: profileLoading } = useUserProfile(
    currentUser?.id
  );
  const { setOpenSettingsModal, openSettingsModal } = useSettings();

  useEffect(() => {
    const communityRoutePattern = /^\/studio\/community\/[^/]+(\/[^/]+)?$/;
    setIsCommunityRoute(communityRoutePattern.test(window.location.pathname));
  }, [pathname]);

  useEffect(() => {
    if (currentUser) {
      setProfile(currentUser.profile);
    }
  }, [currentUser]);

  const isButtonActive = (navItems: NavItem[]) => {
    return navItems.some((item) => pathname.startsWith(item.href));
  };

  const handleClose = () => {
    setOpenSettingsModal?.(false);
  };

  const handleOpenSettingsModal = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    await router.push("/socials/profile");

    if (setOpenSettingsModal) await setOpenSettingsModal?.(true);
  };

  const defaultAvatar = "https://i.postimg.cc/Bv2nscWb/icon-default-avatar.png";

  // Determine the avatar URL to use
  const avatarUrl = profileLoading
    ? defaultAvatar // Show default while loading
    : profileData?.data?.profile?.avatar || defaultAvatar;

  return (
    <header
      className={`bg-white fixed top-0 right-0 z-[100] shadow-md md:shadow-none ${
        isCommunityRoute ? "left-16" : "left-0 md:left-72"
      }`}
    >
      <div className="pr-4 sm:pr-6 lg:pr-6 w-full">
        <div className="flex h-20 justify-between items-center w-full gap-4">
          {/* Left Section with Menu Toggle and Search */}
          <div className="flex items-center space-x-4 basis-4/12">
            <div className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-1">
              <button onClick={toggle} aria-label="Toggle menu">
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5 inline-block" />
                )}
              </button>
              <img
                src="/assets/crevoe.svg"
                alt=""
                className="inline-block -mt-2"
              />
            </div>

            {/* Search - Hidden on Mobile */}
            <div className="hidden md:block w-64 lg:w-80">
              <SearchInput />
            </div>
          </div>

          {/* Center Section with Navigation Buttons */}
          <div className="hidden md:flex items-center justify-center space-x-0 basis-4/12">
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
                    className={`px-6 rounded-full py-1.5 ${
                      isActive ? "bg-primary-700" : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={`${
                        isActive ? "text-white" : "text-gray-500"
                      } transition-colors`}
                    />
                  </div>
                  <span
                    className={`${
                      isActive ? "text-primary-500" : "text-gray-700"
                    } text-sm hidden lg:inline transition-colors`}
                  >
                    {button.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Section with Actions */}
          <div className="flex items-center justify-end space-x-2 sm:space-x-4 basis-4/12">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </button>

            {isAuthenticated ? (
              <>
                {/* Notification Button */}
                <div id="notification-step-anchor">
                  <NotificationsPopover />
                </div>

                <QuickActions />

                {/* User Menu */}
                <NavMenu as="div" className="relative hidden md:inline-block">
                  <MenuButton
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="User Menu"
                  >
                    <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                      <Image
                        src={avatarUrl}
                        alt="User Avatar"
                        fill
                        sizes="(max-width: 640px) 32px, 36px"
                        className="rounded-full object-cover"
                        priority
                      />
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
                  </MenuButton>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg divide-y divide-gray-100 focus:outline-none">
                      <div className="py-1">
                        <MenuItem>
                          {({ active }) => (
                            <Link
                              href={"/socials/profile"}
                              className={`${
                                active ? "bg-gray-50" : ""
                              } flex items-center px-4 py-2 text-sm text-gray-700`}
                            >
                              <FaUser className="mr-3 h-4 w-4 text-gray-500" />
                              View Profile
                            </Link>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <Link
                              href={"/socials/profile?tab=saved videos"}
                              className={`${
                                active ? "bg-gray-50" : ""
                              } flex items-center px-4 py-2 text-sm text-gray-700`}
                            >
                              <FaBookmark className="mr-3 h-4 w-4 text-gray-500" />
                              Saved
                            </Link>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <div
                              className={`${
                                active ? "bg-gray-50" : ""
                              } flex items-center justify-between px-4 py-2 text-sm text-gray-700`}
                            >
                              <div className="flex items-center">
                                <FaMoon className="mr-3 h-4 w-4 text-gray-500" />
                                Dark Mode
                              </div>
                              <Switch
                                checked={darkMode}
                                onChange={setDarkMode}
                                className={`${
                                  darkMode ? "bg-primary-600" : "bg-gray-200"
                                } relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none`}
                              >
                                <span
                                  className={`${
                                    darkMode ? "translate-x-5" : "translate-x-1"
                                  } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
                                />
                              </Switch>
                            </div>
                          )}
                        </MenuItem>
                      </div>
                      <div className="py-1">
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={(e) => {
                                handleOpenSettingsModal(e);
                              }}
                              className={`${
                                active ? "bg-gray-50" : ""
                              } flex items-center px-4 py-2 text-sm text-gray-700 w-full`}
                            >
                              <span className="flex  items-center mr-3 h-4 w-4 text-gray-500items-center">
                                <SettingsIcon />
                              </span>
                              Settings
                            </button>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <Link
                              href="#"
                              className={`${
                                active ? "bg-gray-50" : ""
                              } flex items-center px-4 py-2 text-sm text-gray-700`}
                            >
                              <span className="mr-3 h-4 w-4 text-gray-500">
                                📱
                              </span>
                              Get Crevoe App
                            </Link>
                          )}
                        </MenuItem>
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={async () => {
                                await signOut();
                                router.push("/auth?tab=signin");
                              }}
                              className={`${
                                active ? "bg-gray-50" : ""
                              } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                            >
                              <FaSignOutAlt className="mr-3 h-4 w-4 text-gray-500" />
                              Sign Out
                            </button>
                          )}
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Transition>
                </NavMenu>
              </>
            ) : (
              <Button
                onClick={() => router.push("/auth?tab=signin")}
                className="min-w-24 sm:min-w-32 text-sm text-white px-4 py-1 rounded-lg h-10 sm:h-12"
                aria-label="Sign In"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Search - Shown when toggled */}
        <Transition
          show={isSearchVisible}
          enter="transition-all duration-200 ease-out"
          enterFrom="opacity-0 -translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition-all duration-200 ease-in"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-2"
        >
          <div className="mb-4">
            <Input variant="search" placeholder="Search" className="w-full" />
          </div>
        </Transition>
      </div>
    </header>
  );
}
