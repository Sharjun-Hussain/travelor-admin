import {
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EntityManagement } from "@/app/dashboard/listings/secondary/shoppings/entity-management";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const defaultColumns = [
  {
    key: "title",
    label: "Shop",
    visible: true,
    sortable: true,
    render: (shop) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={shop.images?.[0] || ""} alt={shop.title} />
          <AvatarFallback className="bg-pink-100 text-pink-700">
            {shop.title
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p
            title={shop.title}
            className="font-medium truncate max-w-[150px] text-slate-800"
          >
            {shop.title}
          </p>
          <p className="text-sm text-slate-500">{shop.category}</p>
        </div>
      </div>
    ),
  },
  {
    key: "location",
    label: "Location",
    visible: true,
    sortable: true,
    render: (shop) => (
      <div className="text-slate-700">
        {shop.location?.city}, {shop.location?.province}
      </div>
    ),
  },
  {
    key: "productTypes",
    label: "Products",
    visible: true,
    sortable: false,
    render: (shop) => (
      <div className="text-sm text-slate-600 truncate max-w-[120px]">
        {shop.productTypes?.join(", ") || "N/A"}
      </div>
    ),
  },
  {
    key: "rating",
    label: "Rating",
    visible: true,
    sortable: false,
    render: (shop) => {
      const rating = shop.rating ?? "N/A";
      const count = shop.travelerReviews?.length || 0;
      return (
        <div className="flex items-center text-yellow-600 font-medium">
          ⭐ {rating}
          <span className="ml-1 text-xs text-slate-500">({count})</span>
        </div>
      );
    },
  },
  {
    key: "reviews",
    label: "Reviews",
    visible: true,
    sortable: false,
    render: (shop) => (
      <div className="text-sm text-slate-600">
        {shop.travelerReviews?.length || 0} traveler,{" "}
        {shop.slvistaReviews?.length || 0} slvista
      </div>
    ),
  },
  {
    key: "contactDetails",
    label: "Contact",
    visible: true,
    sortable: false,
    render: (shop) => (
      <div
        title={`${shop.contactDetails?.phone} - ${shop.contactDetails?.email}`}
        className="text-sm text-slate-600 truncate max-w-[100px]"
      >
        {shop.contactDetails?.phone || "No phone"}
        <br />
        {shop.contactDetails?.email || "No email"}
      </div>
    ),
  },
  {
    key: "openingHours",
    label: "Opening Hours",
    visible: true,
    sortable: false,
    render: (shop) => (
      <div className="text-sm text-slate-600">
        {shop.openingHours || "Not available"}
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

const ActivityManagement = (props) => {
  return (
    <EntityManagement
      entityName="transport"
      entityPlural="transports"
      columns={defaultColumns}
      renderStatusBadge={renderStatusBadge}
      headerTitle="Transport Management"
      headerDescription="Manage all your transport and tours"
      addButtonLabel="Add New transport"
      enableTabs={false}
      {...props}
    />
  );
};

export default ActivityManagement;
