"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import BusinessReviews from "../components/BusinessReviews";
import MainPreview from "../components/MainPreview";
import PropertyDetails from "../components/PropertyDetails";
import Banner from "../components/Banner";
import { BookingCard } from "../components/BookingCard";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

const supabase = createClient();

interface SpecificListingProps {
  id: number;
}

type Property = {
  id: number;
  details: string;
  address: string;
  price: number;
  company: {
    owner_id: {
      firstname: string;
      lastname: string;
    };
  };
  created_at: string;
};

export function SpecificListing({ id }: SpecificListingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [propertyAddress, setPropertyAddress] = useState<string>("");

  // Fetch authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUser();
  }, []);

  // Fetch unit and property address
  useEffect(() => {
    const fetchProperty = async () => {
      const { data: unit, error } = await supabase
        .from("unit")
        .select(
          `
          *,
          company (
            owner_id (
              firstname,
              lastname
            )
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching unit:", error);
        return;
      }
      setProperty(unit);

      // Use property_id from unit to fetch the address from the property table
      if (unit.property_id) {
        const { data: propertyData, error: propertyError } = await supabase
          .from("property")
          .select("address")
          .eq("id", unit.property_id)
          .single();

        if (propertyError) {
          console.error("Error fetching property address:", propertyError);
          return;
        }
        setPropertyAddress(propertyData?.address || "");
      }

      // Check if the unit is a favourite for the logged-in user
      if (userId) {
        const { data: favorite, error: favError } = await supabase
          .from("favorites")
          .select("id")
          .eq("Account_ID", userId)
          .eq("Property_ID", id)
          .single();

        if (!favError && favorite) {
          setIsFavourite(true);
        }
      }
    };

    if (id) fetchProperty();
  }, [id, userId]);

  const toggleFavourite = async () => {
    if (!property || !userId) {
      console.error("Missing property or user ID");
      return;
    }

    try {
      if (isFavourite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("Account_ID", userId)
          .eq("Property_ID", property.id);

        if (!error) setIsFavourite(false);
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert([{ Account_ID: userId, Property_ID: property.id }]);

        if (!error) setIsFavourite(true);
      }
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  const mappedData = {
    propertyDetails: property.details,
    propertyAddress: propertyAddress,
    propertyPrice: property.price,
    ownerFirstname: property.company?.owner_id?.firstname,
    ownerLastname: property.company?.owner_id?.lastname,
    createdAt: property.created_at,
  };

  return (
    <ResponsiveLayout>
      <div className="grid grid-cols-5 gap-2 mt-4">
        <MainPreview openModal={() => setIsOpen(true)} propertyId={property.id} />
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 my-6">
        <div className="col-span-2 space-y-5">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-semibold text-3xl dark:text-white">{mappedData.propertyDetails}</h1>
              <p className="flex items-center text-muted-foreground">
                <MapPin className="mr-1" height={18} width={18} />
                {mappedData.propertyAddress}
              </p>
            </div>
            <div className="relative flex items-center">
              <div className="group">
                <div onClick={toggleFavourite} className="cursor-pointer">
                  {isFavourite ? (
                    <HeartSolid className="h-8 w-8 text-red-500" />
                  ) : (
                    <HeartOutline className="h-8 w-8 text-gray-500" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Owner Info */}
          <div className="flex items-center border-y border-gray-300 py-4">
            <Avatar className="mr-4">
              <AvatarFallback>
                {mappedData.ownerFirstname?.[0]}
                {mappedData.ownerLastname?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="font-bold text-base">
                {mappedData.ownerFirstname} {mappedData.ownerLastname}
              </h3>
              <p className="text-sm text-gray-700">Property Owner</p>
            </div>
          </div>

          <PropertyDetails />
          <Banner />
        </div>

        <div className="lg:col-span-1 col-span-full flex lg:justify-end sticky top-20">
          <BookingCard price={mappedData.propertyPrice} />
        </div>
      </div>

      {/* Reviews and Other Sections */}
      <div className="border-t border-gray-300 py-8">
        <BusinessReviews />
      </div>
    </ResponsiveLayout>
  );
}
