import React from "react";
import { getUnitById } from "@/actions/unit/getUnitById";
import EditUnitDetailsForm from "./_components/EditUnitForm";

async function EditUnitPage({ params }: { params: { propertyId: string; unitId: string } }) {
    const unit = await getUnitById(params.unitId);
    console.log(unit, "unit");
    return <><EditUnitDetailsForm unit={unit} /></>;
}

export default EditUnitPage;
