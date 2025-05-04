"use client";
import React from "react";
import dynamic from "next/dynamic";
import axios from "axios";
const LocalArtistManagement = dynamic(
  () => import("./local-artist-management"),
  {
    ssr: false,
  }
);

const PageWrapper = () => {
  // Mock API functions
  const fetchFunction = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/local-artists`,
      {
        withCredentials: true,
      }
    );
    return response.data.data;

    // return [
    //   {
    //     id: "artist_001",
    //     name: "Nuwan Jayasooriya",
    //     artStyle: "Traditional Kandyan Dance",
    //     description:
    //       "A master of traditional Kandyan dance who has performed at cultural festivals across Sri Lanka. Known for energetic performances and authentic costume work.",
    //     location: {
    //       city: "Kandy",
    //       province: "Central Province",
    //       latitude: 7.2906,
    //       longitude: 80.6337,
    //     },
    //     languagesSpoken: ["Sinhala", "English"],
    //     rating: 4.9,
    //     reviewsCount: 145,
    //     tags: ["Dance", "Cultural", "Performance"],
    //     images: [
    //       "https://images.unsplash.com/photo-1581235720704-23637aeb3d01",
    //     ],
    //     videoSamples: ["https://www.youtube.com/watch?v=kandyan-dance-sample"],
    //     travelerReviews: [
    //       {
    //         reviewerName: "Emily Johnson",
    //         comment:
    //           "Absolutely mesmerizing performance! The energy was unreal.",
    //         rating: 5,
    //         date: "2025-04-01",
    //       },
    //       {
    //         reviewerName: "Akila Fernando",
    //         comment: "Great insight into Sri Lankan culture. Must-watch.",
    //         rating: 4.8,
    //         date: "2025-04-10",
    //       },
    //     ],
    //     slvistaReviews: [
    //       {
    //         reviewerName: "SLVista Editorial",
    //         comment:
    //           "Nuwan brings authenticity and flair to the traditional Kandyan dance. A cultural gem.",
    //         rating: 5,
    //         date: "2025-03-25",
    //       },
    //     ],
    //   },
    //   {
    //     id: "artist_002",
    //     name: "Thilini Perera",
    //     artStyle: "Handmade Batik Art",
    //     description:
    //       "An award-winning batik artist whose colorful designs reflect both traditional motifs and modern expression. Her work is showcased in major exhibitions.",
    //     location: {
    //       city: "Matale",
    //       province: "Central Province",
    //       latitude: 7.4675,
    //       longitude: 80.6234,
    //     },
    //     languagesSpoken: ["Sinhala", "English"],
    //     rating: 4.8,
    //     reviewsCount: 89,
    //     tags: ["Batik", "Craft", "Handmade"],
    //     images: [
    //       "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
    //     ],
    //     videoSamples: [],
    //     travelerReviews: [
    //       {
    //         reviewerName: "Sophie Zhang",
    //         comment:
    //           "Loved the batik workshop! Thilini is very patient and talented.",
    //         rating: 4.9,
    //         date: "2025-04-12",
    //       },
    //     ],
    //     slvistaReviews: [
    //       {
    //         reviewerName: "SLVista Editorial",
    //         comment:
    //           "Thilini combines heritage with modern creativity — a true artisan.",
    //         rating: 4.8,
    //         date: "2025-04-05",
    //       },
    //     ],
    //   },
    //   {
    //     id: "artist_003",
    //     name: "Ramesh Selvarajah",
    //     artStyle: "Tamil Folk Music",
    //     description:
    //       "A folk singer and musician from Batticaloa, specializing in Tamil folk tunes. Known for preserving age-old lyrics and instruments.",
    //     location: {
    //       city: "Batticaloa",
    //       province: "Eastern Province",
    //       latitude: 7.7102,
    //       longitude: 81.6924,
    //     },
    //     languagesSpoken: ["Tamil", "English"],
    //     rating: 4.7,
    //     reviewsCount: 62,
    //     tags: ["Folk", "Tamil", "Music"],
    //     images: [
    //       "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
    //     ],
    //     videoSamples: ["https://www.youtube.com/watch?v=tamil-folk-live"],
    //     travelerReviews: [
    //       {
    //         reviewerName: "Dinesh K.",
    //         comment: "Loved the authenticity. Took me back to my childhood.",
    //         rating: 4.7,
    //         date: "2025-04-15",
    //       },
    //     ],
    //     slvistaReviews: [
    //       {
    //         reviewerName: "SLVista Editorial",
    //         comment:
    //           "A soulful experience that showcases Sri Lanka’s rich folk music traditions.",
    //         rating: 4.9,
    //         date: "2025-04-08",
    //       },
    //     ],
    //   },
    // ];
  };

  const addFunction = async (newEntity) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/local-artists`,
      newEntity,
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  };

  const updateFunction = async (updatedEntity) => {
    await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/local-artists`,
      updatedEntity,
      {
        withCredentials: true,
      }
    );
    return updatedEntity;
  };

  const deletFucntion = async (id) => {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/local-artists/${id}`,
      {
        withCredentials: true,
      }
    );
    return id;
  };

  return (
    <>
      <LocalArtistManagement
        fetchEntities={fetchFunction}
        addEntity={addFunction}
        updateEntity={updateFunction}
        deleteEntity={deletFucntion}
      />
    </>
  );
};

export default PageWrapper;
