import {
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Home,
  Hotel,
  Star,
  Bed,
  Users,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EntityManagement } from "./entity-management";

const defaultColumns = [
  {
    key: "title",
    label: "Property",
    visible: true,
    sortable: true,
    render: (property) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src={property.images?.[0]?.imageUrl || ""}
            alt={property.title}
          />
          <AvatarFallback className="bg-blue-100 text-blue-700">
            {property.propertyType === "hotel" ? (
              <Hotel className="h-4 w-4" />
            ) : (
              <Home className="h-4 w-4" />
            )}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-slate-800">{property.title}</p>
          <p className="text-sm text-slate-500 capitalize">
            {property.propertyType} • {property.district}
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
    render: (property) => (
      <div className="flex items-center">
        <MapPin className="h-3 w-3 text-slate-400 mr-1" />
        <span>
          {property.city}, {property.district}
        </span>
      </div>
    ),
  },
  {
    key: "contact",
    label: "Contact",
    visible: true,
    sortable: false,
    render: (property) => (
      <div className="space-y-1">
        <div className="flex items-center text-sm">
          <Phone className="h-3 w-3 mr-1 text-slate-400" />
          {property.phone || "Not provided"}
        </div>
        <div className="flex items-center text-sm">
          <Mail className="h-3 w-3 mr-1 text-slate-400" />
          {property.email || "Not provided"}
        </div>
        {property.website && (
          <div className="flex items-center text-sm">
            <Globe className="h-3 w-3 mr-1 text-slate-400" />
            <span className="truncate max-w-[160px]">{property.website}</span>
          </div>
        )}
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    visible: true,
    sortable: true,
    render: (property) => (
      <div className="flex flex-col  gap-3" >
        <Badge variant={property.isActive ? "default" : "outline"}>
          {property.isActive ? "Active" : "Inactive"}
        </Badge>
        {/* <Badge variant={property.vistaVerified ? "default" : "outline"}>
          {property.vistaVerified ? "Verified" : "Unverified"}
        </Badge> */}
        <Badge variant={
          property.approvalStatus === "approved" ? "default" :
            property.approvalStatus === "pending" ? "secondary" : "destructive"
        }>
          {property.approvalStatus || "Pending"}
        </Badge>
      </div>
    ),
  },
  {
    key: "dates",
    label: "Dates",
    visible: true,
    sortable: true,
    render: (property) => (
      <div className="text-sm space-y-1">
        <div>Created: {new Date(property.createdAt).toLocaleDateString()}</div>
        {property.updatedAt && (
          <div>Updated: {new Date(property.updatedAt).toLocaleDateString()}</div>
        )}
        {property.approvedAt && (
          <div>Approved: {new Date(property.approvedAt).toLocaleDateString()}</div>
        )}
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

const PropertyManagement = ({ propertyType = "hotel", ...props }) => {
  const isHotel = propertyType === "hotel";

  return (
    <EntityManagement
      entityName={propertyType}
      entityPlural={`${propertyType}s`}
      columns={defaultColumns}
      renderStatusBadge={renderStatusBadge}
      headerTitle={`${isHotel ? "Hotels" : "Apartments"} Management`}
      headerDescription={`Manage all your ${isHotel ? "hotel" : "apartment"} listings`}
      addButtonLabel={`Add New ${isHotel ? "Hotel" : "Apartment"}`}
      enableTabs={true}
      tabs={[
        { value: "all", label: "All Properties" },
        { value: "active", label: "Active", filter: (item) => item.isActive },
        { value: "inactive", label: "Inactive", filter: (item) => !item.isActive },
        {
          value: "pending",
          label: "Pending Approval",
          filter: (item) => item.approvalStatus === "pending"
        },
        {
          value: "approved",
          label: "Approved",
          filter: (item) => item.approvalStatus === "approved"
        },
        {
          value: "rejected",
          label: "Rejected",
          filter: (item) => item.approvalStatus === "rejected"
        },
      ]}
      {...props}
    />
  );
};

export default PropertyManagement;