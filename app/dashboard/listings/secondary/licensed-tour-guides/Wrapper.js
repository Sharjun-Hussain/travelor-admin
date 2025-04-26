"use client";
import React from "react";
import dynamic from "next/dynamic";
const ShoppingManagement = dynamic(
  () => import("./licensed-tour-guide-management"),
  {
    ssr: false,
  }
);

const PageWrapper = () => {
  // Mock API functions
  const fetchFunction = async () => {
    // Simulating API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return [
      {
        id: "guide001",
        name: "Kavinda Perera",
        profileImage: "https://example.com/images/kavinda.jpg",
        bio: "Licensed national tour guide with 10+ years of experience in historical and cultural tours across Sri Lanka.",
        languagesSpoken: ["English", "Sinhala", "French"],
        licenseId: "SLTG-2025-0091",
        licenseExpiry: "2027-05-31",
        yearsOfExperience: 12,
        specialties: ["Historical Tours", "Cultural Sites", "Wildlife Safaris"],
        regionsCovered: ["Central", "Southern", "North Central"],
        rating: 4.8,
        reviews: [
          {
            name: "Alice",
            comment:
              "Kavinda made ancient history come alive for us in Anuradhapura!",
            rating: 5,
            date: "2025-04-10",
          },
          {
            name: "Tom",
            comment:
              "Very knowledgeable and friendly. Great English communication.",
            rating: 4.6,
            date: "2025-04-18",
          },
        ],
        slvistaReviews: {
          reviewerName: "SLVista Editorial",
          comment:
            "An exceptional guide with deep knowledge of Sri Lankan history and culture.",
          rating: 5,
          date: "2025-03-25",
        },
        verifiedByVista: true,
        contact: {
          phone: "+94 77 654 3210",
          email: "kavinda.guidedtours@gmail.com",
          whatsapp: "+94776543210",
        },
        ratePerDay: {
          currency: "USD",
          amount: "50",
        },
        socials: {
          instagram: "https://instagram.com/kavinda.guidedtours",
          facebook: "https://facebook.com/kavinda.guidedtours",
        },
        tags: ["History", "Nature", "Culture"],
      },
      {
        id: "guide002",
        name: "Nadeesha Silva",
        profileImage: "https://example.com/images/nadeesha.jpg",
        bio: "Experienced tour guide with expertise in Sri Lanka's cultural and natural heritage.",
        languagesSpoken: ["English", "Sinhala"],
        licenseId: "SLTG-2025-0192",
        licenseExpiry: "2028-06-15",
        yearsOfExperience: 8,
        specialties: ["Cultural Heritage", "Nature Tours", "Eco-tourism"],
        regionsCovered: ["Western", "Central"],
        rating: 4.7,
        reviews: [
          {
            name: "Sarah",
            comment:
              "Nadeesha is very knowledgeable about Sri Lanka's culture and wildlife.",
            rating: 4.8,
            date: "2025-04-05",
          },
          {
            name: "John",
            comment:
              "Wonderful experience, highly recommend her for eco-tours.",
            rating: 4.5,
            date: "2025-04-12",
          },
        ],
        slvistaReviews: {
          reviewerName: "SLVista Editorial",
          comment:
            "Nadeesha brings an in-depth understanding of Sri Lankan nature and culture.",
          rating: 5,
          date: "2025-03-20",
        },
        verifiedByVista: true,
        contact: {
          phone: "+94 77 123 4567",
          email: "nadeesha.tours@gmail.com",
          whatsapp: "+94771234567",
        },
        ratePerDay: {
          currency: "USD",
          amount: "60",
        },
        socials: {
          instagram: "https://instagram.com/nadeesha.guidedtours",
          facebook: "https://facebook.com/nadeesha.guidedtours",
        },
        tags: ["Nature", "Culture", "Eco-tourism"],
      },
      {
        id: "guide003",
        name: "Roshan Kumarasinghe",
        profileImage: "https://example.com/images/roshan.jpg",
        bio: "Passionate guide offering adventures in Sri Lanka's scenic hill country and coastal regions.",
        languagesSpoken: ["English", "Sinhala"],
        licenseId: "SLTG-2025-0345",
        licenseExpiry: "2026-09-12",
        yearsOfExperience: 10,
        specialties: ["Adventure Tours", "Hill Country", "Coastal Tours"],
        regionsCovered: ["Southern", "Uva", "Western"],
        rating: 4.9,
        reviews: [
          {
            name: "Rachel",
            comment:
              "Amazing coastal tour experience. Highly recommend Roshan for adventure tours.",
            rating: 5,
            date: "2025-04-08",
          },
          {
            name: "Daniel",
            comment:
              "Great guide with a deep passion for Sri Lanka's nature and culture.",
            rating: 4.7,
            date: "2025-04-14",
          },
        ],
        slvistaReviews: {
          reviewerName: "SLVista Editorial",
          comment:
            "Roshan offers an exhilarating mix of adventure and cultural immersion in Sri Lanka.",
          rating: 5,
          date: "2025-03-18",
        },
        verifiedByVista: true,
        contact: {
          phone: "+94 77 321 6543",
          email: "roshan.adventure@gmail.com",
          whatsapp: "+94773216543",
        },
        ratePerDay: {
          currency: "USD",
          amount: "70",
        },
        socials: {
          instagram: "https://instagram.com/roshan.adventure",
          facebook: "https://facebook.com/roshan.adventure",
        },
        tags: ["Adventure", "Nature", "Culture"],
      },
      {
        id: "guide004",
        name: "Tharindu Jayasinghe",
        profileImage: "https://example.com/images/tharindu.jpg",
        bio: "Expert in historical sites and religious tours throughout Sri Lanka, specializing in Buddhist heritage.",
        languagesSpoken: ["English", "Sinhala", "Tamil"],
        licenseId: "SLTG-2025-0123",
        licenseExpiry: "2026-12-10",
        yearsOfExperience: 15,
        specialties: [
          "Buddhist Heritage",
          "Historical Sites",
          "Religious Tours",
        ],
        regionsCovered: ["North Central", "Western", "Eastern"],
        rating: 4.6,
        reviews: [
          {
            name: "Meera",
            comment:
              "Tharindu is an excellent guide for anyone interested in Buddhist heritage.",
            rating: 5,
            date: "2025-04-11",
          },
          {
            name: "Lucas",
            comment:
              "Very informative and professional. Highly recommend for historical tours.",
            rating: 4.3,
            date: "2025-04-16",
          },
        ],
        slvistaReviews: {
          reviewerName: "SLVista Editorial",
          comment:
            "Tharindu's profound knowledge of Sri Lanka's Buddhist heritage makes him a top guide.",
          rating: 5,
          date: "2025-03-22",
        },
        verifiedByVista: true,
        contact: {
          phone: "+94 77 876 5432",
          email: "tharindu.heritage@gmail.com",
          whatsapp: "+94778765432",
        },
        ratePerDay: {
          currency: "USD",
          amount: "55",
        },
        socials: {
          instagram: "https://instagram.com/tharindu.heritage",
          facebook: "https://facebook.com/tharindu.heritage",
        },
        tags: ["Buddhist Heritage", "History", "Culture"],
      },
      {
        id: "guide005",
        name: "Samantha Fernando",
        profileImage: "https://example.com/images/samantha.jpg",
        bio: "Specializing in tropical rainforest and nature exploration tours, offering an immersive experience in Sri Lanka's rainforests.",
        languagesSpoken: ["English", "Sinhala"],
        licenseId: "SLTG-2025-0583",
        licenseExpiry: "2027-01-19",
        yearsOfExperience: 9,
        specialties: [
          "Rainforest Exploration",
          "Nature Tours",
          "Wildlife Safaris",
        ],
        regionsCovered: ["Sabaragamuwa", "Western", "Uva"],
        rating: 4.8,
        reviews: [
          {
            name: "Sophia",
            comment:
              "Samantha led us on an unforgettable rainforest tour. Truly a hidden gem!",
            rating: 5,
            date: "2025-04-15",
          },
          {
            name: "Henry",
            comment:
              "Highly recommend for nature lovers. Great at spotting wildlife!",
            rating: 4.7,
            date: "2025-04-20",
          },
        ],
        slvistaReviews: {
          reviewerName: "SLVista Editorial",
          comment:
            "Samantha offers one of the most authentic and immersive rainforest tours in Sri Lanka.",
          rating: 5,
          date: "2025-03-28",
        },
        verifiedByVista: true,
        contact: {
          phone: "+94 77 555 9876",
          email: "samantha.naturetours@gmail.com",
          whatsapp: "+94775559876",
        },
        ratePerDay: {
          currency: "USD",
          amount: "60",
        },
        socials: {
          instagram: "https://instagram.com/samantha.naturetours",
          facebook: "https://facebook.com/samantha.naturetours",
        },
        tags: ["Rainforest", "Nature", "Wildlife"],
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
