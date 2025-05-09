import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { BookingManagementTable, DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import React from "react";

const sampleBookingData = [
  {
    id: 1,
    bookingId: "BK1001",
    guestName: "John Smith",
    property: "Beachfront Villa, Bali",
    checkIn: "2024-07-15",
    checkOut: "2024-07-22",
    status: "Confirmed",
    paymentStatus: "Paid",
    totalAmount: "2450.00",
    rating: 4.8
  },
  {
    id: 2,
    bookingId: "BK1002",
    guestName: "Sarah Johnson",
    property: "Mountain View Cabin, Aspen",
    checkIn: "2024-08-05",
    checkOut: "2024-08-12",
    status: "Pending",
    paymentStatus: "Pending",
    totalAmount: "1800.00",
    rating: 4.5
  },
  {
    id: 3,
    bookingId: "BK1003",
    guestName: "Michael Chen",
    property: "Luxury Penthouse, NYC",
    checkIn: "2024-06-20",
    checkOut: "2024-06-25",
    status: "Completed",
    paymentStatus: "Paid",
    totalAmount: "3200.00",
    rating: 4.9
  },
  {
    id: 4,
    bookingId: "BK1004",
    guestName: "Emily Wilson",
    property: "Countryside Cottage, Tuscany",
    checkIn: "2024-09-10",
    checkOut: "2024-09-20",
    status: "Confirmed",
    paymentStatus: "Paid",
    totalAmount: "2750.00",
    rating: 4.7
  },
  {
    id: 5,
    bookingId: "BK1005",
    guestName: "David Kim",
    property: "City Loft, Tokyo",
    checkIn: "2024-07-01",
    checkOut: "2024-07-07",
    status: "Cancelled",
    paymentStatus: "Refunded",
    totalAmount: "1950.00",
    rating: 4.2
  },
  {
    id: 6,
    bookingId: "BK1006",
    guestName: "Lisa Rodriguez",
    property: "Lakefront Cabin, Canada",
    checkIn: "2024-08-15",
    checkOut: "2024-08-22",
    status: "Confirmed",
    paymentStatus: "Paid",
    totalAmount: "2100.00",
    rating: 4.6
  },
  {
    id: 7,
    bookingId: "BK1007",
    guestName: "Robert Taylor",
    property: "Desert Oasis, Dubai",
    checkIn: "2024-10-05",
    checkOut: "2024-10-15",
    status: "Pending",
    paymentStatus: "Pending",
    totalAmount: "4300.00",
    rating: 4.4
  },
  {
    id: 8,
    bookingId: "BK1008",
    guestName: "Sophia Martinez",
    property: "Historic Apartment, Paris",
    checkIn: "2024-06-25",
    checkOut: "2024-07-02",
    status: "Completed",
    paymentStatus: "Paid",
    totalAmount: "2850.00",
    rating: 4.9
  },
  {
    id: 9,
    bookingId: "BK1009",
    guestName: "James Wilson",
    property: "Ski Chalet, Switzerland",
    checkIn: "2024-12-10",
    checkOut: "2024-12-20",
    status: "Confirmed",
    paymentStatus: "Paid",
    totalAmount: "5200.00",
    rating: 4.7
  },
  {
    id: 10,
    bookingId: "BK1010",
    guestName: "Olivia Brown",
    property: "Beach House, Malibu",
    checkIn: "2024-07-30",
    checkOut: "2024-08-06",
    status: "Cancelled",
    paymentStatus: "Failed",
    totalAmount: "3800.00",
    rating: 4.1
  },
  {
    id: 11,
    bookingId: "BK1011",
    guestName: "Daniel Lee",
    property: "Treehouse Retreat, Costa Rica",
    checkIn: "2024-09-05",
    checkOut: "2024-09-12",
    status: "Confirmed",
    paymentStatus: "Paid",
    totalAmount: "1750.00",
    rating: 4.8
  },
  {
    id: 12,
    bookingId: "BK1012",
    guestName: "Emma Garcia",
    property: "Vineyard Villa, Napa Valley",
    checkIn: "2024-08-25",
    checkOut: "2024-08-30",
    status: "Pending",
    paymentStatus: "Pending",
    totalAmount: "2950.00",
    rating: 4.5
  }
];

const page = () => {
  return (
    <div>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6"><ChartAreaInteractive /></div>
            <BookingManagementTable  data={sampleBookingData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
