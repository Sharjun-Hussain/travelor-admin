"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
const TransportManagement = dynamic(() => import("./transport-management"), {
  ssr: false,
});

const PageWrapper = () => {
  // useEffect(() => {
  const datafromlocalstorage = JSON.parse(localStorage.getItem("user"));
  console.log(datafromlocalstorage.data.accessToken);
  // }, []);

  const fetchFunction = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/transports`,
      {
        headers: {
          Authorization: `Bearer ${datafromlocalstorage.data.accessToken}`,
        },
        withCredentials: true,
      }
    );

    return response.data.data;

    // return [
    //   {
    //     id: "transport_001",
    //     title: "Colombo to Kandy - AC Tourist Bus",
    //     images: [
    //       "https://images.unsplash.com/photo-1593797636365-2e6fce6c6712",
    //     ],
    //     transportType: "Bus",
    //     vistaVerified: true,
    //     operatorName: "Sri Lanka Tourist Coaches",
    //     pricePerKmUSD: "0.12",
    //     amenities: [
    //       { type: "Air Conditioned", available: true },
    //       { type: "Passenger Capacity", value: "45" },
    //       { type: "Luggage Space", value: "Large" },
    //     ],
    //     reviews: {
    //       vistaReview: {
    //         rating: 4.6,
    //         text: "Reliable transport with good comfort and ventilation.",
    //       },
    //       travelerReviews: [],
    //     },
    //     contactDetails: {
    //       phone: "011-2345678",
    //       email: "contact@touristcoaches.lk",
    //       website: "https://www.srilankatouristcoaches.lk",
    //     },
    //     description:
    //       "Spacious AC bus ideal for group and long-distance travel. Operated by licensed transport providers.",
    //     location: {
    //       departureCity: "Colombo",
    //       arrivalCity: "Kandy",
    //       coordinates: {
    //         lat: 7.2906,
    //         lng: 80.6337,
    //       },
    //     },
    //     type: "Transport",
    //   },
    //   {
    //     id: "transport_002",
    //     title: "Kandy to Nuwara Eliya - Luxury Train",
    //     images: ["https://images.unsplash.com/photo-1555685818-3258bca28f99"],
    //     transportType: "Train",
    //     vistaVerified: true,
    //     operatorName: "Sri Lanka Railways",
    //     pricePerKmUSD: "0.15",
    //     amenities: [
    //       { type: "Air Conditioned", available: true },
    //       { type: "Passenger Capacity", value: "80" },
    //       { type: "Luggage Space", value: "Medium" },
    //     ],
    //     reviews: {
    //       vistaReview: {
    //         rating: 4.7,
    //         text: "A scenic and comfortable way to travel through the hill country.",
    //       },
    //       travelerReviews: [],
    //     },
    //     contactDetails: {
    //       phone: "071-2345678",
    //       email: "info@srilankatrailways.lk",
    //       website: "https://www.srilankatrailways.lk",
    //     },
    //     description:
    //       "Enjoy a picturesque train ride through tea plantations and mountain landscapes in this luxury coach.",
    //     location: {
    //       departureCity: "Kandy",
    //       arrivalCity: "Nuwara Eliya",
    //       coordinates: {
    //         lat: 6.9333,
    //         lng: 80.7833,
    //       },
    //     },
    //     type: "Transport",
    //   },
    //   {
    //     id: "transport_003",
    //     title: "Colombo to Galle - Private Taxi",
    //     images: [
    //       "https://images.unsplash.com/photo-1576568276570-232b52d014c3",
    //     ],
    //     transportType: "Taxi",
    //     vistaVerified: false,
    //     operatorName: "Galle Taxis",
    //     pricePerKmUSD: "0.20",
    //     amenities: [
    //       { type: "Air Conditioned", available: true },
    //       { type: "Passenger Capacity", value: "4" },
    //       { type: "Luggage Space", value: "Small" },
    //     ],
    //     reviews: {
    //       vistaReview: {
    //         rating: 4.5,
    //         text: "Comfortable ride, but a bit pricey.",
    //       },
    //       travelerReviews: [],
    //     },
    //     contactDetails: {
    //       phone: "076-3456789",
    //       email: "galle.taxis@sl.com",
    //       website: "https://www.galletaxi.lk",
    //     },
    //     description:
    //       "Private and comfortable ride from Colombo to Galle. Ideal for small groups or solo travelers.",
    //     location: {
    //       departureCity: "Colombo",
    //       arrivalCity: "Galle",
    //       coordinates: {
    //         lat: 6.0483,
    //         lng: 80.22,
    //       },
    //     },
    //     type: "Transport",
    //   },
    //   {
    //     id: "transport_004",
    //     title: "Colombo to Negombo - Airport Shuttle",
    //     images: ["https://images.unsplash.com/photo-1568605112-9a3b8d9eaf0f"],
    //     transportType: "Shuttle",
    //     vistaVerified: true,
    //     operatorName: "Negombo Airport Express",
    //     pricePerKmUSD: "0.08",
    //     amenities: [
    //       { type: "Air Conditioned", available: true },
    //       { type: "Passenger Capacity", value: "20" },
    //       { type: "Luggage Space", value: "Large" },
    //     ],
    //     reviews: {
    //       vistaReview: {
    //         rating: 4.8,
    //         text: "Convenient and fast shuttle service to the airport.",
    //       },
    //       travelerReviews: [],
    //     },
    //     contactDetails: {
    //       phone: "011-8765432",
    //       email: "info@negomboairportexpress.lk",
    //       website: "https://www.negomboairportexpress.lk",
    //     },
    //     description:
    //       "Reliable shuttle service that picks you up from Colombo and drops you at Bandaranaike International Airport.",
    //     location: {
    //       departureCity: "Colombo",
    //       arrivalCity: "Negombo",
    //       coordinates: {
    //         lat: 7.2091,
    //         lng: 79.9742,
    //       },
    //     },
    //     type: "Transport",
    //   },
    // ];
  };

  const addFunction = async (newEntity) => {
    // Simulating API call
    // await new Promise((resolve) => setTimeout(resolve, 800));
    // return {
    //   id: Date.now(),
    //   ...newHost,
    // };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/transports`,

      newEntity,

      {
        headers: {
          Authorization: `Bearer ${datafromlocalstorage.data.accessToken}`,
        },
      }
    );
    return response.data.data;
  };

  const updateFunction = async (updatedEntity) => {
    // Simulating API call
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/transports`,

      updatedEntity,

      {
        headers: {
          Authorization: `Bearer ${datafromlocalstorage.data.accessToken}`,
        },
      }
    );
    return updatedEntity;
  };

  const deletFucntion = async (id) => {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 600));
    alert(id);
    return id;
  };

  return (
    <>
      <TransportManagement
        fetchEntities={fetchFunction}
        addEntity={addFunction}
        updateEntity={updateFunction}
        deleteEntity={deletFucntion}
      />
    </>
  );
};

export default PageWrapper;
