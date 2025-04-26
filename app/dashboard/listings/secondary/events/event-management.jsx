import {
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EntityManagement } from "@/app/dashboard/listings/secondary/events/entity-management";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const defaultColumns = [
  {
    key: "title",
    label: "Event",
    visible: true,
    sortable: true,
    render: (event) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={event.images?.[0] || ""} alt={event.title} />
          <AvatarFallback className="bg-blue-100 text-blue-700">
            {event.title
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p
            title={event.title}
            className="font-medium truncate max-w-[150px] text-slate-800"
          >
            {event.title}
          </p>
          <p className="text-sm text-slate-500">{event.category}</p>
        </div>
      </div>
    ),
  },
  {
    key: "location",
    label: "Venue",
    visible: true,
    sortable: true,
    render: (event) => (
      <div
        title={`${event.location?.venue}, ${event.location?.city}`}
        className="text-slate-700 truncate max-w-[150px]"
      >
        {event.location?.venue}, {event.location?.city}
      </div>
    ),
  },
  {
    key: "dateTime",
    label: "Date & Time",
    visible: true,
    sortable: true,
    render: (event) => (
      <div className="text-slate-700">
        <div>{new Date(event.date).toLocaleDateString()}</div>
        <div className="text-sm text-slate-500">
          {event.time} • {event.duration}
        </div>
      </div>
    ),
  },
  {
    key: "entryFee",
    label: "Entry Fee",
    visible: true,
    sortable: true,
    render: (event) => (
      <div className="text-slate-700">
        {event.entryFee?.amount
          ? `${event.entryFee.currency} ${event.entryFee.amount}`
          : "Free"}
      </div>
    ),
  },
  // {
  //   key: "features",
  //   label: "Features",
  //   visible: true,
  //   sortable: false,
  //   render: (event) => (
  //     <div className="text-sm text-slate-600 truncate max-w-[150px]">
  //       {event.highlightedFeatures?.join(", ") || "N/A"}
  //     </div>
  //   ),
  // },
  // {
  //   key: "rating",
  //   label: "Rating",
  //   visible: true,
  //   sortable: false,
  //   render: (event) => {
  //     const slvistaRating = event.slvistaReviews?.[0]?.rating ?? "N/A";
  //     const count = event.travelerReviews?.length || 0;
  //     return (
  //       <div className="flex items-center text-yellow-600 font-medium">
  //         ⭐ {slvistaRating}
  //         <span className="ml-1 text-xs text-slate-500">({count})</span>
  //       </div>
  //     );
  //   },
  // },
  {
    key: "organizer",
    label: "Organizer",
    visible: true,
    sortable: false,
    render: (event) => (
      <div
        title={`${event.organizer?.contact?.phone} - ${event.organizer?.contact?.email}`}
        className="text-sm text-slate-600 truncate max-w-[120px]"
      >
        {event.organizer?.name || "N/A"}
        <br />
        {event.organizer?.contact?.phone || "No phone"}
      </div>
    ),
  },
  {
    key: "audience",
    label: "Audience",
    visible: true,
    sortable: false,
    render: (event) => (
      <div className="text-sm text-slate-600">
        {event.audience || "All ages"}
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
      entityName="event"
      entityPlural="events"
      columns={defaultColumns}
      renderStatusBadge={renderStatusBadge}
      headerTitle="Events Management"
      headerDescription="Manage all your Events and tours"
      addButtonLabel="Add New Event"
      enableTabs={false}
      {...props}
    />
  );
};

export default ActivityManagement;
