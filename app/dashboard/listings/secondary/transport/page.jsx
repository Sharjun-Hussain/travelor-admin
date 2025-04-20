"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { CheckCheck, PenOff, Plus, Send, ToggleRight } from "lucide-react";
import { TravelListingTable } from "./TravelTable";
import TravelAddModel from "./TravelAddModel";
axios.defaults.withCredentials = true;

export default function DemoPage() {
  const [TravelTypesData, setTravelTypesData] = useState([]);
  const [loading, setloading] = useState(false);
  const [OpenModal, setOpenModal] = useState(false);

  const handleChildData = (TravelTypesData) => {
    if (!TravelTypesData) {
      console.log("No data to update or create.");
      return;
    }

    if (TravelTypesData.length === 0) {
      setTravelTypesData(TravelTypesData);
      return;
    }
    setTravelTypesData((prevCategory) => {
      const categoryIndex = prevCategory.findIndex(
        (o) => o.id === TravelTypesData.id
      );
      if (categoryIndex >= 0) {
        // Update existing office
        const updatedCategories = [...prevCategory];
        updatedCategories[categoryIndex] = TravelTypesData;
        return updatedCategories;
      } else {
        // Add new office
        return [...prevCategory, TravelTypesData];
      }
    });
  };

  const handleDelete = (categoryid) => {
    setTravelTypesData((prev) =>
      prev.filter((category) => category.id !== categoryid)
    );
  };

  useEffect(() => {
    const fetchTravelTypesData = async () => {
      setloading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/Subcategory`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withXSRFToken: true,
          withCredentials: true,
        }
      );

      if (res.status == 200) {
        console.log(res.data);
        setTravelTypesData(res.data.data);
        setloading(false);
      }
    };
    fetchTravelTypesData();
  }, []);

  return (
    <div className=" w-full h-full  ">
      <div className=" mx-4  border-black-400 border px-4 py-4 mt-4 rounded-lg">
        <div className="flex items-center border-b-black-400 border-b pb-3 ">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Travel Types</h2>
            <h2 className="text-sm font-semibold  text-gray-700 dark:text-gray-400 ">
              Manage your Travel Types Here
            </h2>
          </div>
          <div className="ms-auto">
            <Button
              className="pe-2 ps-1"
              onClick={() => setOpenModal(true)}
              variant="outline"
            >
              {" "}
              <Plus size={15} className="me-1" />
              Add Travel Types
            </Button>
          </div>
        </div>

        <div>
          <div>
            <TravelListingTable
              onDelete={handleDelete}
              data={TravelTypesData}
              loading={loading}
              onUpdate={handleChildData}
            />
          </div>
        </div>
        <TravelAddModel
          onUpdate={handleChildData}
          OpenModal={OpenModal}
          setOpenModal={setOpenModal}
        />

        {/* <DataTable columns={columns} data={data} /> */}
      </div>
    </div>
  );
}
