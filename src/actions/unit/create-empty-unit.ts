"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

export async function createEmptyUnit(propertyId) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("unit")
        .insert([{}]).select().single();

    if (error?.code) {
        throw error;
    }
    
    redirect(`/hosting/properties/${propertyId}/units/add-a-unit/${data.id}/unit-details`);

}

