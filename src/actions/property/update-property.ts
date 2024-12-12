"use server"

import { CreatePropertyTypes } from "@/lib/schemas/propertySchema";
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";
import { addPropertyImages } from "./propertyImage";
import { addPropertyBusinessPermit, addPropertyFireInspection } from "./propertyDocuments";

export async function updateProperty(propertyId: string, formValues: CreatePropertyTypes, uploadedFiles: any, companyId: any, userId: any) {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.rpc('update_property_details', {
            p_id: propertyId,
            p_address: formValues.address,
            p_lat: formValues.location.lat,
            p_lng: formValues.location.lng,
            p_description: formValues.description,
            p_title: formValues.title,
            p_structure: formValues.property_type,
            p_company_id: companyId,
        });
        if (error?.code) {
            throw error
        }

        await addPropertyImages(uploadedFiles, propertyId);
        await updatePropertyHouseRules(formValues.house_rules, propertyId);

        return data;
    } catch (error: any) {
        throw error
    }
    
}

export async function updatePropertyHouseRules(houseRules: any, propertyId: string) {
    const supabase = createClient();
    try {
        await supabase.from("house_rules").delete().eq("property_id", propertyId);

        const house_rules_insert = houseRules.map(({ text }: { text: string }) => ({
            property_id: propertyId,
            rule: text,
        }));

        const { error: houseRulesError } = await supabase.from("house_rules").insert(house_rules_insert);

        if (houseRulesError?.code) {
            throw houseRulesError;
        }

        return { success: true };
    } catch (error: any) {
        throw error;
    }
}

export async function updatePropertyAmenities(property_amenities: any, propertyId: string ) {
    console.log(property_amenities)

    const supabase = createClient();
    try {
        await supabase.from("property_amenities").delete().eq("property_id", propertyId);

        const newAmenities = property_amenities.map(({ value }: { value: any }) => ({
            property_id: propertyId,
            amenity_id: value,
        }));

        const { error: amenityError  } = await supabase.from("property_amenities").insert(newAmenities);

        if (amenityError?.code) {
            throw amenityError
        }

        return { success: true };
    } catch (error: any) {
        throw error;
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

export async function updatePropertyType(propertyId: string, values: any) {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.from("property").update({ structure: values.property_type }).eq("id", propertyId);

        if (error?.code) {
            throw error
        }
        console.log(values.property_amenities, "test")
        await updatePropertyHouseRules(values.house_rules, propertyId);
        await updatePropertyAmenities(values.property_amenities, propertyId);

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


export async function propertyReapplication (propertyId: string) {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.from("property").update({ isApproved: "pending" }).eq("id", propertyId).select();
        
        if (error?.code) {
            throw error
        }

        return data;
    } catch (error: any) {
        throw error
    }
    
}