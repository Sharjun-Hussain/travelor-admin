// constants/settings-nav.ts
import { Icons } from "@/components/icons";

export const settingsNavItems = [
  {
    title: "General",
    href: "/settings/general",
    icon: "settings",
    permission: "settings:general:read",
  },
  {
    title: "Booking",
    href: "/settings/booking",
    icon: "calendar",
    permission: "settings:booking:read",
  },
  {
    title: "Payments",
    href: "/settings/payments",
    icon: "creditCard",
    permission: "settings:payment:read",
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
    icon: "bell",
    permission: "settings:notifications:read",
  },
  {
    title: "Users",
    href: "/settings/users",
    icon: "users",
    permission: "users:read",
  },
  {
    title: "API Keys",
    href: "/settings/api-keys",
    icon: "key",
    permission: "settings:api:manage",
  },
  {
    title: "Audit Logs",
    href: "/settings/audit-logs",
    icon: "fileText",
    permission: "settings:audit:read",
  },
];
