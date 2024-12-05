"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function createEmptyUnit(propertyId) {
    const supabase = createClient();

    const { data, error } = await supabase.from("unit").insert([{}]).select().single();

    if (error?.code) {
        throw error;
    }

    redirect(`/hosting/properties/${propertyId}/units/add-a-unit/${data.id}/unit-details`);
}

export async function createEmptyUnits(numberOfUnits: number, propertyId: string) {
    const supabase = createClient();
    const units_insert = Array.from({ length: numberOfUnits }).map(() => ({
        property_id: propertyId,
        price: null,
        title: null,
        privacy_type: null,
        bedrooms: null,
        beds: null,
        occupants: null,
        unit_image: [],
        outside_view: false,
        room_size: null,
    }))

    try {
        const { data, error } = await supabase.from("unit").insert(units_insert).select("id");

        if (error?.code) {
            throw error;
        }
        
        redirect(`/hosting/properties/${propertyId}/units/add-a-unit/unit-details`);
    } catch (error: any) {
        console.log(error)
        throw error;
    }
}
