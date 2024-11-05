import { getAllPropertiesUnderUser } from "@/actions/property/get-all-properties-under-user";
import AddUnitForm from "@/modules/hosting/unit/AddUnitForm";
import { getAuthenticatedUser } from "@/utils/supabase/server";
import React from "react";

async function UnitProperty({ params }: {params: {unitId: string}}) {
    const user = await getAuthenticatedUser();
    const properties = await getAllPropertiesUnderUser(user.id) 
    return (
        <div className="container mx-auto py-7 w-full flex items-center justify-center h-[calc(100vh-5rem-5px)]">
            <AddUnitForm properties={properties} unitId={params.unitId} />
        </div>
    );
}

export default UnitProperty;
