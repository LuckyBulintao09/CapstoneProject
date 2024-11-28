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

export async function updatePropertyTitle(propertyId: string, title: string) {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.from("property").update({ title: title }).eq("id", propertyId);
        if (error?.code) {
            throw error
        }
        // this is the updated data that is sent to supabase bro
        return data;
    } catch (error: any) {
        throw error
    }
    
}

export async function updatePropertyDescription(propertyId: string, description: string) {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.from("property").update({ description: description }).eq("id", propertyId);
        if (error?.code) {
            throw error
        }
        // this is the updated data that is sent to supabase bro
        return data;
    } catch (error: any) {
        throw error
    }
    
}

export async function updatePropertyType(propertyId: string, property_type: string) {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.from("property").update({ structure: property_type }).eq("id", propertyId);
        if (error?.code) {
            throw error
        }
        // this is the updated data that is sent to supabase bro
        return data;
    } catch (error: any) {
        throw error
    }
    
}

export async function updatePropertyLocation(propertyId: string, address:string, location: any) {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.rpc("update_property_address_location", {
            p_id: propertyId,
            p_address: address,
            p_lat: location.lat,            
            p_lng: location.lng           
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