import { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type HeaderButton = {
  id: string;
  label: string;
  navItems: NavItem[];
  icon: LucideIcon;
};
