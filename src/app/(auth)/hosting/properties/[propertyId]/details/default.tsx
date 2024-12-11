import React from "react";

import { getPropertyAmenities, getPropertyById, getPropertyHouseRules, getPropertyLocation } from "@/actions/property/get-property-by-id";
import { getUnitsCount } from "@/actions/unit/getAllUnitUnderProperty";
import LeftSection from "./_components/LeftSection";

export const revalidate = 0;

async function PropertyDetailsPage({ params }: { params: { propertyId: string } }) {
    const property = await getPropertyById(params.propertyId);
    const units = await getUnitsCount(params.propertyId);
    const [location] = await getPropertyLocation(params.propertyId);
    const property_house_rules = await getPropertyHouseRules(params.propertyId);
    const property_amenities = await getPropertyAmenities(params.propertyId);

    
    return (
        <>
            <LeftSection property={property} units={units} location={location} propertyId={params.propertyId} property_house_rules={property_house_rules} propertyAmenities={property_amenities} />
        </>
    );
}

export default PropertyDetailsPage;
