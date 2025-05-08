"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
const TransportManagement = dynamic(() => import("./transport-management"), {
  ssr: false,
});

const PageWrapper = () => {
  const [AccessToken, setAccessToken] = useState("");
  useEffect(() => {
    const datafromlocalstorage = JSON.parse(localStorage.getItem("user"));
    setAccessToken(datafromlocalstorage?.data?.accessToken);
    console.log(datafromlocalstorage?.data?.accessToken);
  }, []);

  const fetchFunction = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/transport-agencies`,
      {
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
        withCredentials: true,
      }
    );
    return response.data.data;
  };

  const addFunction = async (newEntity) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/transport-agencies`,
      newEntity,
      {
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
        withCredentials: true,
      }
    );
    return response.data.data;
  };

  const updateFunction = async (updatedEntity) => {
    alert(JSON.stringify(updatedEntity));
    // Simulating API call
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/transport-agencies/${updatedEntity.id}`,
      updatedEntity,
      {
        withCredentials: true,
      }
    );
    return updatedEntity;
  };

  const deletFucntion = async (id) => {
    // Simulating API call
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/transport-agencies/${id}`,
      {
        withCredentials: true,
      }
    );
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
