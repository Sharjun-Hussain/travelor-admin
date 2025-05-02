"use client";

import { useState } from "react";
import {
  format,
  addDays,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  isSameWeek,
  isSameDay,
  parseISO,
  eachDayOfInterval,
  isToday,
  isWithinInterval,
  addMonths,
  subMonths,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Hotel,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Enhanced demo data with more variety
const demoBookings = [
  {
    id: "b1",
    property: "Sunset Resort",
    propertyType: "hotel",
    checkIn: new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0],
    checkOut: new Date(new Date().setDate(new Date().getDate() + 4))
      .toISOString()
      .split("T")[0],
    guestName: "John Smith",
    status: "confirmed",
    color: "bg-gradient-to-r from-blue-500 to-blue-600",
    price: "$1,200",
    rooms: 2,
  },
  {
    id: "b2",
    property: "Mountain Cabin",
    propertyType: "vacation-home",
    checkIn: new Date(new Date().setDate(new Date().getDate() + 3))
      .toISOString()
      .split("T")[0],
    checkOut: new Date(new Date().setDate(new Date().getDate() + 8))
      .toISOString()
      .split("T")[0],
    guestName: "Sarah Johnson",
    status: "confirmed",
    color: "bg-gradient-to-r from-green-500 to-green-600",
    price: "$1,800",
    rooms: 1,
  },
  {
    id: "b3",
    property: "City Apartment",
    propertyType: "apartment",
    checkIn: new Date(new Date().setDate(new Date().getDate() - 2))
      .toISOString()
      .split("T")[0],
    checkOut: new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0],
    guestName: "Michael Brown",
    status: "completed",
    color: "bg-gradient-to-r from-purple-500 to-purple-600",
    price: "$950",
    rooms: 1,
  },
  {
    id: "b4",
    property: "Airport Transit Hotel",
    propertyType: "hotel",
    checkIn: new Date(new Date().setDate(new Date().getDate() + 5))
      .toISOString()
      .split("T")[0],
    checkOut: new Date(new Date().setDate(new Date().getDate() + 6))
      .toISOString()
      .split("T")[0],
    guestName: "Emily Davis",
    status: "pending",
    color: "bg-gradient-to-r from-yellow-500 to-yellow-600",
    price: "$150",
    rooms: 1,
  },
];

const propertyTypes = [
  { value: "all", label: "All Properties", icon: <Home className="h-4 w-4" /> },
  { value: "hotel", label: "Hotels", icon: <Hotel className="h-4 w-4" /> },
  {
    value: "vacation-home",
    label: "Vacation Homes",
    icon: <Home className="h-4 w-4" />,
  },
  {
    value: "apartment",
    label: "Apartments",
    icon: <Home className="h-4 w-4" />,
  },
];

