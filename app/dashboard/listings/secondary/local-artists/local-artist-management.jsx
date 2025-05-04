import {
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EntityManagement } from "@/app/dashboard/listings/secondary/local-artists/entity-management";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const defaultColumns = [
  {
    key: "title",
    label: "Artist",
    visible: true,
    sortable: true,
    render: (artist) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={artist.images?.[0] || ""} alt={artist.name} />
          <AvatarFallback className="bg-indigo-100 text-indigo-700">
            {artist.title
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p
            title={artist.title}
            className="font-medium truncate max-w-[150px] text-slate-800"
          >
            {artist.title}
          </p>
          <p className="text-sm text-slate-500">{artist.specialization}</p>
        </div>
      </div>
    ),
  },
  {
    key: "location",
    label: "Location",
    visible: true,
    sortable: true,
    render: (artist) => (
      <div className="text-slate-700">
        {artist?.city}, {artist?.province}
      </div>
    ),
  },

  {
    key: "rating",
    label: "Rating",
    visible: true,
    sortable: false,
    render: (artist) => {
      const rating = artist.rating ?? "N/A";
      const count = artist.travelerReviews?.length || 0;
      return (
        <div className="flex items-center text-yellow-600 font-medium">
          ⭐ {rating}
          <span className="ml-1 text-xs text-slate-500">({count})</span>
        </div>
      );
    },
  },
  {
    key: "vistaVerified",
    label: "Verified",
    visible: true,
    sortable: false,
    render: (artist) => (
      <Badge variant={artist.vistaVerified ? "success" : "outline"}>
        {artist.vistaVerified ? "Verified" : "Not Verified"}
      </Badge>
    ),
  },
  {
    key: "contactDetails",
    label: "Contact",
    visible: true,
    sortable: false,
    render: (artist) => (
      <div
        title={`${artist?.phone} - ${artist?.email}`}
        className="text-sm text-slate-600 truncate max-w-[200px]"
      >
        {artist?.phone || "No phone"}
        <br />
        {artist?.email || "No email"}
        <br />
        {artist?.website ? (
          <Link href={artist?.website}> {artist?.website}</Link>
        ) : (
          "No Website"
        )}
      </div>
    ),
  },
  // {
  //   key: "reviews",
  //   label: "Reviews",
  //   visible: true,
  //   sortable: false,
  //   render: (artist) => (
  //     <div className="text-sm text-slate-600">
  //       {artist.travelerReviews?.length || 0} traveler,{" "}
  //       {artist.slvistaReviews?.length || 0} slvista
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
      entityName="local-artist"
      entityPlural="local-artists"
      columns={defaultColumns}
      renderStatusBadge={renderStatusBadge}
      headerTitle="Local Artist Management"
      headerDescription="Manage all Local Artists "
      addButtonLabel="Add New Local artist"
      enableTabs={false}
      {...props}
    />
  );
};

export default ActivityManagement;
