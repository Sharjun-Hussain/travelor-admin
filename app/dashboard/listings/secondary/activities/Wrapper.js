"use client";
import React from "react";
import dynamic from "next/dynamic";
const ActivityManagement = dynamic(() => import("./activity-management"), {
  ssr: false,
});

const PageWrapper = () => {
  // Mock API functions
  const fetchFunction = async () => {
    // Simulating API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
      {
        id: "activity_001",
        title: "Sigiriya Rock Fortress Climb",
        images: [
          "https://images.unsplash.com/photo-1601233749941-7f4d3e8c8e2f",
        ],
        reviews: {
          vistaReview: {
            rating: 4.8,
            text: "A breathtaking historical climb and a must-do in Sri Lanka!",
          },
          travelerReviews: [],
        },
        vistaVerified: true,
        priceRangeUSD: "$15",
        contactDetails: {
          phone: "0757483223",
          email: "",
          website: "",
        },
        fullDescription:
          "Climb the ancient rock fortress of Sigiriya, a UNESCO World Heritage Site with breathtaking views and ancient frescoes.",
        location: {
          city: "Sigiriya",
          district: "Central Province",
          coordinates: {
            lat: 7.957,
            lng: 80.7603,
          },
        },
        type: "Historical",
      },
      {
        id: "activity_002",
        title: "Whale Watching in Mirissa",
        images: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        ],
        reviews: {
          vistaReview: {
            rating: 4.6,
            text: "An unforgettable ocean adventure spotting whales up close!",
          },
          travelerReviews: [],
        },
        vistaVerified: true,
        priceRangeUSD: "$23",
        contactDetails: {
          phone: "",
          email: "",
          website: "",
        },
        fullDescription:
          "Experience the thrill of seeing blue whales up close on a boat safari in the Indian Ocean.",
        location: {
          city: "Mirissa",
          district: "Southern Province",
          coordinates: {
            lat: 5.9485,
            lng: 80.4578,
          },
        },
        type: "Wildlife",
      },
      {
        id: "activity_003",
        title: "Ella Scenic Train Ride",
        images: [
          "https://images.unsplash.com/photo-1583394838336-acd977736f90",
        ],
        reviews: {
          vistaReview: {
            rating: 4.9,
            text: "The most scenic train ride in Asia—absolutely magical!",
          },
          travelerReviews: [],
        },
        vistaVerified: true,
        priceRangeUSD: "$5",
        contactDetails: {
          phone: "",
          email: "",
          website: "",
        },
        fullDescription:
          "Ride through tea plantations and lush mountains from Kandy to Ella on the most scenic train journey in Sri Lanka.",
        location: {
          city: "Ella",
          district: "Uva Province",
          coordinates: {
            lat: 6.8753,
            lng: 81.0462,
          },
        },
        type: "Scenic",
      },
      {
        id: "activity_004",
        title: "Temple of the Tooth Visit",
        images: [
          "https://images.unsplash.com/photo-1593642532973-d31b6557fa68",
        ],
        reviews: {
          vistaReview: {
            rating: 4.7,
            text: "Spiritual and serene—experience the essence of Sri Lankan Buddhism.",
          },
          travelerReviews: [],
        },
        vistaVerified: true,
        priceRangeUSD: "$3",
        contactDetails: {
          phone: "",
          email: "",
          website: "",
        },
        fullDescription:
          "Visit Sri Lanka’s most sacred Buddhist temple in the heart of Kandy and witness daily rituals.",
        location: {
          city: "Kandy",
          district: "Central Province",
          coordinates: {
            lat: 7.2936,
            lng: 80.6416,
          },
        },
        type: "Religious",
      },
      {
        id: "activity_005",
        title: "Surf Lessons in Arugam Bay",
        images: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        ],
        reviews: {
          vistaReview: {
            rating: 4.5,
            text: "Catch your first wave with the best local surf guides!",
          },
          travelerReviews: [],
        },
        vistaVerified: true,
        priceRangeUSD: "$12",
        contactDetails: {
          phone: "",
          email: "",
          website: "",
        },
        fullDescription:
          "Learn to surf at one of the world's top beginner-friendly surf beaches with pro local guides.",
        location: {
          city: "Arugam Bay",
          district: "Eastern Province",
          coordinates: {
            lat: 6.8432,
            lng: 81.8344,
          },
        },
        type: "Adventure",
      },
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
      <ActivityManagement
        fetchEntities={fetchFunction}
        addEntity={addFunction}
        updateEntity={updateFunction}
        deleteEntity={deletFucntion}
      />
    </>
  );
};

export default PageWrapper;
