import { getAllAmenities } from "@/actions/amenety/getAllAmenities";
import AddUnitAmenities from "@/modules/hosting/unit/AddUnitAmenities";
import React from "react";

async function AmenitiesFormPage({ params }: { params: { unitId: string } }) {
    const amenities = await getAllAmenities();
    return (
        <div className="container mx-auto py-7 w-full flex items-center justify-center h-[calc(100vh-5rem-5px)]">
            <AddUnitAmenities unitId={params.unitId} amenities={amenities} />
        </div>
    );
}

export default AmenitiesFormPage;
