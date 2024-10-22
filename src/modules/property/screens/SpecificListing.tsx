
"use client";
import React, { useState, useEffect } from "react";
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
import { Card } from "@/components/ui/card";
import { NavbarModalLogin } from "@/components/navbar/NavbarModalLogin";
import {
  fetchUser,
  fetchProperty,
  toggleFavourite,
} from "@/actions/listings/specific-listing";

interface SpecificListingProps {
  id: number;
}

export function SpecificListing({ id }: SpecificListingProps) {
  const [isFavourite, setIsFavourite] = useState(false);
  const [property, setProperty] = useState<any | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserAndProperty = async () => {
      const fetchedUserId = await fetchUser();
      setUserId(fetchedUserId);

      const { unit, favorite } = await fetchProperty(id, fetchedUserId);
      setProperty(unit);
      setIsFavourite(favorite);

      setLoading(false);
    };

    loadUserAndProperty();
  }, [id]);

  const handleToggleFavourite = async () => {
    if (!userId) {
      setIsLoginModalOpen(true);
      return;
    }

    const success = await toggleFavourite(isFavourite, userId, property?.id);
    if (success) {
      setIsFavourite(!isFavourite);
    }
  };

  const handleLoginSuccess = async () => {
    setIsLoginModalOpen(false);
    const fetchedUserId = await fetchUser();
    setUserId(fetchedUserId);
  };

  if (loading) return <div>Loading...</div>;

  if (!property) return <div>No property found.</div>;

  const {
    title,
    price,
    property: { address, company },
    thumbnail_url,
    privacy_type,
    structure,
    bedrooms,
    beds,
    occupants,
    description,
  } = property;

  return (
    <ResponsiveLayout>
      <div className="grid grid-cols-5 gap-2 mt-4">
        <MainPreview propertyId={property.id} />
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 my-6">
        <div className="col-span-2 space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-semibold text-3xl dark:text-white">
                {title}
              </h1>
              <p>{company?.company_name}</p>
              <p className="flex items-center text-muted-foreground">
                <MapPin className="mr-1" height={18} width={18} />
                {address}
              </p>
            </div>
            <div className="relative flex items-center mr-3">
              <div className="group">
                <div onClick={handleToggleFavourite} className="cursor-pointer">
                  {isFavourite ? (
                    <HeartSolid className="h-8 w-8 text-red-500" />
                  ) : (
                    <HeartOutline className="h-8 w-8 text-gray-500" />
                  )}
                </div>
                <div className="absolute left-0 hidden group-hover:block bg-black text-white text-xs rounded-md p-2 w-32">
                  {isFavourite ? "Remove from favourites" : "Add to favourites"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center border-y border-gray-300 py-4">
            <Avatar className="mr-4">
              <AvatarFallback>
                {company?.owner_id?.firstname[0]}
                {company?.owner_id?.lastname[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="font-bold text-base">
                {company?.owner_id?.firstname} {company?.owner_id?.lastname}
              </h3>
              <p className="text-sm text-gray-700">Property Owner</p>
            </div>
          </div>

          <Banner
            ownerName={company?.owner_id?.firstname}
            ownerLastname={company?.owner_id?.lastname}
            ownerId={company?.owner_id?.id}
            companyId={property?.property?.company?.id}
            companyName={company?.company_name}
            propertyId={property.id}
          />

          <PropertyDetails
            privacyType={privacy_type}
            structure={structure}
            bedrooms={bedrooms}
            beds={beds}
            occupants={occupants}
            description={description}
          />
        </div>

        <div className="flex lg:justify-end lg:items-start col-span-full lg:col-span-1">
          <div className="w-max h-max sticky top-20">
            <BookingCard price={price} unitId={property?.id} />
          </div>
        </div>
      </div>

      <div className="flex flex-col border-t border-gray-300 py-8 mr-4">
        <h4 className="text-2xl font-semibold tracking-tight pb-4">
          Customer Reviews
        </h4>
        <BusinessReviews unitId={property?.id} />
      </div>

      <div className="flex flex-col border-t border-gray-300 py-8 mr-4">
        <h4 className="text-2xl font-semibold tracking-tight pb-4">
          Where you&apos;ll be
        </h4>
        <Card className="lg:h-[550px] md:h-full sm:h-[300px] xs:h-[365px] border-none">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.190906189018!2d120.59490157532025!3d16.415127984315635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3391a15d8cb0dc9b%3A0xe282b2015f6debba!2sUniversity%20of%20Baguio!5e0!3m2!1sen!2sph!4v1727501045306!5m2!1sen!2sph"
            className="rounded-md w-full h-full border-none"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </Card>
      </div>

      {isLoginModalOpen && (
        <NavbarModalLogin
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          openModal={() => setIsLoginModalOpen(true)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </ResponsiveLayout>
  );
}
