import {
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  Star,
  Utensils,
  Wine,
  Coffee,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EntityManagement } from "./entity-management";

const defaultColumns = [
  {
    key: "title",
    label: "Restaurant/Cafe",
    visible: true,
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={item.images?.[0] || ""} alt={item.name} />
          <AvatarFallback className="bg-amber-100 text-amber-700">
            {item.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p
            title={item.name}
            className="font-medium truncate max-w-[150px] text-slate-800"
          >
            {item.name}
          </p>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            {item.type === 'restaurant' ? <Utensils size={14} /> : <Coffee size={14} />}
            {item.cuisineType}
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "location",
    label: "Location",
    visible: true,
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-1 text-slate-700">
        <MapPin size={14} className="text-rose-500" />
        {item.location?.address}, {item.location?.city}
      </div>
    ),
  },
  {
    key: "cuisineType",
    label: "Cuisine & Type",
    visible: true,
    sortable: false,
    render: (item) => (
      <div className="flex flex-wrap gap-1 max-w-[180px]">
        {item.cuisineType && (
          <Badge variant="outline" className="text-xs">
            {item.cuisineType}
          </Badge>
        )}
        {item.dietaryOptions?.map((option) => (
          <Badge variant="outline" className="text-xs" key={option}>
            {option}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    key: "rating",
    label: "Rating",
    visible: true,
    sortable: true,
    render: (item) => {
      const rating = item.rating ?? "N/A";
      const count = item.reviews?.length || 0;
      return (
        <div className="flex items-center text-yellow-600 font-medium">
          <Star className="h-4 w-4 fill-yellow-400 mr-1" /> {rating}
          <span className="ml-1 text-xs text-slate-500">({count})</span>
        </div>
      );
    },
  },
  // {
  //   key: "priceRange",
  //   label: "Price Range",
  //   visible: true,
  //   sortable: true,
  //   render: (item) => (
  //     <div className="text-sm text-slate-600">
  //       {item.priceRange ? (
  //         <div className="flex items-center">
  //           {Array.from({ length: 4 }).map((_, i) => (
  //             <span
  //               key={i}
  //               className={`${i < item.priceRange ? 'text-amber-500' : 'text-slate-300'}`}
  //             >
  //               $
  //             </span>
  //           ))}
  //         </div>
  //       ) : (
  //         "N/A"
  //       )}
  //     </div>
  //   ),
  // },
  // {
  //   key: "openingHours",
  //   label: "Opening Hours",
  //   visible: true,
  //   sortable: false,
  //   render: (item) => (
  //     <div className="flex items-center gap-1 text-sm text-slate-600">
  //       <Clock size={14} className="text-blue-500" />
  //       {item.openingHours?.length ? (
  //         <span>{item.openingHours[0]} - {item.openingHours[1]}</span>
  //       ) : (
  //         "Not available"
  //       )}
  //     </div>
  //   ),
  // },
  // {
  //   key: "reservation",
  //   label: "Reservation",
  //   visible: true,
  //   sortable: false,
  //   render: (item) => (
  //     <div className="text-sm text-slate-600">
  //       {item.acceptsReservation ? (
  //         <Badge className="bg-green-100 text-green-800">Accepts</Badge>
  //       ) : (
  //         <Badge variant="outline">Walk-in only</Badge>
  //       )}
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
    case "closed":
      return (
        <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-0">
          <XCircle className="mr-1 h-3 w-3" /> Closed
        </Badge>
      );
    case "seasonal":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-0">
          <Calendar className="mr-1 h-3 w-3" /> Seasonal
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const FoodAndBeverageManagement = (props) => {
  return (
    <EntityManagement
      entityName="food-and-beverage"
      entityPlural="food-and-beverage"
      columns={defaultColumns}
      renderStatusBadge={renderStatusBadge}
      headerTitle="Food & Beverage Management"
      headerDescription="Manage restaurants, cafes, and bars in your properties"
      addButtonLabel="Add New Food & Beverage"
      enableTabs={true}
      tabs={[
        { value: "all", label: "All Venues" },
        { value: "restaurants", label: "Restaurants" },
        { value: "cafes", label: "Cafes" },
        { value: "bars", label: "Bars" },
        { value: "room-service", label: "Room Service" },
      ]}
      {...props}
    />
  );
};

export default FoodAndBeverageManagement;