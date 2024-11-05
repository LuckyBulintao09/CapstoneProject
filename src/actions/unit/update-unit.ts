"use server";

import { CreateUnitType } from "@/lib/schemas/propertySchema";
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

export async function updateUnit(unitId: string, values: CreateUnitType) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("unit")
        .update({
            description: values.unit_description,
            property_id: values.property_id,
            title: values.unit_title,
            privacy_type: values.unit_type,
            structure: values.unit_structure,
            bedrooms: values.unit_bedrooms,
            beds: values.unit_beds,
            occupants: values.unit_occupants,
        })
        .eq("id", unitId)
        .select();
    
        if (error?.code) {
            throw error;
        }
        
        redirect(`/hosting/unit/`);
    
}