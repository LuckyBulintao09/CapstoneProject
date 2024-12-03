"use server";

import { CreateUnitType } from "@/lib/schemas/propertySchema";
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

export async function updateUnit(unitId: string, propertyId: string, values: any) {
    const supabase = createClient();

    const { data: unitData, error:unitError } = await supabase
        .from("unit")
        .update({
            property_id: propertyId,
            title: values.title,
            price: values.price,
            privacy_type: values.privacy_type,
            bedrooms: values.bedrooms,
            beds: values.beds,
            occupants: values.occupants,
            room_size: values.room_size,
        })
        .eq("id", unitId)
        .select();
    
        if (unitError?.code) {
            throw unitError;
        }

        await insertAmenities(values.amenities, unitId);
        
        redirect(`/hosting/properties/${propertyId}/details/units`);
    
}

const insertAmenities = async (data: {value: string, label: string}[], unitId: string) => {
    const supabase = createClient();

    const amenities_insert = data.map(({value}: {value: string}) => ({
        unit_id: unitId,
        amenity_id: value
    }))

    const { data: unitAmenitiesData, error:unitAmenitiesError } = await supabase
        .from("unit_amenities")
        .insert(amenities_insert)
        .select();

    if (unitAmenitiesError?.code) {
        throw unitAmenitiesData;
    }
}

export const toggleIsReserved = async (unitId: string, isReserved: boolean) => {
    const supabase = createClient();

    const { data, error } = await supabase.from("unit").update({ isReserved: isReserved }).eq("id", unitId).select();

    if (error?.code) {
        throw error;
    }

    return data;
}