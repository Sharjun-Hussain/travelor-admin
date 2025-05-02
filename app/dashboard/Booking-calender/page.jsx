import { BookingCalendar } from "./BookingCalender";

export default function Page() {
  const bookings = [
    {
      name: "Sharjun's Booking",
      startDate: "2025-05-10T10:00:00",
      endDate: "2025-05-12T18:00:00",
    },
    {
      name: "Another Guest",
      startDate: "2025-05-15T12:00:00",
      endDate: "2025-05-16T11:00:00",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bookings Calendar</h1>
      <BookingCalendar />
    </div>
  );
}
