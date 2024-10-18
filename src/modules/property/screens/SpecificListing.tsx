"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "../../../../utils/supabase/client";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import { Card } from "@/components/ui/card";
import { Image, MapPin } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import tempValues from "@/lib/constants/tempValues";
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
    id: number;
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
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
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
        console.log("Authenticated User ID: ", user.id);
        setUserId(user.id);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      const { data: property, error } = await supabase
        .from("property")
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
        console.error("Error fetching property:", error);
      } else {
        console.log("Fetched property:", property);
        setProperty(property);
      }

      if (userId) {
        const { data: favorite, error: favError } = await supabase
          .from("favorites")
          .select("id")
          .eq("Account_ID", userId)
          .eq("Property_ID", id)
          .single();

        if (favError) {
          console.error("Error checking favorite status:", favError);
        } else if (favorite) {
          setIsFavourite(true);
        }
      }
    };

    fetchProperty();
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

        if (error) {
          console.error("Error removing favorite:", error);
        } else {
          console.log("Favorite removed");
          setIsFavourite(false);
        }
      } else {
        const { data, error } = await supabase
          .from("favorites")
          .insert([{ Account_ID: userId, Property_ID: property.id }]);

        if (error) {
          console.error("Error adding to favorites:", error);
        } else {
          console.log("Added to favorites:", data);
          setIsFavourite(true);
        }
      }
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
  };

  if (!property) {
    return <div>Loading...</div>;
  }
  const mappedData = property && {
    propertyDetails: property.details,
    propertyAddress: property.address,
    propertyPrice: property.price,
    ownerFirstname: property.company?.owner_id?.firstname,
    ownerLastname: property.company?.owner_id?.lastname,
    createdAt: property.created_at,
  };
  return (
    <ResponsiveLayout>
      <div>
        <div className="grid grid-cols-5 gap-2 mt-4">
          <MainPreview openModal={openModal} propertyId={property?.id} />
        </div>

        <div>
          <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 my-6 ">
            <div className="col-span-2">
              <div className="space-y-5">
                {/* Header */}
                <div className=" flex justify-between items-center">
                  <div>
                    <h1 className="font-semibold xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-left dark:text-white">
                      {/* {
												tempValues.BRANCHES_AND_ROOMS[1].available_rooms[1]
													.room_title
											} */}
                      {property?.description}
                    </h1>
                    <p className="flex items-center text-muted-foreground lg:text-md">
                      <MapPin className="mr-1" height={18} width={18} />
                      {property?.address}
                    </p>
                  </div>
                  <div className="relative flex items-center mr-3">
                    <div className="group">
                      <div onClick={toggleFavourite} className="cursor-pointer">
                        {isFavourite ? (
                          <HeartSolid className="h-8 w-8 text-red-500" />
                        ) : (
                          <HeartOutline className="h-8 w-8 text-gray-500" />
                        )}
                      </div>

                      <div className="absolute left-0 hidden group-hover:block bg-black text-white text-xs rounded-md p-2 w-32">
                        Add to favourites
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center border-y border-gray-300 mr-4 py-4">
                  <Avatar className="mr-3 lg:mr-4">
                    <AvatarFallback>
                      {property?.company?.owner_id?.firstname?.charAt(0)}
                      {property?.company?.owner_id?.lastname?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h3 className="font-bold text-sm lg:text-base">
                      {property?.company?.owner_id?.firstname}{" "}
                      {property?.company?.owner_id?.lastname}
                    </h3>
                    <p className="text-sm text-gray-700">Property Owner</p>
                  </div>
                </div>

                <PropertyDetails />
                <Banner />
              </div>
            </div>
            <div className="flex lg:justify-end lg:items-start col-span-full lg:col-span-1">
              <div className=" w-max h-max sticky top-20">
                <BookingCard price={property?.price} />
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* other info */}
          <div>
            <div className="flex flex-col border-t border-gray-300 py-8 mr-4">
              <h4 className="text-2xl font-semibold tracking-tight">
                Other Information
              </h4>
              <div className="flex flex-row justify-between">
                {tempValues.OTHER_INFO.map((info) => (
                  <div
                    className="flex flex-row items-center gap-3 my-3"
                    key={info.id}
                  >
                    <Image />
                    <div>
                      <small className="text-sm font-medium leading-none">
                        {info.info}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* nearby places */}
            <div>
              <div className="flex flex-col ">
                <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  Nearby Places
                </h4>
                <div className="flex flex-row justify-between">
                  {tempValues.NEARBY_PLACES.map((item) => (
                    <div
                      className="flex flex-row items-center gap-3 my-3"
                      key={item.id}
                    >
                      <Image />
                      <div>
                        <h5 className="scroll-m-20 text-lg font-semibold tracking-tight">
                          {item.place}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {item.km}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col  border-t border-gray-300 py-8 mr-4">
              <h4 className="text-2xl font-semibold tracking-tight pb-4">
                Customer Reviews
              </h4>
              <BusinessReviews />
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

            <div className="flex flex-col border-t border-gray-300 py-8 mr-4">
              <h4 className="text-2xl font-semibold tracking-tight pb-4">
                Things to know
              </h4>
              <div className="grid grid-cols-2">
                <div className="">
                  <p className="font-bold">House Rules</p>
                  {tempValues.HOUSE_RULES.map((rule) => (
                    <p className="py-1" key={rule.id}>
                      {rule.rule}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="font-bold">Safety & Property</p>
                  {tempValues.SAFETY_PROPERTY.map((rule) => (
                    <p className="py-1" key={rule.id}>
                      {rule.rule}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
