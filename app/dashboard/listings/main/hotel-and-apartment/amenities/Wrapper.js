"use client";
import React from "react";
import dynamic from "next/dynamic";
const AmenityManagement = dynamic(() => import("./amenity-management"), {
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
        id: "activity_001",
        title: "Sigiriya Rock Fortress Climb",
        description:
          "Climb the ancient rock fortress of Sigiriya, a UNESCO World Heritage Site with breathtaking views and ancient frescoes.",
        location: {
          city: "Sigiriya",
          province: "Central Province",
          latitude: 7.957,
          longitude: 80.7603,
        },
        category: "Historical",
        duration: "2-3 hours",
        priceLKR: 4500,
        priceUSD: 15,
        language: ["English", "Sinhala"],
        images: [
          "https://images.unsplash.com/photo-1601233749941-7f4d3e8c8e2f",
        ],
        availableDates: ["2025-04-25", "2025-04-26", "2025-04-27"],
        rating: 4.8,
        reviewsCount: 312,
        tags: ["UNESCO", "Rock Climb", "History"],
        guideAvailable: true,
      },
      {
        id: "activity_002",
        title: "Whale Watching in Mirissa",
        description:
          "Experience the thrill of seeing blue whales up close on a boat safari in the Indian Ocean.",
        location: {
          city: "Mirissa",
          province: "Southern Province",
          latitude: 5.9485,
          longitude: 80.4578,
        },
        category: "Wildlife",
        duration: "4-5 hours",
        priceLKR: 7000,
        priceUSD: 23,
        language: ["English", "Sinhala"],
        images: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        ],
        availableDates: ["2025-04-25", "2025-04-28"],
        rating: 4.6,
        reviewsCount: 198,
        tags: ["Ocean", "Whales", "Eco-Tour"],
        guideAvailable: true,
      },
      {
        id: "activity_003",
        title: "Ella Scenic Train Ride",
        description:
          "Ride through tea plantations and lush mountains from Kandy to Ella on the most scenic train journey in Sri Lanka.",
        location: {
          city: "Ella",
          province: "Uva Province",
          latitude: 6.8753,
          longitude: 81.0462,
        },
        category: "Scenic",
        duration: "6-7 hours",
        priceLKR: 1500,
        priceUSD: 5,
        language: ["English", "Sinhala", "Tamil"],
        images: [
          "https://images.unsplash.com/photo-1583394838336-acd977736f90",
        ],
        availableDates: ["2025-04-25", "2025-04-26"],
        rating: 4.9,
        reviewsCount: 420,
        tags: ["Train Ride", "Tea Country", "Nature"],
        guideAvailable: false,
      },
      {
        id: "activity_004",
        title: "Temple of the Tooth Visit",
        description:
          "Visit Sri Lanka’s most sacred Buddhist temple in the heart of Kandy and witness daily rituals.",
        location: {
          city: "Kandy",
          province: "Central Province",
          latitude: 7.2936,
          longitude: 80.6416,
        },
        category: "Religious",
        duration: "1-2 hours",
        priceLKR: 1000,
        priceUSD: 3,
        language: ["English", "Sinhala"],
        images: [
          "https://images.unsplash.com/photo-1593642532973-d31b6557fa68",
        ],
        availableDates: ["2025-04-25", "2025-04-26", "2025-04-27"],
        rating: 4.7,
        reviewsCount: 289,
        tags: ["Buddhism", "Temple", "Cultural"],
        guideAvailable: true,
      },
      {
        id: "activity_005",
        title: "Surf Lessons in Arugam Bay",
        description:
          "Learn to surf at one of the world's top beginner-friendly surf beaches with pro local guides.",
        location: {
          city: "Arugam Bay",
          province: "Eastern Province",
          latitude: 6.8432,
          longitude: 81.8344,
        },
        category: "Adventure",
        duration: "1-2 hours",
        priceLKR: 3500,
        priceUSD: 12,
        language: ["English", "Tamil"],
        images: [
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        ],
        availableDates: ["2025-04-25", "2025-04-28", "2025-04-29"],
        rating: 4.5,
        reviewsCount: 175,
        tags: ["Surfing", "Beach", "Adventure"],
        guideAvailable: true,
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
      <AmenityManagement
        fetchEntities={fetchFunction}
        addEntity={addFunction}
        updateEntity={updateFunction}
        deleteEntity={deletFucntion}
      />
    </>
  );
};

export default PageWrapper;
