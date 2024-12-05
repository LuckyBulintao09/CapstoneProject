import React from "react";

import UnitLeftSection from "./_components/UnitLeftSection";
import { getUnitById } from "@/actions/unit/getUnitById";

export const revalidate = 0;

async function UnitDetailsPage({ params }: { params: { propertyId: string, unitId: string } }) {
    const units = await getUnitById(params.unitId);
    return (
        <>
            <UnitLeftSection units={units} unitId={params.unitId} propertyId={params.propertyId} />
        </>
    );
}

export default UnitDetailsPage;
