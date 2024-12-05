"use server"

import { createClient } from "@/utils/supabase/server"

export const getUnitAmenities = async (unitId: string) => {
    const supabase = createClient()

    try {
        
        const {data, error} = await supabase.from("unit_amenities")
        .select(`
            amenity_id,
            unit_id,
            amenity (id, amenity_name)
        `)
        .eq("unit_id", unitId);

        if (error?.code) {
            return error
        }

        const formattedData = data.map((item: any) => ({
            amenity_id: item.amenity_id,
            amenity_name: item.amenity?.amenity_name,
        }));

        return formattedData;

    } catch (error: any) {

        return error

    }
}

export const getUnitAdditionalAmenities = async (unitId: string) => {
    const supabase = createClient()

    try {
        
        const {data, error} = await supabase.from("unit_additional_amenities")
        .select(`id, unit_id, amenity_name`)
        .eq("unit_id", unitId);

        if (error?.code) {
            return error
        }

        const formattedData = data.map((item: any) => ({
            id: item.id,
            text: item.amenity_name,
        }));

        return formattedData;

    } catch (error: any) {

        return error

    }
}
