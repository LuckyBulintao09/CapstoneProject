"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation"; 
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { updateCardAction } from "@/app/actions/cards/updateCard";

const EditProgramPage = () => {
  const searchParams = useSearchParams(); 
  const id = searchParams.get("id");

  if (!id) {
    toast.error("ID is required.");
    return;
  }

  const [title, setTitle] = useState<string>(searchParams.get("title") || "");
  const [shortDescription, setShortDescription] = useState<string>(searchParams.get("short_description") || "");
  const [createdAt, setCreatedAt] = useState<string>(searchParams.get("created_at") || "");
  const [updatedAt, setUpdatedAt] = useState<string | null>(searchParams.get("updated_at"));
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const thumbnail_url = searchParams.get("thumbnail_url");

  // Handle file input change (thumbnail image upload)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setThumbnailFile(file); // Save the file for uploading later

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          // Optional: Preview the image (if desired)
        }
      };
      reader.readAsDataURL(file); // Read the file as a data URL for preview
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  // Handle title change (with max length of 40)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 50);
    setTitle(value);
  };

  // Handle short description change (with max length of 200)
  const handleShortDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 200);
    setShortDescription(value);
  };

  // Handle program update
  const handleUpdateProgram = () => {
    if (!title.trim() || !shortDescription.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    const loadingToast = toast.loading("Updating...");
    setLoading(true);

    const result = updateCardAction(id, {
      title,
      shortDescription,
      thumbnailFile,
      thumbnail_url, 
    });
  };

  return (
    <div className="p-4 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/protected/admin/dashboard">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/protected/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-center mt-4">
        <Card className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2 hover:shadow-lg transition-shadow break-words">
          <CardHeader className="p-1">
            <CardTitle className="text-sm break-words whitespace-normal">
              {title || "Program Title"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            {thumbnail_url ? (
              <div className="w-full h-40 bg-gray-300 flex justify-center items-center rounded-md overflow-hidden">
                <img
                  src={thumbnail_url}
                  alt="Card Thumbnail"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ) : (
              <div className="w-full h-40 bg-gray-200 flex justify-center items-center rounded-md">
                <p className="text-sm text-gray-500">No image uploaded</p>
              </div>
            )}
            <p className="mt-2 text-xs break-words whitespace-normal">
              {shortDescription || "Card short description"}
            </p>
          </CardContent>
          <CardFooter className="p-1">
            <p className="text-xs text-gray-500">Created at: {createdAt}</p>
          </CardFooter>
        </Card>
      </div>

      <h1 className="text-lg font-bold">Edit Program</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter card title (max 50 characters)"
          />
          <p className="text-xs text-gray-500">
            {50 - title.length} characters left
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium">Short Description</label>
          <input
            type="text"
            value={shortDescription}
            onChange={handleShortDescriptionChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter short description (max 200 characters)"
          />
          <p className="text-xs text-gray-500">
            {200 - shortDescription.length} characters left
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium">Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded-md m-1"
            onClick={() => {
              window.location.href = "/protected/admin/dashboard";
            }}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateProgram}
            className="bg-blue-500 text-white py-2 px-4 rounded-md m-1"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProgramPage;
