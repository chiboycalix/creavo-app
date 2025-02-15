import { LucideIcon } from "lucide-react";

export type NavItem = {
  title: string | React.ReactNode;
  href: string;
  icon: LucideIcon | any;
};

export type HeaderButton = {
  id: string;
  label: string;
  navItems: NavItem[];
  icon: LucideIcon;
};
