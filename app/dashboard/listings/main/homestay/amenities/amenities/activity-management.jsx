import {
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EntityManagement } from "@/app/dashboard/listings/secondary/activities/entity-management";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const defaultColumns = [
  {
    key: "title",
    label: "Activity",
    visible: true,
    sortable: true,
    render: (activity) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={activity.images?.[0] || ""} alt={activity.title} />
          <AvatarFallback className="bg-emerald-100 text-emerald-700">
            {activity.title
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-slate-800">{activity.title}</p>
          <p className="text-sm text-slate-500">{activity.type}</p>
        </div>
      </div>
    ),
  },
  {
    key: "location",
    label: "Location",
    visible: true,
    sortable: true,
    render: (activity) => (
      <div className="flex items-center">
        <MapPin className="h-3 w-3 text-slate-400 mr-1" />
        <span>
          {activity.location?.city}, {activity.location?.district}
        </span>
      </div>
    ),
  },
  {
    key: "priceRangeUSD",
    label: "Price Range",
    visible: true,
    sortable: true,
    render: (activity) => (
      <div className="text-slate-700">{activity.priceRangeUSD}</div>
    ),
  },
  {
    key: "vistaVerified",
    label: "Vista Verified",
    visible: true,
    sortable: false,
    render: (activity) => (
      <Badge variant={activity.vistaVerified ? "default" : "outline"}>
        {activity.vistaVerified ? "Verified" : "Not Verified"}
      </Badge>
    ),
  },
  {
    key: "rating",
    label: "Rating",
    visible: true,
    sortable: false,
    render: (activity) => {
      const rating = activity.reviews?.vistaReview?.rating || "N/A";
      const count = activity.reviews?.travelerReviews?.length || 0;
      return (
        <div className="flex items-center text-yellow-600 font-medium">
          ⭐ {rating}
          <span className="ml-1 text-xs text-slate-500">({count})</span>
        </div>
      );
    },
  },
  {
    key: "contactDetails",
    label: "Contact",
    visible: true,
    sortable: false,
    render: (activity) => (
      <div className="text-sm text-slate-600">
        {activity.contactDetails?.phone || "No phone"}
        <br />
        {activity.contactDetails?.email || "No email"}
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
      entityName="amenitie"
      entityPlural="amenities"
      columns={defaultColumns}
      renderStatusBadge={renderStatusBadge}
      headerTitle="Amenity Management"
      headerDescription="Manage all your Amanities"
      addButtonLabel="Add New Amenity"
      enableTabs={false}
      {...props}
    />
  );
};

export default ActivityManagement;
