import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon | React.ReactElement;
  children?: NavItem[];
  isExpanded?: boolean;
}

export interface HeaderButton {
  id: string;
  label: string;
  icon: LucideIcon;
  navItems: NavItem[];
}
