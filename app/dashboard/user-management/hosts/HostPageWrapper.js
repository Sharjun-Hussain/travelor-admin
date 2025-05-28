"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
const HostManagement = dynamic(() => import("./Components/HostTable"), {
  ssr: false,
});

const HostPageWrapper = () => {
  const [AccessToken, setAccessToken] = useState("");
  useEffect(() => {
    const datafromlocalstorage = JSON.parse(localStorage.getItem("user"));
    setAccessToken(datafromlocalstorage?.data?.accessToken);
    console.log(datafromlocalstorage?.data?.accessToken);
  }, []);
  // Mock API functions
  const fetchHosts = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/amenities`,
      {
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
        withCredentials: true,
      }
    );
    return response.data.data;
    // return [
    //   {
    //     id: 1,
    //     name: "Lanka Ocean View Resort",
    //     email: "oceanview@lanka.com",
    //     avatar: "/api/placeholder/30/30",
    //     locations: 3,
    //     properties: 12,
    //     status: "active",
    //     joinDate: "2023-05-15",
    //     rating: 4.8,
    //     revenue: "LKR 14,320,000",
    //     country: "Sri Lanka",
    //     city: "Galle",
    //     propertyTypes: ["Resort", "Villa"],
    //     contactPerson: "Nimal Perera",
    //   },
    //   {
    //     id: 2,
    //     name: "Hill Country Lodge",
    //     email: "hillcountry@lanka.com",
    //     avatar: "/api/placeholder/30/30",
    //     locations: 1,
    //     properties: 5,
    //     status: "pending",
    //     joinDate: "2023-10-22",
    //     rating: 4.5,
    //     revenue: "LKR 5,760,000",
    //     country: "Sri Lanka",
    //     city: "Nuwara Eliya",
    //     propertyTypes: ["Lodge", "Cabin"],
    //     contactPerson: "Dilani Fernando",
    //   },
    //   {
    //     id: 3,
    //     name: "Colombo Luxury Apartments",
    //     email: "colomboluxury@lanka.com",
    //     avatar: "/api/placeholder/30/30",
    //     locations: 2,
    //     properties: 8,
    //     status: "active",
    //     joinDate: "2023-02-08",
    //     rating: 4.7,
    //     revenue: "LKR 9,870,000",
    //     country: "Sri Lanka",
    //     city: "Colombo",
    //     propertyTypes: ["Apartment", "Penthouse"],
    //     contactPerson: "Tharindu Jayasinghe",
    //   },
    //   {
    //     id: 4,
    //     name: "Bentota Beach Villas",
    //     email: "bentotabeach@lanka.com",
    //     avatar: "/api/placeholder/30/30",
    //     locations: 4,
    //     properties: 16,
    //     status: "inactive",
    //     joinDate: "2022-11-30",
    //     rating: 4.2,
    //     revenue: "LKR 16,920,000",
    //     country: "Sri Lanka",
    //     city: "Bentota",
    //     propertyTypes: ["Villa", "Bungalow"],
    //     contactPerson: "Shehani De Silva",
    //   },
    //   {
    //     id: 5,
    //     name: "Ella Countryside Cabins",
    //     email: "ellacabins@lanka.com",
    //     avatar: "/api/placeholder/30/30",
    //     locations: 2,
    //     properties: 9,
    //     status: "active",
    //     joinDate: "2023-07-14",
    //     rating: 4.9,
    //     revenue: "LKR 8,150,000",
    //     country: "Sri Lanka",
    //     city: "Ella",
    //     propertyTypes: ["Cabin", "Cottage"],
    //     contactPerson: "Kasun Wijesinghe",
    //   },
    //   {
    //     id: 6,
    //     name: "Skyline Towers Colombo",
    //     email: "skylinecolombo@lanka.com",
    //     avatar: "/api/placeholder/30/30",
    //     locations: 1,
    //     properties: 24,
    //     status: "active",
    //     joinDate: "2023-08-01",
    //     rating: 4.6,
    //     revenue: "LKR 29,310,000",
    //     country: "Sri Lanka",
    //     city: "Colombo",
    //     propertyTypes: ["Hotel", "Suite"],
    //     contactPerson: "Ruwani Fernando",
    //   },
    //   {
    //     id: 7,
    //     name: "Tropical Paradise Lanka",
    //     email: "tropicalparadise@lanka.com",
    //     avatar: "/api/placeholder/30/30",
    //     locations: 5,
    //     properties: 15,
    //     status: "active",
    //     joinDate: "2023-03-22",
    //     rating: 4.8,
    //     revenue: "LKR 19,480,000",
    //     country: "Sri Lanka",
    //     city: "Trincomalee",
    //     propertyTypes: ["Resort", "Overwater Villa"],
    //     contactPerson: "Shanika Dissanayake",
    //   },
    // ];
  };

  const addHost = async (newHost) => {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      id: Date.now(),
      ...newHost,
      properties: 0,
      joinDate: new Date().toISOString().split("T")[0],
      rating: 0,
      revenue: "$0",
      avatar: "/api/placeholder/30/30",
    };
  };

  const updateHost = async (updatedHost) => {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    return updatedHost;
  };

  const deleteHost = async (id) => {
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 600));
    alert(id);
    return id;
  };

  return (
    <>
      <HostManagement
        fetchHosts={fetchHosts}
        addHost={addHost}
        updateHost={updateHost}
        deleteHost={deleteHost}
        // columns={customColumns}
        // statusOptions={customStatusOptions}
        headerTitle="Property Partners"
        headerDescription="Manage all property owners and managers"
        addButtonLabel="Add New Partner"
        onHostClick={(host) => console.log("Host clicked:", host)}
      />
    </>
  );
};

export default HostPageWrapper;
