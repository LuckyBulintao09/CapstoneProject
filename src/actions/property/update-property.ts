"use server"

import { CreatePropertyTypes } from "@/lib/schemas/propertySchema";
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

export async function updateProperty(propertyId: string, formValues: CreatePropertyTypes) {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.rpc('update_property', {
            p_id: propertyId,
            p_company_title: formValues.title,
            p_company_id: formValues.company_id,
            p_address: formValues.address,
            p_lat: formValues.location.lat,
            p_lng: formValues.location.lng,
        });
        if (error?.code) {
            throw error
        }
        // this is the updated data that is sent to supabase bro
        return data;
    } catch (error: any) {
        throw error
    }
    
}