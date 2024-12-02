import React from "react";



import { getPropertyById, getPropertyLocation } from "@/actions/property/get-property-by-id";
import { getAllUnitUnderProperty } from "@/actions/unit/getAllUnitUnderProperty";
import LeftSection from "./_components/LeftSection";



export const revalidate = 0;

async function PropertyDetailsPage({ params }: { params: { propertyId: string } }) {
    const property = await getPropertyById(params.propertyId);
    const units = await getAllUnitUnderProperty(params.propertyId);
    const [location] = await getPropertyLocation(params.propertyId);
    console.log(units.length)
    return (
        <>
            <LeftSection property={property} units={units} location={location} propertyId={params.propertyId} />
        </>
    );
}

export default PropertyDetailsPage;
