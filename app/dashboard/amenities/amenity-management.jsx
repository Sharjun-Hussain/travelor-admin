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
import { EntityManagement } from "./entity-management";

const defaultColumns = [
  {
    key: "name",
    label: "Amenity",
    visible: true,
    sortable: true,
    render: (item) => (
      <div className="font-medium text-slate-800">{item.name}</div>
    ),
  },
  {
    key: "slug",
    label: "Slug",
    visible: true,
    sortable: true,
    render: (item) => (
      <div className="text-slate-500 text-sm">{item.slug}</div>
    ),
  },
  {
    key: "language_code",
    label: "Language",
    visible: true,
    sortable: false,
    render: (item) => (
      <span className="text-sm text-slate-600">{item.language_code.toUpperCase()}</span>
    ),
  },
  {
    key: "isActive",
    label: "Status",
    visible: true,
    sortable: true,
    render: (item) => (
      <Badge variant={item.isActive ? "default" : "outline"}>
        {item.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    label: "Created At",
    visible: true,
    sortable: true,
    render: (item) => (
      <span className="text-sm text-slate-500">
        {new Date(item.createdAt).toLocaleDateString()}
      </span>
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

const ActivityManagement = (props) => {
  return (
    <EntityManagement
      entityName="amenity"
      entityPlural="amenities"
      columns={defaultColumns}
      renderStatusBadge={renderStatusBadge}
      headerTitle="Amenity Management"
      headerDescription="Manage all your Amanities"
      addButtonLabel="Add New Amenity"
      enableTabs={false}
      enableFilters={false}

      {...props}
    />
  );
};

export default ActivityManagement;