const statusTypes = [
  { value: "all", label: "All Statuses" },
  {
    value: "confirmed",
    label: "Confirmed",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
  {
    value: "completed",
    label: "Completed",
    color: "bg-blue-100 text-blue-800",
  },
];

export function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const nextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const prevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
    setSelectedBooking(null);
  };

  const getPropertyIcon = (type) => {
    switch (type) {
      case "hotel":
        return <Hotel className="h-3 w-3" />;
      case "vacation-home":
        return <Home className="h-3 w-3" />;
      case "apartment":
        return <Home className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const filteredBookings = demoBookings.filter((booking) => {
    const matchesProperty =
      selectedProperty === "all" || booking.propertyType === selectedProperty;
    const matchesStatus =
      selectedStatus === "all" || booking.status === selectedStatus;
    return matchesProperty && matchesStatus;
  });

  const renderHeader = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);

    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Booking Calendar</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-center">
            <h2 className="text-lg font-semibold">
              {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {format(currentDate, "MMMM yyyy")}
            </p>
          </div>

          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant={
              isSameWeek(new Date(), currentDate) ? "default" : "outline"
            }
            onClick={() => {
              setCurrentDate(new Date());
              setSelectedDate(new Date());
            }}
            className="hidden sm:inline-flex"
          >
            Today
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by property" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    {type.icon}
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusTypes.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  <div className="flex items-center gap-2">
                    {status.color && (
                      <span
                        className={`h-2 w-2 rounded-full ${
                          status.color.split(" ")[0]
                        }`}
                      />
                    )}
                    {status.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  const renderWeekDays = () => {
    const days = eachDayOfInterval({
      start: startOfWeek(currentDate),
      end: endOfWeek(currentDate),
    });

    return (
      <div className="grid grid-cols-7 gap-1 mb-4">
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrent = isToday(day);

          return (
            <div
              key={day.toString()}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors cursor-pointer ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : isCurrent
                  ? "bg-primary/10"
                  : "hover:bg-accent/50"
              }`}
              onClick={() => onDateClick(day)}
            >
              <div className="text-sm font-medium">{format(day, "EEE")}</div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full mt-1 text-sm font-medium ${
                  isSelected ? "bg-primary-foreground text-primary" : ""
                }`}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const days = eachDayOfInterval({
      start: startOfWeek(currentDate),
      end: endOfWeek(currentDate),
    });

    return (
      <div className="mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
          {days.map((day) => {
            const dayBookings = filteredBookings.filter((booking) => {
              const checkIn = parseISO(booking.checkIn);
              const checkOut = parseISO(booking.checkOut);
              return (
                isWithinInterval(day, { start: checkIn, end: checkOut }) ||
                isSameDay(day, checkIn) ||
                isSameDay(day, checkOut)
              );
            });

            return (
              <div
                key={day.toString()}
                className={`border rounded-xl p-3 min-h-48 ${
                  isSameDay(day, selectedDate)
                    ? "border-primary/50 bg-primary/5"
                    : "border-muted/50"
                } ${isToday(day) ? "bg-primary/5" : ""} transition-colors`}
              >
                <div className="space-y-2">
                  {dayBookings.map((booking) => {
                    const isCheckIn = isSameDay(parseISO(booking.checkIn), day);
                    const isCheckOut = isSameDay(
                      parseISO(booking.checkOut),
                      day
                    );

                    return (
                      <div
                        key={`${booking.id}-${day.toString()}`}
                        className={`p-2 rounded-lg ${booking.color} text-white cursor-pointer hover:opacity-90 transition-opacity shadow-sm`}
                        onClick={() => {
                          setSelectedDate(day);
                          setSelectedBooking(booking);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getPropertyIcon(booking.propertyType)}
                            <span className="ml-2 text-sm font-medium">
                              {isCheckIn
                                ? "Arrival"
                                : isCheckOut
                                ? "Departure"
                                : "Stay"}
                            </span>
                          </div>
                          {isCheckIn && <ArrowRight className="h-4 w-4" />}
                        </div>
                        <div className="mt-1 text-xs">{booking.property}</div>
                        {isCheckIn && (
                          <div className="mt-1 text-xs font-medium">
                            {booking.guestName}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderBookingDetails = () => {
    const selectedBookings = filteredBookings.filter((booking) => {
      const checkIn = parseISO(booking.checkIn);
      const checkOut = parseISO(booking.checkOut);
      return (
        isSameDay(selectedDate, checkIn) ||
        isSameDay(selectedDate, checkOut) ||
        isWithinInterval(selectedDate, { start: checkIn, end: checkOut })
      );
    });

    if (selectedBooking) {
      const booking = selectedBooking;
      const checkIn = parseISO(booking.checkIn);
      const checkOut = parseISO(booking.checkOut);
      const isCurrent = isWithinInterval(new Date(), {
        start: checkIn,
        end: checkOut,
      });

      return (
        <Card className="border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    booking.color.split(" ")[0]
                  }`}
                ></div>
                <div>
                  <h2 className="font-semibold">{booking.property}</h2>
                  <p className="text-sm text-muted-foreground font-normal">
                    {format(checkIn, "MMM d")} -{" "}
                    {format(checkOut, "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  booking.status === "confirmed"
                    ? "default"
                    : booking.status === "pending"
                    ? "secondary"
                    : booking.status === "cancelled"
                    ? "destructive"
                    : "outline"
                }
              >
                {booking.status}
                {isCurrent && booking.status === "confirmed" && (
                  <span className="ml-2 relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                )}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Guest Information
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="font-medium">{booking.guestName}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Booking ID: {booking.id}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Property Details
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Type
                      </span>
                      <span className="capitalize">
                        {booking.propertyType.replace("-", " ")}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-muted-foreground">
                        Rooms
                      </span>
                      <span>{booking.rooms}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Stay Details
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Check-in</p>
                        <p className="text-sm">
                          {format(checkIn, "EEE, MMM d")}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Check-out</p>
                        <p className="text-sm">
                          {format(checkOut, "EEE, MMM d")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Payment
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total</span>
                      <span className="text-lg font-bold">{booking.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 border-t pt-4">
            <Button variant="outline" className="w-full sm:w-auto">
              Send Message
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" className="flex-1">
                Modify
              </Button>
              <Button className="flex-1">View Full Details</Button>
            </div>
          </CardFooter>
        </Card>
      );
    }

    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <span>Bookings for {format(selectedDate, "MMMM d, yyyy")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedBookings.length > 0 ? (
            <div className="space-y-3">
              {selectedBookings.map((booking) => {
                const checkIn = parseISO(booking.checkIn);
                const checkOut = parseISO(booking.checkOut);
                const isCurrent = isWithinInterval(new Date(), {
                  start: checkIn,
                  end: checkOut,
                });

                return (
                  <div
                    key={booking.id}
                    className="border rounded-lg p-4 hover:border-primary/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              booking.color.split(" ")[0]
                            }`}
                          ></span>
                          {booking.property}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(checkIn, "MMM d")} -{" "}
                          {format(checkOut, "MMM d, yyyy")}
                        </p>
                      </div>
                      <Badge
                        variant={
                          booking.status === "confirmed"
                            ? "default"
                            : booking.status === "pending"
                            ? "secondary"
                            : booking.status === "cancelled"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {booking.status}
                        {isCurrent && booking.status === "confirmed" && (
                          <span className="ml-2 relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                        )}
                      </Badge>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Guest: {booking.guestName}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          {booking.price}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarDays className="mx-auto h-8 w-8 mb-2" />
              <p>No bookings for selected date</p>
              <Button variant="ghost" className="mt-4">
                Create New Booking
              </Button>
            </div>
          )}
        </CardContent>
        {selectedBookings.length > 0 && (
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline">Export Data</Button>
            <Button>Create New Booking</Button>
          </CardFooter>
        )}
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {renderHeader()}
      {renderWeekDays()}
      {renderWeekView()}
      {renderBookingDetails()}
    </div>
  );
}
