"use client";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  MoreHorizontalIcon,
  ShareIcon,
} from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavDocuments({ title = "Documents", items }) {
  const { isMobile } = useSidebar();
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (itemTitle) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemTitle]: !prev[itemTitle],
    }));
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <div key={item.title}>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild={!item.items}
                onClick={
                  item.items ? () => toggleExpand(item.title) : undefined
                }
                className={item.isActive ? "font-medium text-primary" : ""}
              >
                {item.items ? (
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      {item.icon && (
                        <item.icon className="mr-2 h-4 w-4 text-j-primary" />
                      )}
                      <span>{item.title}</span>
                    </div>
                    {expandedItems[item.title] ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </div>
                ) : (
                  <Link href={item.url}>
                    {item.icon && (
                      <item.icon className="mr-2 h-4 w-4 text-j-secondary" />
                    )}
                    <span className="">{item.title}</span>
                  </Link>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Nested items */}
            {item.items && expandedItems[item.title] && (
              <div className="ml-6 pl-2 border-l border-l-sidebar-foreground/20">
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild>
                      <Link href={subItem.url} className="text-sm py-1">
                        <span className="">{subItem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontalIcon className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  );
}
