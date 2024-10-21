import spiels from "@/lib/constants/spiels";
import tempValues from "@/lib/constants/tempValues";
import { Image } from "lucide-react";
import React from "react";
import { Shield, Building, Bed, UserIcon } from "lucide-react";
interface PropertyDetailsProps {
  details: string;
  privacyType: string;
  structure: string;
  bedrooms: number;
  beds: number;
  occupants: number;
  description: string;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  privacyType,
  structure,
  bedrooms,
  beds,
  occupants,
  description,
}) => {
  return (
    <>
      <div className="border-b border-gray-300 pb-6 mb-6">
        <h5 className="text-lg font-semibold">Unit Overview:</h5>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="w-6 h-6 text-gray-700 mr-2" />
                <h5 className="text-lg font-semibold">Privacy Type</h5>
              </div>
              <p className="text-gray-700">{privacyType}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Building className="w-6 h-6 text-gray-700 mr-2" />
                <h5 className="text-lg font-semibold">Building Structure</h5>
              </div>
              <p className="text-gray-700">{structure}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bed className="w-6 h-6 text-gray-700 mr-2" />
                <h5 className="text-lg font-semibold">Number of Bedrooms</h5>
              </div>
              <p className="text-gray-700">{bedrooms}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bed className="w-6 h-6 text-gray-700 mr-2" />
                <h5 className="text-lg font-semibold">Number of Beds</h5>
              </div>
              <p className="text-gray-700">{beds}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserIcon className="w-6 h-6 text-gray-700 mr-2" />
                <h5 className="text-lg font-semibold">Current Occupants</h5>
              </div>
              <p className="text-gray-700">{occupants}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full ">
        <h1 className="text-2xl font-semibold tracking-tight pb-4">
          Description
        </h1>
        <p className="">{description}</p>
        <hr className="mt-4 border-gray-600 opacity-25" />
      </div>
      {/* general */}
      <div className="flex flex-col border-b border-gray-300 pb-8 mr-4">
        <h4 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          General
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-1 gap-2">
          {tempValues.LISTINGS[0].amenities.map((amenity) => (
            <div
              className="flex flex-row items-center gap-3 my-2"
              key={amenity.amenity_name}
            >
              <Image />
              <div>
                <h5 className="scroll-m-20 text-lg font-semibold tracking-tight">
                  {amenity.amenity_name}
                </h5>
                <p className="text-sm text-muted-foreground">
                  Amenemenemeneties Lorem, ipsum dolor.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;
