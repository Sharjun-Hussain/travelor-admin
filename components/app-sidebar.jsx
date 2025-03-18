"use client";

import * as React from "react";
import {
  ArrowUpCircleIcon,
  BedIcon,
  BookIcon,
  BuildingIcon,
  CalendarIcon,
  CreditCardIcon,
  DollarSignIcon,
  FileTextIcon,
  HelpCircleIcon,
  HomeIcon,
  HotelIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  MessageSquareIcon,
  PercentIcon,
  PieChartIcon,
  PlaneIcon,
  SearchIcon,
  Settings2Icon,
  ShieldIcon,
  TagIcon,
  UsersIcon,
} from "lucide-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Admin User",
    email: "admin@bookingapp.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Bookings",
      url: "/admin/bookings",
      icon: CalendarIcon,
    },
    {
      title: "Properties",
      url: "/admin/properties",
      icon: BuildingIcon,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: UsersIcon,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: PieChartIcon,
    },
  ],
  navBookings: [
    {
      title: "All Bookings",
      icon: BookIcon,
      isActive: true,
      url: "/admin/bookings/all",
      items: [
        {
          title: "Pending",
          url: "/admin/bookings/pending",
        },
        {
          title: "Confirmed",
          url: "/admin/bookings/confirmed",
        },
        {
          title: "Cancelled",
          url: "/admin/bookings/cancelled",
        },
        {
          title: "Completed",
          url: "/admin/bookings/completed",
        },
      ],
    },
    {
      title: "Accommodations",
      icon: HotelIcon,
      url: "/admin/bookings/accommodations",
      items: [
        {
          title: "Hotels",
          url: "/admin/bookings/accommodations/hotels",
        },
        {
          title: "Apartments",
          url: "/admin/bookings/accommodations/apartments",
        },
        {
          title: "Villas",
          url: "/admin/bookings/accommodations/villas",
        },
      ],
    },
    {
      title: "Transportation",
      icon: PlaneIcon,
      url: "/admin/bookings/transportation",
      items: [
        {
          title: "Flights",
          url: "/admin/bookings/transportation/flights",
        },
        {
          title: "Car Rentals",
          url: "/admin/bookings/transportation/car-rentals",
        },
        {
          title: "Airport Transfers",
          url: "/admin/bookings/transportation/airport-transfers",
        },
      ],
    },
  ],
  navManagement: [
    {
      title: "Property Management",
      icon: BuildingIcon,
      url: "/admin/properties",
      items: [
        {
          title: "Add Property",
          url: "/admin/properties/add",
        },
        {
          title: "Property List",
          url: "/admin/properties/list",
        },
        {
          title: "Property Types",
          url: "/admin/properties/types",
        },
        {
          title: "Amenities",
          url: "/admin/properties/amenities",
        },
      ],
    },
    {
      title: "Room Management",
      icon: BedIcon,
      url: "/admin/rooms",
      items: [
        {
          title: "Add Room",
          url: "/admin/rooms/add",
        },
        {
          title: "Room List",
          url: "/admin/rooms/list",
        },
        {
          title: "Room Types",
          url: "/admin/rooms/types",
        },
      ],
    },
    {
      title: "Locations",
      icon: MapPinIcon,
      url: "/admin/locations",
      items: [
        {
          title: "Countries",
          url: "/admin/locations/countries",
        },
        {
          title: "Cities",
          url: "/admin/locations/cities",
        },
        {
          title: "Points of Interest",
          url: "/admin/locations/poi",
        },
      ],
    },
  ],
  navRevenue: [
    {
      title: "Payments",
      icon: CreditCardIcon,
      url: "/admin/payments",
      items: [
        {
          title: "Payment Methods",
          url: "/admin/payments/methods",
        },
        {
          title: "Transactions",
          url: "/admin/payments/transactions",
        },
        {
          title: "Refunds",
          url: "/admin/payments/refunds",
        },
      ],
    },
    {
      title: "Pricing",
      icon: DollarSignIcon,
      url: "/admin/pricing",
      items: [
        {
          title: "Rate Plans",
          url: "/admin/pricing/rate-plans",
        },
        {
          title: "Dynamic Pricing",
          url: "/admin/pricing/dynamic",
        },
        {
          title: "Seasonal Rates",
          url: "/admin/pricing/seasonal",
        },
      ],
    },
    {
      title: "Promotions",
      icon: PercentIcon,
      url: "/admin/promotions",
      items: [
        {
          title: "Discounts",
          url: "/admin/promotions/discounts",
        },
        {
          title: "Coupons",
          url: "/admin/promotions/coupons",
        },
        {
          title: "Loyalty Program",
          url: "/admin/promotions/loyalty",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "User Management",
      url: "/admin/users",
      icon: UsersIcon,
    },
    {
      title: "Role Management",
      url: "/admin/roles",
      icon: ShieldIcon,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings2Icon,
    },
    {
      title: "Help Center",
      url: "/admin/help",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "/admin/search",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Reports",
      url: "/admin/reports",
      icon: FileTextIcon,
    },
    {
      name: "Reviews",
      url: "/admin/reviews",
      icon: MessageSquareIcon,
    },
    {
      name: "Featured Listings",
      url: "/admin/featured",
      icon: TagIcon,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin">
                <HomeIcon className="h-5 w-5" />
                <span className="text-base font-semibold">BookingAdmin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments title="Booking Management" items={data.navBookings} />
        <NavDocuments title="Property Management" items={data.navManagement} />
        <NavDocuments title="Revenue Management" items={data.navRevenue} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
