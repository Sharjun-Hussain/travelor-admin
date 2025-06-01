import {
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { EntityManagement } from "./entity-management";
const defaultColumns = [
  {
    key: "businessName",
    label: "Business",
    visible: true,
    sortable: true,
    render: (host) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-emerald-100 text-emerald-700">
            {host.businessName
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p
            title={host.businessName}
            className="font-medium truncate max-w-[150px] text-slate-800"
          >
            {host.businessName}
          </p>
          <p className="text-sm text-slate-500">
            {host.businessType || "-"}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "location",
    label: "Location",
    visible: true,
    sortable: true,
    render: (host) => (
      <div className="flex flex-col">
        <div
          title={host.address}
          className="text-slate-700 truncate max-w-[150px]"
        >
          {host.address}
        </div>
        <div className="text-slate-700 truncate max-w-[150px]">
          {host.city}, {host.country}
        </div>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    visible: true,
    sortable: true,
    render: (host) => (
      <Badge variant={host.status === "verified" ? "success" : "outline"}>
        {host.status.charAt(0).toUpperCase() + host.status.slice(1)}
      </Badge>
    ),
  },
  {
    key: "contactDetails",
    label: "Contact",
    visible: true,
    sortable: false,
    render: (host) => (
      <div
        title={`${host.phoneNumber} - ${host.user.email}`}
        className="text-sm text-slate-600 truncate max-w-[100px]"
      >
        {host.phoneNumber || "No phone"}
        <br />
        {host.user?.email || "No email"}
      </div>
    ),
  },
  {
    key: "verification",
    label: "Verification",
    visible: true,
    sortable: false,
    render: (host) => (
      <div className="text-sm text-slate-600">
        {host.nicNumber ? `NIC: ${host.nicNumber}` :
          host.passportNumber ? `Passport: ${host.passportNumber}` : "No ID"}
        <br />
        Reg: {host.businessRegistrationNumber || "N/A"}
      </div>
    ),
  },
];
const renderStatusBadge = (status) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0">
          <CheckCircle2 className="mr-1 h-3 w-3" /> Active
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0">
          <Clock className="mr-1 h-3 w-3" /> Pending
        </Badge>
      );
    case "inactive":
      return (
        <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-0">
          <XCircle className="mr-1 h-3 w-3" /> Inactive
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const HostManagement = (props) => {
  return (
    <EntityManagement
      entityName="customer"
      entityPlural="customers"
      columns={defaultColumns}
      renderStatusBadge={renderStatusBadge}
      headerTitle="Customer Management"
      headerDescription="Manage all your Customers and client"
      addButtonLabel="Add New Customer"
      enableTabs={false}
      {...props}
    />
  );
};

export default HostManagement;
