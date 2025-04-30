// components/BookingCalendar.jsx
"use client";

import { Calendar, momentLocalizer } from 'react-big-calendar';
import { parseISO } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

// Required for react-big-calendar
const localizer = momentLocalizer(moment);

const BookingCalendar = ({ bookings }) => {
  const events = bookings.map((booking) => ({
    title: booking.name,
    start: parseISO(booking.startDate),
    end: parseISO(booking.endDate),
  }));

  return (
    <div style={{ height: '80vh' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default BookingCalendar;
