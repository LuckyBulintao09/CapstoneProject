import React from "react";

import { getPropertyAmenities, getPropertyById, getPropertyHouseRules, getPropertyLocation } from "@/actions/property/get-property-by-id";
import { getUnitsCount } from "@/actions/unit/getAllUnitUnderProperty";
import { checkPropertyDocuments, getBusinessPermit, getFireInspection } from "@/actions/property/propertyDocuments";

import LeftSection from "./_components/LeftSection";
import { getAuthenticatedUser } from "@/utils/supabase/server";

export const revalidate = 0;

async function PropertyDetailsPage({ params }: { params: { propertyId: string } }) {
    const user = await getAuthenticatedUser();

    const property = await getPropertyById(params.propertyId);
    const units = await getUnitsCount(params.propertyId);
    const [location] = await getPropertyLocation(params.propertyId);
    const property_house_rules = await getPropertyHouseRules(params.propertyId);
    const property_amenities = await getPropertyAmenities(params.propertyId);

    const documentsStatus = await checkPropertyDocuments(params.propertyId);
    const businessPermit = await getBusinessPermit(params.propertyId);
    const fireInspection = await getFireInspection(params.propertyId);

    console.log(documentsStatus, "default");

    
    return (
        <>
            <LeftSection property={property} units={units} location={location} propertyId={params.propertyId} property_house_rules={property_house_rules} propertyAmenities={property_amenities} businessPermit={businessPermit} fireInspection={fireInspection} documentsStatus={documentsStatus} userId={user?.id} />
        </>
    );
}

export default PropertyDetailsPage;
