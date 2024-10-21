"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { MapPin } from "lucide-react";
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
  thumbnail_url: string;
  privacy_type: string;
  structure: string;
  bedrooms: number;
  beds: number;
  occupants: number;
  company: {
    owner_id: {
      firstname: string;
      lastname: string;
      id?: string;
    };
    name?: string;
  };
  created_at: string;
};

export function SpecificListing({ id }: SpecificListingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [propertyAddress, setPropertyAddress] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
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

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      const { data: unit, error } = await supabase
        .from("unit")
        .select(
          `
          *,
          property (
            address,
            company (
              owner_id (
                firstname,
                lastname,
                id
              ),
              company_name
            )
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching unit:", error);
        setLoading(false);
        return;
      }

      setProperty(unit);
      setPropertyAddress(unit.property?.address || "");

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

      setLoading(false);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!property) {
    return <div>No property found.</div>;
  }

  const mappedData = {
    propertyDetails: property.title,
    propertyAddress: property.property?.address,
    propertyPrice: property.price,
    ownerFirstname: property.property?.company?.owner_id?.firstname,
    ownerLastname: property.property?.company?.owner_id?.lastname,
    ownerId: property.property?.company?.owner_id?.id,
    companyName: property.property?.company?.company_name,
    propertyDescription: property.description,
    createdAt: property.created_at,
    thumbnailUrl: property.thumbnail_url,
    privacyType: property.privacy_type,
    structure: property.structure,
    bedrooms: property.bedrooms,
    beds: property.beds,
    occupants: property.occupants,
  };

  console.log(property);

  return (
    <ResponsiveLayout>
      <div className="grid grid-cols-5 gap-2 mt-4">
        <MainPreview
          openModal={() => setIsOpen(true)}
          propertyId={property.id}
        />
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 my-6">
        <div className="col-span-2 space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-semibold text-3xl dark:text-white">
                {mappedData.propertyDetails}
              </h1>
              <p>{property.company?.name}</p>
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
          <Banner
            ownerName={mappedData.ownerFirstname}
            ownerLastname={mappedData.ownerLastname}
            ownerId={mappedData.ownerId}
            companyId={property.property?.company?.id}
            companyName={mappedData.companyName}
            propertyId={property.id}
          />

          <PropertyDetails
            privacyType={mappedData.privacyType}
            structure={mappedData.structure}
            bedrooms={mappedData.bedrooms}
            beds={mappedData.beds}
            occupants={mappedData.occupants}
            description={mappedData.propertyDescription}
          />
        </div>

        <div className="flex lg:justify-end lg:items-start col-span-full lg:col-span-1">
          <div className=" w-max h-max sticky top-20">
            <BookingCard price={property?.price} />
          </div>
        </div>
      </div>

      <div className="flex flex-col  border-t border-gray-300 py-8 mr-4">
        <h4 className="text-2xl font-semibold tracking-tight pb-4">
          Customer Reviews
        </h4>
        <BusinessReviews unitId={property?.id} />
      </div>
    </ResponsiveLayout>
  );
}
