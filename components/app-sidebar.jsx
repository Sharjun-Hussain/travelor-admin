"use client";

import * as React from "react";
import {
  Activity,
  AlignVerticalJustifyStart,
  ArrowUpCircleIcon,
  BedIcon,
  BookIcon,
  BugPlay,
  BuildingIcon,
  Bus,
  CalendarIcon,
  CreditCardIcon,
  DollarSignIcon,
  FileTextIcon,
  GitPullRequestDraftIcon,
  HelpCircleIcon,
  HomeIcon,
  HotelIcon,
  IceCream2Icon,
  LayoutDashboardIcon,
  MapPinIcon,
  MessageSquareIcon,
  PartyPopper,
  PercentIcon,
  PieChartIcon,
  PlaneIcon,
  SailboatIcon,
  SearchIcon,
  SendToBack,
  Settings2Icon,
  ShieldIcon,
  TagIcon,
  Touchpad,
  Users,
  UsersIcon,
  Vegan,
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
import Link from "next/link";

const data = {
  user: {
    name: "Admin User",
    email: "admin@alvista.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboardIcon,
    },
  ],
  navBookings: [
    {
      title: "All Bookings",
      icon: BookIcon,
      isActive: false,
      url: "/admin/bookings/all",
      items: [
        {
          title: "Hotel",
          url: "/admin/bookings/pending",
        },
        {
          title: "HomeStays",
          url: "/admin/bookings/confirmed",
        },
        {
          title: "Apartments",
          url: "/admin/bookings/cancelled",
        },
      ],
    },

    {
      title: "My Bookings",
      icon: HotelIcon,
      url: "/admin/bookings/accommodations",
      items: [
        {
          title: "Upcoming",
          url: "/admin/bookings/accommodations/hotels",
        },
        {
          title: "Ongoing",
          url: "/admin/bookings/accommodations/apartments",
        },
        {
          title: "Completed",
          url: "/admin/bookings/accommodations/villas",
        },
        {
          title: "Cancelled",
          url: "/admin/bookings/accommodations/villas",
        },
      ],
    },
    {
      title: "Booking Actions",
      icon: HotelIcon,
      url: "/admin/bookings/accommodations",
      items: [
        {
          title: "Accept / Decline Requests",
          url: "/admin/bookings/accommodations/hotels",
        },
        {
          title: "Mark as Checked-in",
          url: "/admin/bookings/accommodations/apartments",
        },
        {
          title: "Cancel Booking",
          url: "/admin/bookings/accommodations/villas",
        },
      ],
    },

    // {
    //   title: "Cancellation Reports",
    //   icon: PlaneIcon,
    //   url: "/admin/bookings/transportation",
    //   items: [
    //     {
    //       title: "Guest-Initiated",
    //       url: "/admin/bookings/transportation/flights",
    //     },
    //     {
    //       title: "Host-Initiated",
    //       url: "/admin/bookings/transportation/car-rentals",
    //     },
    //     {
    //       title: "System-Cancelled",
    //       url: "/admin/bookings/transportation/airport-transfers",
    //     },
    //   ],
    // },
    {
      title: "Disputes",
      icon: PlaneIcon,
      url: "/admin/bookings/transportation",
      items: [
        {
          title: "Open Disputes",
          url: "/admin/bookings/transportation/flights",
        },
        {
          title: "Resolved Disputes",
          url: "/admin/bookings/transportation/car-rentals",
        },
        {
          title: "Escalated to Admin",
          url: "/admin/bookings/transportation/airport-transfers",
        },
      ],
    },
  ],
  navMainListings: [
    {
      title: "Hotel & Apartment",
      icon: BuildingIcon,
      url: "/admin/hotel-and-aprtments",
      items: [
        {
          title: "Add Property",
          url: "/admin/hotel-and-aprtments/add",
        },

        {
          title: "Property Types",
          url: "/admin/hotel-and-aprtments/types",
        },
        {
          title: "Amenities",
          url: "/admin/hotel-and-aprtments/amenities",
        },
        {
          title: "Manage Rooms",
          url: "/admin/hotel-and-aprtments/rooms",
        },
      ],
    },
    {
      title: "Homestays",
      icon: BedIcon,
      url: "/admin/homestays",
      items: [
        {
          title: "Add Room",
          url: "/admin/rooms/add",
        },
        {
          title: "Room Types",
          url: "/admin/rooms/types",
        },
        {
          title: "Amenities",
          url: "/admin/rooms/amenities",
        },
      ],
    },
  ],
  navSecondaryListings: [
    {
      title: "Transport",
      icon: Bus,
      url: "/dashboard/listings/secondary/transport",
    },
    {
      title: "Activities",
      icon: Activity,
      url: "/dashboard/listings/secondary/activities",
    },
    {
      title: "Food & Beverage",
      icon: Vegan,
      url: "/admin/hotel-and-aprtments",
    },
    {
      title: "Events",
      icon: SailboatIcon,
      url: "/dashboard/listings/secondary/events",
    },
    {
      title: "Local Artists",
      icon: AlignVerticalJustifyStart,
      url: "/dashboard/listings/secondary/local-artists",
    },
    {
      title: "Shoppings",
      icon: BugPlay,
      url: "/dashboard/listings/secondary/shoppings",
    },
    {
      title: "Licensed Tour Guides",
      icon: IceCream2Icon,
      url: "/dashboard/listings/secondary/licensed-tour-guides",
    },
    {
      title: "Others",
      icon: IceCream2Icon,
      url: "/admin/hotel-and-aprtments",
    },
  ],
  navRevenue: [
    {
      title: "Earnings Overview",
      icon: CreditCardIcon,
      url: "/admin/payments",
      items: [
        {
          title: "Platform Earnings",
          url: "/admin/payments/methods",
        },
        {
          title: "Host Earnings",
          url: "/admin/payments/transactions",
        },
        {
          title: "Commission Breakdown",
          url: "/admin/payments/transactions",
        },
        {
          title: "Refunds",
          url: "/admin/payments/refunds",
        },
      ],
    },
    {
      title: "Transactions",
      icon: DollarSignIcon,
      url: "/admin/pricing",
      items: [
        {
          title: "All Transactions",
          url: "/admin/pricing/rate-plans",
        },
        {
          title: "Successful",
          url: "/admin/pricing/dynamic",
        },
        {
          title: "Failed",
          url: "/admin/pricing/dynamic",
        },
        {
          title: "Seasonal Rates",
          url: "/admin/pricing/seasonal",
        },
      ],
    },
    {
      title: "Payouts",
      icon: SendToBack,
      url: "/admin/promotions",
      items: [
        {
          title: "Pending Payouts",
          url: "/admin/promotions/discounts",
        },
        {
          title: "Completed Payouts",
          url: "/admin/promotions/coupons",
        },
        {
          title: "Scheduled Payouts",
          url: "/admin/promotions/loyalty",
        },
      ],
    },
    {
      title: "Refunds",
      icon: GitPullRequestDraftIcon,
      url: "/admin/promotions",
      items: [
        {
          title: "All Refunds",
          url: "/admin/promotions/discounts",
        },
        {
          title: "Guest-Initiated Refunds",
          url: "/admin/promotions/coupons",
        },
        {
          title: "Host-Initiated Refunds",
          url: "/admin/promotions/loyalty",
        },
      ],
    },
    {
      title: "Financial Reports",
      icon: Touchpad,
      url: "/admin/promotions",
      items: [
        {
          title: "Revenue Reports",
          url: "/admin/promotions/discounts",
        },
        {
          title: "Daily Earnings",
          url: "/admin/promotions/coupons",
        },
        {
          title: " Monthly Earnings",
          url: "/admin/promotions/loyalty",
        },
        {
          title: "  Refund Summary",
          url: "/admin/promotions/loyalty",
        },
      ],
    },
    {
      title: "Payment Settings",
      icon: PartyPopper,
      url: "/admin/promotions",
      items: [
        {
          title: "Gateway Configuration",
          url: "/admin/promotions/discounts",
        },
        {
          title: "Currency & Tax Settings",
          url: "/admin/promotions/coupons",
        },
        {
          title: "Invoice Templates",
          url: "/admin/promotions/loyalty",
        },
      ],
    },
  ],
  navSecondary: [
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
      title: "Revenue Reports",
      icon: CreditCardIcon,
      url: "/admin/payments",
      items: [
        {
          title: "Daily Revenue",
          url: "/admin/payments/methods",
        },
        {
          title: "Weekly Revenue",
          url: "/admin/payments/transactions",
        },
        {
          title: "Monthly Revenue",
          url: "/admin/payments/transactions",
        },
        {
          title: "Custom Date Range",
          url: "/admin/payments/refunds",
        },
      ],
    },
    {
      title: "Booking Reports",
      icon: CreditCardIcon,
      url: "/admin/payments",
      items: [
        {
          title: "Hotel Bookings",
          url: "/admin/payments/methods",
        },
        {
          title: "Homestays Bookings",
          url: "/admin/payments/transactions",
        },
        {
          title: "Cancellations",
          url: "/admin/payments/transactions",
        },
        {
          title: "Peak Season Analytics",
          url: "/admin/payments/refunds",
        },
      ],
    },
    {
      title: "User Reports",
      icon: CreditCardIcon,
      url: "/admin/payments",
      items: [
        {
          title: "Registered Users",
          url: "/admin/payments/methods",
        },
        {
          title: " Active Guests",
          url: "/admin/payments/transactions",
        },
        {
          title: "Active Hosts",
          url: "/admin/payments/transactions",
        },
        {
          title: "User Growth Trends",
          url: "/admin/payments/refunds",
        },
      ],
    },
    {
      title: "Payout Reports",
      icon: CreditCardIcon,
      url: "/admin/payments",
      items: [
        {
          title: "Total Payouts",
          url: "/admin/payments/methods",
        },
        {
          title: "Pending Payouts",
          url: "/admin/payments/transactions",
        },
        {
          title: "Failed Payouts",
          url: "/admin/payments/transactions",
        },
      ],
    },
    {
      title: "Refund Reports",
      icon: CreditCardIcon,
      url: "/admin/payments",
      items: [
        {
          title: "Total Refund",
          url: "/admin/payments/methods",
        },
        {
          title: "Refund by Reason",
          url: "/admin/payments/transactions",
        },
        {
          title: "Guest vs Host Refunds",
          url: "/admin/payments/transactions",
        },
      ],
    },
    {
      title: "Listing Reports",
      icon: CreditCardIcon,
      url: "/admin/payments",
      items: [
        {
          title: "Most Viewed Listings",
          url: "/admin/payments/methods",
        },
        {
          title: "High Performing Hosts",
          url: "/admin/payments/transactions",
        },
        {
          title: "Listing Approval Stats",
          url: "/admin/payments/transactions",
        },
      ],
    },
  ],
  hostbookingitems: [
    {
      title: "Booking Calendar",
      url: "/admin/dashboard",
      icon: LayoutDashboardIcon,
    },
  ],
  navusers: [
    {
      title: "Hosts",
      icon: CreditCardIcon,
      url: "/dashboard/user-management/hosts",
    },
    {
      title: "Customers",
      icon: Users,
      url: "/dashboard/user-management/customers",
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
              <Link href="/admin">
                <HomeIcon className="h-5 w-5" />
                <span className="text-base font-semibold">BookingAdmin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments title="Booking Management" items={data.navBookings} />
        <NavMain items={data.hostbookingitems} showquickcreate={false} />
        <NavDocuments title="Main Listings" items={data.navMainListings} />
        <NavDocuments
          title="Secondary Listing"
          items={data.navSecondaryListings}
        />
        <NavDocuments title="Payments & Revenue" items={data.navRevenue} />
        <NavDocuments title="Reports" items={data.documents} />
        <NavDocuments title="Users Management" items={data.navusers} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
