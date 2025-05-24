"use client";
import React from "react";
import dynamic from "next/dynamic";
const FoodandBeverageManagement = dynamic(() => import("./food-and-beverage-management"), {
  ssr: false,
});

const PageWrapper = () => {
  // Mock API functions
  const fetchFunction = async () => {
    // Simulating API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [

      {
        "id": "fb001",
        "name": "Ministry of Crab",
        "type": "restaurant",
        "cuisineType": "Sri Lankan Seafood",
        "dietaryOptions": ["Seafood", "Gluten-free options"],
        "location": {
          "address": "Old Dutch Hospital, Colombo 01",
          "city": "Colombo",
          "province": "Western"
        },
        "rating": 4.8,
        "reviews": [
          { "userId": "user123", "rating": 5, "comment": "Best crab in Colombo!" },
          { "userId": "user456", "rating": 4, "comment": "Excellent but pricey" }
        ],
        "priceRange": 4,
        "openingHours": ["11:00", "23:00"],
        "contactDetails": {
          "phone": "+94 112 342 722",
          "email": "reservations@ministryofcrab.com"
        },
        "images": ["https://example.com/moc1.jpg"],
        "acceptsReservation": true,
        "status": "active",
        "description": "Award-winning seafood restaurant by Sri Lankan cricketers"
      },
      {
        "id": "fb002",
        "name": "Barefoot Garden Café",
        "type": "cafe",
        "cuisineType": "International",
        "dietaryOptions": ["Vegetarian", "Vegan options"],
        "location": {
          "address": "704 Galle Road",
          "city": "Colombo",
          "province": "Western"
        },
        "rating": 4.5,
        "reviews": [
          { "userId": "user789", "rating": 5, "comment": "Lovely garden setting" }
        ],
        "priceRange": 3,
        "openingHours": ["09:00", "18:30"],
        "contactDetails": {
          "phone": "+94 112 589 900",
          "email": "info@barefootceylon.com"
        },
        "images": ["https://example.com/barefoot1.jpg"],
        "acceptsReservation": false,
        "status": "active",
        "description": "Charming café with art gallery and bookstore"
      },
      {
        "id": "fb003",
        "name": "Upali's by Nawaloka",
        "type": "restaurant",
        "cuisineType": "Traditional Sri Lankan",
        "dietaryOptions": ["Vegetarian"],
        "location": {
          "address": "65 C.W.W. Kannangara Mawatha",
          "city": "Colombo",
          "province": "Western"
        },
        "rating": 4.2,
        "reviews": [
          { "userId": "user234", "rating": 4, "comment": "Authentic local flavors" }
        ],
        "priceRange": 2,
        "openingHours": ["11:00", "22:00"],
        "contactDetails": {
          "phone": "+94 112 501 501",
          "email": "upalis@nawaloka.com"
        },
        "images": ["https://example.com/upalis1.jpg"],
        "acceptsReservation": true,
        "status": "active",
        "description": "Famous for traditional Sri Lankan rice and curry"
      },
      {
        "id": "fb004",
        "name": "The Tuna & The Crab",
        "type": "restaurant",
        "cuisineType": "Seafood Fusion",
        "dietaryOptions": ["Seafood", "Gluten-free options"],
        "location": {
          "address": "Jetwing Lighthouse Hotel, Galle",
          "city": "Galle",
          "province": "Southern"
        },
        "rating": 4.6,
        "reviews": [],
        "priceRange": 4,
        "openingHours": ["12:00", "22:30"],
        "contactDetails": {
          "phone": "+94 912 237 437",
          "email": "lighthouse@jetwinghotels.com"
        },
        "images": ["https://example.com/tunacrab1.jpg"],
        "acceptsReservation": true,
        "status": "seasonal",
        "description": "Oceanfront dining with fresh seafood specialties"
      },
      {
        "id": "fb005",
        "name": "Cafe Kumbuk",
        "type": "cafe",
        "cuisineType": "Healthy International",
        "dietaryOptions": ["Vegetarian", "Vegan", "Gluten-free"],
        "location": {
          "address": "30/1 Bagatalle Road",
          "city": "Colombo",
          "province": "Western"
        },
        "rating": 4.3,
        "reviews": [
          { "userId": "user567", "rating": 5, "comment": "Great healthy options" }
        ],
        "priceRange": 3,
        "openingHours": ["08:00", "18:00"],
        "contactDetails": {
          "phone": "+94 114 710 810",
          "email": "hello@cafekumbuk.com"
        },
        "images": ["https://example.com/kumbuk1.jpg"],
        "acceptsReservation": false,
        "status": "active",
        "description": "Eco-conscious café with organic ingredients"
      }
    ]


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
      <FoodandBeverageManagement
        fetchEntities={fetchFunction}
        addEntity={addFunction}
        updateEntity={updateFunction}
        deleteEntity={deletFucntion}
      />
    </>
  );
};

export default PageWrapper;
