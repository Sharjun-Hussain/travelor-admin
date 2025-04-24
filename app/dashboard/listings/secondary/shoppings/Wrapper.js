"use client";
import React from "react";
import dynamic from "next/dynamic";
const ShoppingManagement = dynamic(() => import("./shopping-management"), {
  ssr: false,
});

const PageWrapper = () => {
  // Mock API functions
  const fetchFunction = async () => {
    // Simulating API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
      {
        id: "shopping_001",
        title: "Colombo Craft Bazaar",
        images: ["https://example.com/images/colombo-craft.jpg"],
        type: "Shopping",
        category: "Handicrafts",
        vistaVerified: true,
        shopName: "Colombo Craft Bazaar",
        description:
          "A vibrant market filled with wooden art, textiles, and unique handcrafted jewelry from local Sri Lankan artists.",
        location: {
          address: "Central Bazaar Street, Colombo",
          city: "Colombo",
          province: "Western",
          coordinates: { lat: 6.9271, lng: 79.8612 },
        },
        productTypes: ["Wooden Art", "Textiles", "Jewelry"],
        rating: 4.7,
        travelerReviews: [
          {
            name: "Ella",
            rating: 5,
            comment: "Amazing collection of handcrafted goods!",
          },
          {
            name: "Nuwan",
            rating: 4,
            comment: "Good variety and fair prices.",
          },
        ],
        slvistaReviews: [
          {
            reviewedBy: "admin@slvista.lk",
            rating: 4.5,
            comment: "Authentic Sri Lankan products, verified vendors.",
            date: "2025-4-12",
          },
        ],
        contactDetails: {
          phone: "+94 77 123 4567",
          email: "info@colombobazaar.lk",
          website: "https://www.colombobazaar.lk",
        },
        openingHours: "9:00 AM - 7:00 PM",
      },
      {
        id: "shopping_002",
        title: "Galle Fort Market",
        images: ["https://example.com/images/galle-fort-market.jpg"],
        type: "Shopping",
        category: "Antiques & Crafts",
        vistaVerified: true,
        shopName: "Galle Fort Market",
        description:
          "A historic marketplace within the Galle Fort, known for antique treasures and handmade souvenirs.",
        location: {
          address: "Lighthouse Street, Galle Fort",
          city: "Galle",
          province: "Southern",
          coordinates: { lat: 6.0267, lng: 80.217 },
        },
        productTypes: ["Antiques", "Souvenirs", "Handmade Goods"],
        rating: 4.6,
        travelerReviews: [
          {
            name: "Zara",
            rating: 5,
            comment: "Felt like walking through history!",
          },
          {
            name: "Ravi",
            rating: 4,
            comment: "Some unique items but a bit pricey.",
          },
        ],
        slvistaReviews: [
          {
            reviewedBy: "admin@slvista.lk",
            rating: 4.4,
            comment: "Culturally rich, popular with both tourists and locals.",
          },
        ],
        contactDetails: {
          phone: "+94 71 456 7890",
          email: "hello@gallefortmarket.lk",
          website: "https://www.gallefortmarket.lk",
        },
        openingHours: "10:00 AM - 6:00 PM",
      },
      {
        id: "shopping_003",
        title: "Kandy Spice Street",
        images: ["https://example.com/images/kandy-spice.jpg"],
        type: "Shopping",
        category: "Spices & Herbs",
        vistaVerified: true,
        shopName: "Kandy Spice Street",
        description:
          "Bursting with the aroma of exotic spices, this street in Kandy is a haven for culinary enthusiasts.",
        location: {
          address: "Main Street, Kandy",
          city: "Kandy",
          province: "Central",
          coordinates: { lat: 7.2906, lng: 80.6337 },
        },
        productTypes: ["Cinnamon", "Cardamom", "Cloves"],
        rating: 4.8,
        travelerReviews: [
          { name: "Jasmine", rating: 5, comment: "Heaven for spice lovers!" },
          {
            name: "Dilshan",
            rating: 5,
            comment: "Bought gifts for everyone back home.",
          },
        ],
        slvistaReviews: [
          {
            reviewedBy: "admin@slvista.lk",
            rating: 4.7,
            comment: "Highly recommended for authentic local spice shopping.",
          },
        ],
        contactDetails: {
          phone: "+94 76 987 6543",
          email: "spice@kandyspice.lk",
          website: "https://www.kandyspice.lk",
        },
        openingHours: "8:30 AM - 6:30 PM",
      },
      {
        id: "shopping_004",
        title: "Negombo Fish Market",
        images: ["https://example.com/images/negombo-fish.jpg"],
        type: "Shopping",
        category: "Local Markets",
        vistaVerified: false,
        shopName: "Negombo Fish Market",
        description:
          "An energetic and traditional fish market experience right by the sea—ideal for adventurous foodies.",
        location: {
          address: "Sea Street, Negombo",
          city: "Negombo",
          province: "Western",
          coordinates: { lat: 7.209, lng: 79.8385 },
        },
        productTypes: ["Fresh Seafood", "Dry Fish", "Street Snacks"],
        rating: 4.2,
        travelerReviews: [
          { name: "Leo", rating: 4, comment: "Loud, raw, and very real." },
          {
            name: "Meena",
            rating: 4.5,
            comment: "Great to explore, but be ready for the smell!",
          },
        ],
        slvistaReviews: [],
        contactDetails: {
          phone: "+94 70 321 7654",
          email: "info@negombomarket.lk",
        },
        openingHours: "6:00 AM - 1:00 PM",
      },
      {
        id: "shopping_005",
        title: "Barefoot Gallery Store",
        images: ["https://example.com/images/barefoot-gallery.jpg"],
        type: "Shopping",
        category: "Boutique",
        vistaVerified: true,
        shopName: "Barefoot Gallery Store",
        description:
          "An artistic boutique store blending a cafe, gallery, and textile shop—featuring handwoven fabrics and lifestyle items.",
        location: {
          address: "Galle Road, Colombo 03",
          city: "Colombo",
          province: "Western",
          coordinates: { lat: 6.9111, lng: 79.8522 },
        },
        productTypes: ["Handwoven Fabrics", "Art Prints", "Home Decor"],
        rating: 4.9,
        travelerReviews: [
          {
            name: "Harsha",
            rating: 5,
            comment: "Incredible vibe and great coffee!",
          },
          {
            name: "Tanya",
            rating: 4.8,
            comment: "A peaceful escape in the middle of Colombo.",
          },
        ],
        slvistaReviews: [
          {
            reviewedBy: "admin@slvista.lk",
            rating: 4.9,
            comment: "A must-visit for design lovers and culture explorers.",
          },
        ],
        contactDetails: {
          phone: "+94 75 222 3322",
          email: "contact@barefoot.lk",
          website: "https://www.barefoot.lk",
        },
        openingHours: "10:00 AM - 8:00 PM",
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
      <ShoppingManagement
        fetchEntities={fetchFunction}
        addEntity={addFunction}
        updateEntity={updateFunction}
        deleteEntity={deletFucntion}
      />
    </>
  );
};

export default PageWrapper;
