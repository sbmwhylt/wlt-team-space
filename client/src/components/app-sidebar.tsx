"use client";

import {
  Settings,
  CircleQuestionMark,
  ClipboardClock,
  Globe,
  LayoutDashboard,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import SupportDialog from "@/pages/dialog/SupportDialog";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    // {
    //   title: "Time Tracker",
    //   url: "/time-tracker",
    //   icon: ClipboardClock,
    //   items: [
    //     /* ... */
    //   ],
    // },
    {
      title: "Microsites",
      url: "/microsites",
      icon: Globe,
    },
    {
      title: "User Management",
      url: "/users",
      icon: Users,
      items: [
        /* ... */
      ],
    },
  ],
  navSecondary: [
    { title: "Settings", url: "/settings", icon: Settings },
    {
      title: "Support",
      url: "/support",
      icon: CircleQuestionMark,
      dialog: SupportDialog,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex gap-2">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <img
                src="logo-whyleavetown.png"
                alt="WLT Logo"
                className="border"
              />
            </div>
            <div className="grid  text-left  leading-snug ">
              <span className="truncate font-bold text-sm">Team Space</span>
              <span className="truncate text-xs text-gray-600">
                Management System
              </span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
        
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
 
    </Sidebar>
  );
}
