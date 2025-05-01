import {
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EntityManagement } from "@/app/dashboard/listings/secondary/transport/entity-management";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const defaultColumns = [
  {
    key: "title",
    label: "Transport",
    visible: true,
    sortable: true,
    render: (transport) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src={transport.images?.[0] || ""}
            alt={transport.title}
          />
          <AvatarFallback className="bg-emerald-100 text-emerald-700">
            {transport.title
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p
            title={transport.title}
            className="font-medium truncate max-w-[150px] text-slate-800"
          >
            {transport.title}
          </p>
          <p className="text-sm text-slate-500">{transport.transportType}</p>
        </div>
      </div>
    ),
  },
  {
    key: "operatorName",
    label: "Operator",
    visible: true,
    sortable: true,
    render: (transport) => (
      <div
        title={transport.operatorName}
        className="text-slate-700 truncate max-w-[150px]  "
      >
        {transport.operatorName}
      </div>
    ),
  },
  // {
  //   key: "route",
  //   label: "Route",
  //   visible: true,
  //   sortable: true,
  //   render: (transport) => (
  //     <div className="flex items-center">
  //       <MapPin className="h-3 w-3 text-slate-400 mr-1" />
  //       <span>
  //         {transport.location?.departureCity} →{" "}
  //         {transport.location?.arrivalCity}
  //       </span>
  //     </div>
  //   ),
  // },
  {
    key: "pricePerKmUSD",
    label: "Price/km",
    visible: true,
    sortable: true,
    render: (transport) => (
      <div className="text-slate-700">${transport.pricePerKmUSD} USD/km</div>
    ),
  },
  {
    key: "vistaVerified",
    label: "Verified",
    visible: true,
    sortable: false,
    render: (transport) => (
      <Badge variant={transport.vistaVerified ? "success" : "outline"}>
        {transport.vistaVerified ? "Verified" : "Not Verified"}
      </Badge>
    ),
  },
  {
    key: "rating",
    label: "Rating",
    visible: true,
    sortable: false,
    render: (transport) => {
      const rating = transport.reviews?.vistaReview?.rating || "N/A";
      const count = transport.reviews?.travelerReviews?.length || 0;
      return (
        <div className="flex items-center text-yellow-600 font-medium">
          ⭐ {rating}
          <span className="ml-1 text-xs text-slate-500">({count})</span>
        </div>
      );
    },
  },
  // {
  //   key: "amenities",
  //   label: "Amenities",
  //   visible: true,
  //   sortable: false,
  //   render: (transport) => (
  //     <div className="text-sm text-slate-600">
  //       {transport.amenities?.find((a) => a.type === "Air Conditioned")
  //         ?.available
  //         ? "AC"
  //         : "No AC"}
  //       {transport.amenities?.find((a) => a.type === "Passenger Capacity")
  //         ?.value && (
  //         <>
  //           ,{" "}
  //           {
  //             transport.amenities.find((a) => a.type === "Passenger Capacity")
  //               .value
  //           }{" "}
  //           seats
  //         </>
  //       )}
  //     </div>
  //   ),
  // },
  {
    key: "contactDetails",
    label: "Contact",
    visible: true,
    sortable: false,
    render: (transport) => (
      <div
        title={`${transport.phone} - ${transport.email} `}
        className="text-sm text-slate-600 truncate max-w-[100px]"
      >
        {transport?.phone || "No phone"}
        <br />
        {transport?.email || "No email"}
        <br />
        {transport?.website ? <Link> {transport?.website}</Link> : "No Website"}
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
