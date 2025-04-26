import {
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EntityManagement } from "@/app/dashboard/listings/secondary/licensed-tour-guides/entity-management";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const defaultColumns = [
  {
    key: "name",
    label: "Guide",
    visible: true,
    sortable: true,
    render: (guide) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={guide.profileImage || ""} alt={guide.name} />
          <AvatarFallback className="bg-blue-100 text-blue-700">
            {guide.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p
            title={guide.name}
            className="font-medium truncate max-w-[180px] text-slate-800"
          >
            {guide.name}
            {guide.verifiedByVista && (
              <span className="ml-1 text-xs text-blue-500">✓ Verified</span>
            )}
          </p>
          <p
            title={guide.bio}
            className="text-sm text-slate-500 truncate max-w-[150px]"
          >
            {guide.bio}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "languages",
    label: "Languages",
    visible: true,
    sortable: true,
    render: (guide) => (
      <div className="text-slate-700">
        {guide.languagesSpoken?.join(", ") || "N/A"}
      </div>
    ),
  },
  {
    key: "specialties",
    label: "Specialties",
    visible: true,
    sortable: false,
    render: (guide) => (
      <div
        title={guide.specialties?.join(", ") || "N/A"}
        className="text-sm text-slate-600 truncate max-w-[120px]"
      >
        {guide.specialties?.join(", ") || "N/A"}
      </div>
    ),
  },
  {
    key: "regions",
    label: "Regions Covered",
    visible: true,
    sortable: false,
    render: (guide) => (
      <div
        title={guide.regionsCovered?.join(", ") || "N/A"}
        className="text-sm truncate max-w-[175px] text-slate-600"
      >
        {guide.regionsCovered?.join(", ") || "N/A"}
      </div>
    ),
  },
  {
    key: "rating",
    label: "Rating",
    visible: true,
    sortable: true,
    render: (guide) => {
      const rating = guide.rating ?? "N/A";
      const count = guide.reviews?.length || 0;
      return (
        <div className="flex items-center text-yellow-600 font-medium">
          ⭐ {rating}
          <span className="ml-1 text-xs text-slate-500">({count})</span>
        </div>
      );
    },
  },
  // {
  //   key: "reviews",
  //   label: "Reviews",
  //   visible: true,
  //   sortable: false,
  //   render: (guide) => (
  //     <div className="text-sm text-slate-600">
  //       {guide.reviews?.length || 0} traveler, {guide.slvistaReviews ? 1 : 0}{" "}
  //       slvista
  //     </div>
  //   ),
  // },
  // {
  //   key: "rate",
  //   label: "Rate Per Day",
  //   visible: true,
  //   sortable: true,
  //   render: (guide) => (
  //     <div className="text-sm text-slate-600 font-medium">
  //       {guide.ratePerDay?.amount
  //         ? `${guide.ratePerDay.currency} ${guide.ratePerDay.amount}`
  //         : "N/A"}
  //     </div>
  //   ),
  // },
  {
    key: "contact",
    label: "Contact",
    visible: true,
    sortable: false,
    render: (guide) => (
      <div
        title={`${guide.contact?.phone} - ${guide.contact?.email}`}
        className="text-sm text-slate-600 truncate max-w-[100px]"
      >
        {guide.contact?.phone || "No phone"}
        <br />
        {guide.contact?.email || "No email"}
      </div>
    ),
  },
  // {
  //   key: "experience",
  //   label: "Experience",
  //   visible: true,
  //   sortable: true,
  //   render: (guide) => (
  //     <div className="text-sm text-slate-600">
  //       {guide.yearsOfExperience || "N/A"} years
  //     </div>
  //   ),
  // },
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
      entityName="licensed-tour-guide"
      entityPlural="licensed-tour-guides"
      columns={defaultColumns}
      renderStatusBadge={renderStatusBadge}
      headerTitle="Tour Guides Management"
      headerDescription="Manage all Tour Guides here"
      addButtonLabel="Add New Tour Guide"
      enableTabs={false}
      {...props}
    />
  );
};

export default ActivityManagement;
