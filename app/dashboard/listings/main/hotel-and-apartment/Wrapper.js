"use client";
import React from "react";
import dynamic from "next/dynamic";
const HotelManagement = dynamic(() => import("./hotel-management"), {
  ssr: false,
});

const PageWrapper = () => {
  // Mock API functions
  const fetchFunction = async () => {
    // Simulating API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    // await await fetch(`/api/hosts/${id}`, {
    //   method: "GET",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(rest),
    // });

    // if (!response.ok) {
    //   throw new Error("Failed to update host");
    // }

    // return await response.json();
    return [
      {
        id: 1,
        merchantId: 1,
        propertyType: "hotel",
        title: "Omega Hotel",
        slug: "omega-hotel",
        address: "677/C V.H Road, Sainthamaruthu - 14",
        city: "Kalmunai",
        district: "Ampara",
        province: "Eastern",
        country: "Sri Lanka",
        postalCode: "32300",
        cancellationPolicy: "moderate",
        latitude: 7.4164,
        longitude: 81.8256,
        checkInTime: "14:00:00",
        checkOutTime: "12:00:00",
        description: "A luxurious beachfront hotel with panoramic ocean views, featuring modern amenities and exceptional service.",
        isActive: true,
        vistaVerified: false,
        phone: "+94771234567",
        email: "reservations@oceanviewgrand.com",
        website: "https://www.oceanviewgrand.com",
        availabilityStatus: "available",
        approvalStatus: "pending",
        rejectionReason: null,
        approvedAt: null,
        lastStatusChange: null,
        createdAt: "2025-05-20T05:10:15.000Z",
        updatedAt: "2025-05-22T06:22:30.000Z",
        deletedAt: null,
        amenities: [
          {
            id: 1,
            language_code: "en",
            name: "A/C",
            slug: "ac",
            icon: "https://example.com/icons/non-ac.png",
            category: null,
            isActive: true,
            PropertyAmenity: {
              isAvailable: true,
              notes: null
            }
          },
          {
            id: 2,
            language_code: "en",
            name: "Pool",
            slug: "pool",
            icon: "https://example.com/icons/pool.png",
            category: "facility",
            isActive: true,
            PropertyAmenity: {
              isAvailable: true,
              notes: "Main pool under maintenance until June 1"
            }
          }
        ],
        images: [
          {
            id: 2,
            propertyId: 1,
            imageUrl: "https://slvista.s3.eu-north-1.amazonaws.com/uploads/property/1/1056c3f9-1d30-4ade-a44e-1a81fbb8e6ff.png",
            s3Key: "uploads/property/1/1056c3f9-1d30-4ade-a44e-1a81fbb8e6ff.png",
            fileName: "abcd.png",
            isFeatured: true,
            sortOrder: 0
          }
        ]
      },
      {
        id: 2,
        merchantId: 2,
        propertyType: "apartment",
        title: "Colombo City Apartments",
        slug: "colombo-city-apartments",
        address: "120 Galle Road, Colombo 03",
        city: "Colombo",
        district: "Colombo",
        province: "Western",
        country: "Sri Lanka",
        postalCode: "00300",
        cancellationPolicy: "flexible",
        latitude: 6.9271,
        longitude: 79.8612,
        checkInTime: "13:00:00",
        checkOutTime: "11:00:00",
        description: "Modern apartments in the heart of Colombo with city views and convenient access to business districts.",
        isActive: true,
        vistaVerified: true,
        phone: "+94776543210",
        email: "bookings@colomboapartments.com",
        website: "https://www.colomboapartments.com",
        availabilityStatus: "available",
        approvalStatus: "approved",
        rejectionReason: null,
        approvedAt: "2025-05-15T10:30:00.000Z",
        lastStatusChange: "2025-05-15T10:30:00.000Z",
        createdAt: "2025-05-10T08:15:22.000Z",
        updatedAt: "2025-05-18T14:45:10.000Z",
        deletedAt: null,
        amenities: [
          {
            id: 3,
            language_code: "en",
            name: "WiFi",
            slug: "wifi",
            icon: "https://example.com/icons/wifi.png",
            category: "internet",
            isActive: true,
            PropertyAmenity: {
              isAvailable: true,
              notes: "High-speed 100Mbps"
            }
          },
          {
            id: 4,
            language_code: "en",
            name: "Gym",
            slug: "gym",
            icon: "https://example.com/icons/gym.png",
            category: "facility",
            isActive: true,
            PropertyAmenity: {
              isAvailable: true,
              notes: "24/7 access"
            }
          }
        ],
        images: [
          {
            id: 3,
            propertyId: 2,
            imageUrl: "https://slvista.s3.eu-north-1.amazonaws.com/uploads/property/2/apartment-view.jpg",
            s3Key: "uploads/property/2/apartment-view.jpg",
            fileName: "apartment-view.jpg",
            isFeatured: true,
            sortOrder: 0
          }
        ]
      },
      {
        id: 3,
        merchantId: 3,
        propertyType: "hotel",
        title: "Mountain View Resort",
        slug: "mountain-view-resort",
        address: "12 Plantation Road, Nuwara Eliya",
        city: "Nuwara Eliya",
        district: "Nuwara Eliya",
        province: "Central",
        country: "Sri Lanka",
        postalCode: "22200",
        cancellationPolicy: "strict",
        latitude: 6.9708,
        longitude: 80.7829,
        checkInTime: "12:00:00",
        checkOutTime: "10:00:00",
        description: "Charming colonial-style resort nestled in the tea country with breathtaking mountain views.",
        isActive: true,
        vistaVerified: true,
        phone: "+94771239876",
        email: "info@mountainviewresort.com",
        website: null,
        availabilityStatus: "limited",
        approvalStatus: "approved",
        rejectionReason: null,
        approvedAt: "2025-04-28T09:15:33.000Z",
        lastStatusChange: "2025-04-28T09:15:33.000Z",
        createdAt: "2025-04-20T11:05:18.000Z",
        updatedAt: "2025-05-01T16:20:45.000Z",
        deletedAt: null,
        amenities: [
          {
            id: 5,
            language_code: "en",
            name: "Restaurant",
            slug: "restaurant",
            icon: "https://example.com/icons/restaurant.png",
            category: "dining",
            isActive: true,
            PropertyAmenity: {
              isAvailable: true,
              notes: "Serves local and international cuisine"
            }
          },
          {
            id: 6,
            language_code: "en",
            name: "Parking",
            slug: "parking",
            icon: "https://example.com/icons/parking.png",
            category: "transport",
            isActive: true,
            PropertyAmenity: {
              isAvailable: true,
              notes: "Free for guests"
            }
          }
        ],
        images: [
          {
            id: 4,
            propertyId: 3,
            imageUrl: "https://slvista.s3.eu-north-1.amazonaws.com/uploads/property/3/resort-exterior.jpg",
            s3Key: "uploads/property/3/resort-exterior.jpg",
            fileName: "resort-exterior.jpg",
            isFeatured: true,
            sortOrder: 0
          },
          {
            id: 5,
            propertyId: 3,
            imageUrl: "https://slvista.s3.eu-north-1.amazonaws.com/uploads/property/3/resort-room.jpg",
            s3Key: "uploads/property/3/resort-room.jpg",
            fileName: "resort-room.jpg",
            isFeatured: false,
            sortOrder: 1
          }
        ]
      },
      {
        id: 4,
        merchantId: 4,
        propertyType: "apartment",
        title: "Beachside Villas",
        slug: "beachside-villas",
        address: "45 Beach Road, Unawatuna",
        city: "Galle",
        district: "Galle",
        province: "Southern",
        country: "Sri Lanka",
        postalCode: "80600",
        cancellationPolicy: "moderate",
        latitude: 6.0167,
        longitude: 80.2167,
        checkInTime: "15:00:00",
        checkOutTime: "11:00:00",
        description: "Private beachfront villas with direct access to the sandy beach and ocean views from every room.",
        isActive: false,
        vistaVerified: false,
        phone: "+94773456789",
        email: "contact@beachsidevillas.com",
        website: "https://www.beachsidevillas.com",
        availabilityStatus: "unavailable",
        approvalStatus: "rejected",
        rejectionReason: "Incomplete documentation",
        approvedAt: null,
        lastStatusChange: "2025-05-05T14:10:22.000Z",
        createdAt: "2025-04-25T09:30:15.000Z",
        updatedAt: "2025-05-05T14:10:22.000Z",
        deletedAt: null,
        amenities: [
          {
            id: 7,
            language_code: "en",
            name: "Beach Access",
            slug: "beach-access",
            icon: "https://example.com/icons/beach.png",
            category: "location",
            isActive: true,
            PropertyAmenity: {
              isAvailable: true,
              notes: "Private beach area"
            }
          },
          {
            id: 8,
            language_code: "en",
            name: "Kitchen",
            slug: "kitchen",
            icon: "https://example.com/icons/kitchen.png",
            category: "room",
            isActive: true,
            PropertyAmenity: {
              isAvailable: true,
              notes: "Fully equipped"
            }
          }
        ],
        images: [
          {
            id: 6,
            propertyId: 4,
            imageUrl: "https://slvista.s3.eu-north-1.amazonaws.com/uploads/property/4/villa-exterior.jpg",
            s3Key: "uploads/property/4/villa-exterior.jpg",
            fileName: "villa-exterior.jpg",
            isFeatured: true,
            sortOrder: 0
          }
        ]
      }
    ];
  };

  const addFunction = async (newHost) => {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      id: Date.now(),
      ...newHost,
    };
  };

  const updateFunction = async (updatedHost) => {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    return updatedHost;
  };

  const deletFucntion = async (id) => {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 600));
    alert(id);
    return id;
  };

  return (
    <>
      <HotelManagement
        fetchEntities={fetchFunction}
        addEntity={addFunction}
        updateEntity={updateFunction}
        deleteEntity={deletFucntion}
      />
    </>
  );
};

export default PageWrapper;
