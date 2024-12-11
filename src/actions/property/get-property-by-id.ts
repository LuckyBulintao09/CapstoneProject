"use server";

import { createClient } from "@/utils/supabase/client";

export const getPropertyById = async (propertyId: string) => {
    const supabase = createClient();

    try {
        // const { data, error } = await supabase.rpc("get_property_by_id", { p_id: propertyId });
        const { data, error } = await supabase.from("property").select(`*`).eq("id", propertyId).single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error: any) {
        console.error("Error fetching property:", error);
        throw error;
    }
};

export const getPropertyTitle = async (propertyId: string) => {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.from("property").select(`title`).eq("id", propertyId).single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error: any) {
        console.error("Error fetching title:", error);
        throw error;
    }
};

export const getPropertyDescription = async (propertyId: string) => {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.from("property").select(`description`).eq("id", propertyId).single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error: any) {
        console.error("Error fetching description:", error);
        throw error;
    }
};

export const getPropertyLocation = async (propertyId: string) => {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.rpc("get_property_location", { p_id: propertyId });

        if (error) {
            throw error;
        }

        return data;
    } catch (error: any) {
        console.error("Error fetching location:", error);
        throw error;
    }
};

export const getPropertyAddress = async (propertyId: string) => {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.from("property").select(`address`).eq("id", propertyId).single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error: any) {
        console.error("Error fetching location:", error);
        throw error;
    }
};

export const getPropertyType = async (propertyId: string) => {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.from("property").select(`structure`).eq("id", propertyId).single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error: any) {
        console.error("Error fetching structure:", error);
        throw error;
    }
};

export const getPropertyHouseRules = async (propertyId: string) => {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.from("house_rules").select(`*`).eq("property_id", propertyId);

        if (error) {
            throw error;
        }
        return data;
    } catch (error: any) {
        console.error("Error fetching house rules:", error);
        throw error;
    }
};
export const getPropertyAmenities = async (propertyId: string) => {
    const supabase = createClient();
    try {
        
        const {data, error} = await supabase.from("property_amenities")
        .select(`
            amenity_id,
            property_id,
            amenity (id, amenity_name)
        `)
        .eq("property_id", propertyId);

        if (error?.code) {
            return error
        }

        const formattedData = data.map((item: any) => ({
            amenity_id: item.amenity_id,
            amenity_name: item.amenity?.amenity_name,
        }));

        console.log(formattedData)
        return formattedData;

    } catch (error: any) {

        return error

    }
};
