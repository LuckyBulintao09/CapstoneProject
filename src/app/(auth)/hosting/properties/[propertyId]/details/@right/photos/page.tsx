import React from "react";

import Image from "next/image";
import { getPropertyById } from "@/actions/property/get-property-by-id";

async function PhotosPage({ params }: { params: { propertyId: string } }) {
    const property = await getPropertyById(params.propertyId);
    return (
        <div className="airBnbDesktop:mx-auto airBnbBigDesktop:w-[608px] min-[1128px]:w-[512px] airBnbDesktop:w-[464px]">
            <div className="mb-6 font-normal airBnbDesktop:mb-12">
                <div className="text-[1rem] leading-5 tracking-normal my-0">
                    Manage photos here. Guests will see these photos when they view your listing.
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 airBnbDesktop:grid-cols-3 airBnbDesktop:gap-4">
                <Image src={property[0].property_image[0]} alt="property image" width={1920} height={1080} className="aspect-square object-cover rounded-lg" />
                <Image src={property[0].property_image[1]} alt="property image" width={1920} height={1080} className="aspect-square object-cover rounded-lg" />
                <Image src={property[0].property_image[2]} alt="property image" width={1920} height={1080} className="aspect-square object-cover rounded-lg" />
                <Image src={property[0].property_image[3]} alt="property image" width={1920} height={1080} className="aspect-square object-cover rounded-lg" />
            </div>
        </div>
    );
}

export default PhotosPage;
