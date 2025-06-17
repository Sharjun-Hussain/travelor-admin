"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
const HomestayManagement = dynamic(() => import("./homestay-management"), {
  ssr: false,
});

const PageWrapper = () => {
  // Mock API functions
  const [AccessToken, setAccessToken] = useState("");
  useEffect(() => {
    const datafromlocalstorage = JSON.parse(localStorage.getItem("user"));
    setAccessToken(datafromlocalstorage?.data?.accessToken);
    console.log(datafromlocalstorage?.data?.accessToken);
  }, []);
  const fetchFunction = async () => {

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/merchants/properties`,
      {
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
        withCredentials: true,
      }
    );
    return response.data.data;

  }

  const addFunction = async (newEntity) => {

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/merchants/properties`,
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
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/merchants/properties/${updatedEntity.get('id')}`,
      updatedEntity,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      }
    );
    return updatedEntity;

  };

  const deletFucntion = async (id) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/merchants/properties/${id}`,
      {
        withCredentials: true,
      }
    );
    return id;
  };

  return (
    <>
      <HomestayManagement
        fetchEntities={fetchFunction}
        addEntity={addFunction}
        updateEntity={updateFunction}
        deleteEntity={deletFucntion}
      />
    </>
  );
};

export default PageWrapper;
