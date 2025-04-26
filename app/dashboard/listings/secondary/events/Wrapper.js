"use client";
import React from "react";
import dynamic from "next/dynamic";
const EventManagement = dynamic(() => import("./event-management"), {
  ssr: false,
});

const PageWrapper = () => {
  // Mock API functions
  const fetchFunction = async () => {
    // Simulating API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
      {
        id: "event001",
        title: "Colombo Craft Bazaar",
        description:
          "A vibrant showcase of Sri Lankan handicrafts featuring wooden art, textiles, and jewelry.",
        images: ["https://example.com/images/colombo-craft.jpg"],
        category: "Handicrafts",
        location: {
          venue: "Colombo Exhibition Center",
          city: "Colombo",
          province: "Western",
        },
        date: "2025-06-15",
        time: "10:00 AM",
        duration: "8 hours",
        entryFee: {
          currency: "LKR",
          amount: "500",
        },
        audience: "General Public",
        highlightedFeatures: [
          "Live Craft Demonstrations",
          "Traditional Music Performances",
        ],
        organizer: {
          name: "Sri Lanka Handicrafts Association",
          contact: {
            phone: "+94 77 123 4567",
            email: "info@slhandicrafts.lk",
            website: "https://slhandicrafts.lk",
          },
        },
        slvistaReviews: {
          reviewerName: "SLVista Editorial",
          comment:
            "An authentic experience showcasing the rich heritage of Sri Lankan crafts.",
          rating: 5,
          date: "2025-03-25",
        },
        travelerReviews: [
          {
            name: "Ella",
            comment: "Amazing collection of handcrafted goods!",
            rating: 5,
            date: "2025-04-10",
          },
          {
            name: "Nuwan",
            comment: "Good variety and fair prices.",
            rating: 4,
            date: "2025-04-12",
          },
        ],
        isVistaVerified: true,
        tags: ["Crafts", "Cultural", "Shopping"],
        languagesSpoken: ["English", "Sinhala", "Tamil"],
        ticketLink: "https://tickets.slhandicrafts.lk/colombo-craft-bazaar",
        type: "Bazaar",
      },
      {
        id: "event002",
        title: "Galle Food & Spice Fest",
        description:
          "Taste and discover Sri Lanka’s iconic spices and local dishes in this flavorful event.",
        images: ["https://example.com/images/galle-food.jpg"],
        category: "Food Festival",
        location: {
          venue: "Galle Fort Grounds",
          city: "Galle",
          province: "Southern",
        },
        date: "2025-07-20",
        time: "12:00 PM",
        duration: "6 hours",
        entryFee: {
          currency: "LKR",
          amount: "1000",
        },
        audience: "Food Lovers",
        highlightedFeatures: ["Live Cooking Shows", "Spice Workshops"],
        organizer: {
          name: "Taste Lanka Events",
          contact: {
            phone: "+94 71 456 7890",
            email: "info@tastelanka.lk",
            website: "https://tastelanka.lk",
          },
        },
        slvistaReviews: {
          reviewerName: "SLVista Editorial",
          comment:
            "The ultimate culinary journey for any food enthusiast visiting the south.",
          rating: 4.8,
          date: "2025-04-02",
        },
        travelerReviews: [
          {
            name: "Maya",
            comment:
              "The spices! So fresh and flavorful. Loved the hands-on workshops.",
            rating: 5,
            date: "2025-04-15",
          },
        ],
        isVistaVerified: true,
        tags: ["Food", "Spices", "Cooking"],
        languagesSpoken: ["English", "Sinhala"],
        ticketLink: "https://tickets.tastelanka.lk/galle-food-fest",
        type: "Festival",
      },
      {
        id: "event003",
        title: "Kandy Esala Perahera",
        description:
          "Witness the majestic parade of elephants, dancers, and traditional drummers in this grand cultural procession.",
        images: ["https://example.com/images/kandy-perahera.jpg"],
        category: "Cultural Parade",
        location: {
          venue: "Temple of the Tooth Premises",
          city: "Kandy",
          province: "Central",
        },
        date: "2025-08-05",
        time: "6:00 PM",
        duration: "4 hours",
        entryFee: {
          currency: "LKR",
          amount: "Free",
        },
        audience: "All Ages",
        highlightedFeatures: [
          "Elephant Processions",
          "Fire Dancers",
          "Traditional Music",
        ],
        organizer: {
          name: "Kandy Dalada Committee",
          contact: {
            phone: "+94 81 234 5678",
            email: "events@kandytemple.lk",
            website: "https://kandyperahera.lk",
          },
        },
        slvistaReviews: {
          reviewerName: "SLVista Editorial",
          comment:
            "A once-in-a-lifetime cultural spectacle, filled with color and devotion.",
          rating: 5,
          date: "2025-03-30",
        },
        travelerReviews: [
          {
            name: "Liam",
            comment: "I was amazed by the scale and beauty of the event.",
            rating: 5,
            date: "2025-04-01",
          },
        ],
        isVistaVerified: true,
        tags: ["Culture", "Parade", "Tradition"],
        languagesSpoken: ["Sinhala", "Tamil", "English"],
        ticketLink: "https://tickets.kandyperahera.lk",
        type: "Parade",
      },
      {
        id: "event004",
        title: "Negombo Beach Music Fest",
        description:
          "Feel the rhythm by the sea with top local bands, DJs, and international acts on Sri Lanka’s golden coast.",
        images: ["https://example.com/images/negombo-music.jpg"],
        category: "Music Festival",
        location: {
          venue: "Negombo Beach Park",
          city: "Negombo",
          province: "Western",
        },
        date: "2025-09-10",
        time: "5:00 PM",
        duration: "10 hours",
        entryFee: {
          currency: "LKR",
          amount: "2500",
        },
        audience: "18+",
        highlightedFeatures: ["Live Bands", "DJ Performances", "Beach Games"],
        organizer: {
          name: "Island Vibes Ent.",
          contact: {
            phone: "+94 76 789 1234",
            email: "contact@islandvibes.lk",
            website: "https://islandvibes.lk",
          },
        },
        slvistaReviews: {
          reviewerName: "SLVista Editorial",
          comment:
            "Perfect fusion of music, beach, and fun. Highly recommended for young travelers.",
          rating: 4.6,
          date: "2025-04-05",
        },
        travelerReviews: [
          {
            name: "Dev",
            comment: "One of the best parties I’ve been to in Sri Lanka!",
            rating: 5,
            date: "2025-04-08",
          },
        ],
        isVistaVerified: true,
        tags: ["Music", "Beach", "Nightlife"],
        languagesSpoken: ["English"],
        ticketLink: "https://tickets.islandvibes.lk/negombo-fest",
        type: "Festival",
      },
      {
        id: "event005",
        title: "Anuradhapura Heritage Walk",
        description:
          "Guided historical tour through the sacred ruins of Anuradhapura, exploring ancient temples and Buddhist sites.",
        images: ["https://example.com/images/anuradhapura-walk.jpg"],
        category: "Historical Tour",
        location: {
          venue: "Sacred City of Anuradhapura",
          city: "Anuradhapura",
          province: "North Central",
        },
        date: "2025-11-02",
        time: "7:00 AM",
        duration: "5 hours",
        entryFee: {
          currency: "USD",
          amount: "15",
        },
        audience: "History Enthusiasts",
        highlightedFeatures: [
          "Guided Tours",
          "Temple Visits",
          "Cultural Insights",
        ],
        organizer: {
          name: "Heritage Lanka",
          contact: {
            phone: "+94 77 234 5678",
            email: "info@heritagelanka.lk",
            website: "https://heritagelanka.lk",
          },
        },
        slvistaReviews: {
          reviewerName: "SLVista Editorial",
          comment: "A peaceful and deeply insightful cultural journey.",
          rating: 4.9,
          date: "2025-04-01",
        },
        travelerReviews: [
          {
            name: "Jonas",
            comment:
              "Loved the stories shared by the guide. Very spiritual place.",
            rating: 5,
            date: "2025-04-10",
          },
        ],
        isVistaVerified: true,
        tags: ["History", "Culture", "Religion"],
        languagesSpoken: ["English", "German", "Sinhala"],
        ticketLink: "https://tickets.heritagelanka.lk/anuradhapura-walk",
        type: "Tour",
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
      <EventManagement
        fetchEntities={fetchFunction}
        addEntity={addFunction}
        updateEntity={updateFunction}
        deleteEntity={deletFucntion}
      />
    </>
  );
};

export default PageWrapper;
