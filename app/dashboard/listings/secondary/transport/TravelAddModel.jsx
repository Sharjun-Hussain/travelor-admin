"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

export default function TravelAddModel({
  onUpdate,
  OpenModal,
  setOpenModal,
  existingCategory,
}) {
  const [code, setCode] = useState(existingCategory?.code || "");
  const [name, setName] = useState(existingCategory?.name || "");
  const [selectedMainCategory, setselectedMainCategory] = useState();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isEditing = !!existingCategory;

  const categoryId = (categoryid) => {
    setselectedMainCategory(categoryid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/Subcategory${
        isEditing ? `/${existingCategory.id}` : ""
      }`;
      const method = isEditing ? "put" : "post";
      const res = await axios({
        method,
        url,
        data: { code, name, main_category_id: selectedMainCategory },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.status === 200 || res.status === 201) {
        toast(
          `${
            isEditing
              ? "Sub Category Updated Successfully"
              : "Sub Category Added Successfully"
          }`,
          { duration: 1600, position: "top-right" }
        );
        setLoading(false);

        onUpdate(res.data.data);

        setOpenModal(false);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = err.response.data.errors;

        // Loop through each field in the error object
        Object.keys(errorMessages).forEach((field) => {
          const fieldErrors = errorMessages[field];

          // Show a toast for each error message related to the field
          fieldErrors.forEach((errorMessage) => {
            toast.error(`${field}: ${errorMessage}`, {
              duration: 4000, // Duration for each toast
              position: "top-right", // Position of the toast
            });
          });
        });
      } else {
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.", {
          duration: 4000,
          position: "top-right",
        });
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (existingCategory) {
      setCode(existingCategory.code);
      setName(existingCategory.office_name);
    } else {
      setCode("");
      setName("");
    }
  }, [existingCategory]);

  if (!OpenModal) return null;

  return (
    <Dialog open={OpenModal} onOpenChange={setOpenModal}>
      <DialogContent className="sm:max-w-[455px] w-full bg-card dark:bg-accent">
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Main Category" : "Add Main Category"}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Make changes to your profile here. Click save when done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex w-full  flex-row gap-4 pt-4">
            <div className="flex-row flex-1">
              <div className="items-center  gap-4 mb-3">
                <Label htmlFor="name" className="text-right">
                  Select Main Category
                </Label>
              </div>

              <div className="items-center  gap-4">
                <Label htmlFor="name" className="text-right">
                  Category Code
                </Label>
                <Input
                  id="name"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="items-center gap-4 pt-4">
                <Label htmlFor="branchcode" className="text-right">
                  Main Category Name
                </Label>
                <Input
                  id="branchcode"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="mt-4"
              disabled={loading}
              variant="outline"
              type="submit"
            >
              {loading
                ? "Loading..."
                : isEditing
                ? "Update Main Category"
                : "Add Main Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
