import React from "react";

import UnitLeftSection from "./_components/UnitLeftSection";
import { getUnitById } from "@/actions/unit/getUnitById";
import { getUnitAmenities } from "@/actions/unit/get-unit-amenities";

export const revalidate = 0;

async function UnitDetailsPage({ params }: { params: { propertyId: string, unitId: string } }) {
    const unit = await getUnitById(params.unitId);
    const unit_amenities = await getUnitAmenities(params.unitId);
    return (
        <>
            <UnitLeftSection unit={unit} unitId={params.unitId} propertyId={params.propertyId} unit_amenities={unit_amenities} />
        </>
    );
}

export default UnitDetailsPage;
