"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { createCardAction } from "@/app/actions/cards/createCard";

export default function Page() {
  const [title, setTitle] = useState<string>("");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const formattedDate = new Date().toLocaleString();
    setCreatedAt(formattedDate);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 50);
    setTitle(value);
  };

  const handleShortDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 200);
    setShortDescription(value);
  };

  const handleCreateImage = async () => {
    if (!title.trim() || !shortDescription.trim() || !thumbnailFile) {
      toast.error("Please fill in all fields and upload an image.");
      return;
    }

    const loadingToast = toast.loading("Creating card...");
    setLoading(true);

    try {
      const result = await createCardAction(
        title,
        shortDescription,
        thumbnailFile
      );
      
      if (result?.success) {
        toast.success("Card created successfully!", { id: loadingToast });
        setThumbnailFile(null);
        setThumbnailUrl(null);
        window.location.href = "/protected/admin/dashboard";
      } else {
        toast.error("Failed to create card.", { id: loadingToast });
      }
      
      setTitle("");
      setShortDescription("");
    } catch (error) {
      console.error("Error creating card:", error);
      toast.error("An unexpected error occurred.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
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
            <BreadcrumbPage>Create</BreadcrumbPage>
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
            {thumbnailUrl ? (
              <div className="w-full h-40 bg-gray-300 flex justify-center items-center rounded-md overflow-hidden">
                <img
                  src={thumbnailUrl}
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

      <h1 className="text-lg font-bold">Create New Card</h1>

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
            onClick={handleCreateImage}
            className="bg-blue-500 text-white py-2 px-4 rounded-md m-1"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
