"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { parseISO, format } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
// import { useToast } from "@/components/ui/use-toast";
// import BookingForm from "./BookingForm";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse: parseISO,
  startOfWeek: 0,
  getDay: (date) => date.getDay(),
  locales,
});

export default function BookingCalendar() {
  // const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());

  // const fetchBookings = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch("/api/bookings");
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch bookings");
  //     }
  //     const data = await response.json();
  //     const formattedEvents = data.map((booking) => ({
  //       id: booking.id,
  //       title: `${booking.name} - ${booking.service}`,
  //       start: parseISO(booking.startDate),
  //       end: parseISO(booking.endDate),
  //       resource: booking,
  //     }));
  //     setEvents(formattedEvents);
  //   } catch (err) {
  //     console.error("Error fetching bookings:", err);
  //     toast.error({
  //       title: "Error",
  //       description: "Failed to load bookings",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchBookings();
  // }, [fetchBookings]);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
    setOpenDialog(true);
  };

  const handleSlotSelect = (slotInfo) => {
    setSelectedEvent({
      id: "",
      name: "",
      service: "",
      startDate: slotInfo.start.toISOString(),
      endDate: slotInfo.end.toISOString(),
    });
    setOpenDialog(true);
  };

  const handleBookingSuccess = () => {
    fetchBookings();
    setOpenDialog(false);
    toast.success({
      title: "Success",
      description: selectedEvent?.id
        ? "Booking updated successfully"
        : "Booking created successfully",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Booking Calendar</h2>
        <Button onClick={() => setOpenDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      <div className="h-[600px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSlotSelect}
          selectable
          defaultView={Views.WEEK}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          step={30}
          timeslots={2}
          min={new Date(0, 0, 0, 8, 0, 0)} // 8:00 AM
          max={new Date(0, 0, 0, 22, 0, 0)} // 10:00 PM
          eventPropGetter={() => ({
            style: {
              backgroundColor: "#3b82f6",
              color: "white",
              borderRadius: "4px",
              border: "none",
            },
          })}
          dayPropGetter={(date) => ({
            style: {
              backgroundColor:
                date.getDate() === new Date().getDate() ? "#f0f9ff" : "",
            },
          })}
        />
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent?.id ? "Booking Details" : "New Booking"}
            </DialogTitle>
          </DialogHeader>
          {/* <BookingForm
            booking={selectedEvent}
            onSuccess={handleBookingSuccess}
            onCancel={() => setOpenDialog(false)}
          /> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
