"use server";

import { CreateUnitType } from "@/lib/schemas/propertySchema";
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

export async function updateUnit(unitId: string, propertyId: string, values: any) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("unit")
        .update({
            property_id: propertyId,
            title: values.title,
            price: values.price,
            privacy_type: values.privacy_type,
            bedrooms: values.unit_bedrooms,
            beds: values.unit_beds,
            occupants: values.unit_occupants,
            room_size: values.room_size,
        })
        .eq("id", unitId)
        .select();
    
        if (error?.code) {
            throw error;
        }
        
        redirect(`/hosting/properties/${propertyId}/details/units`);
    
}

export const toggleIsReserved = async (unitId: string, isReserved: boolean) => {
    const supabase = createClient();

    const { data, error } = await supabase.from("unit").update({ isReserved: isReserved }).eq("id", unitId).select();

    if (error?.code) {
        throw error;
    }

    return data;
}