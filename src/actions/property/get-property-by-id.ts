"use server";

import { createClient } from "@/utils/supabase/client";

export const getPropertyById = async (propertyId: string) => {
    const supabase = createClient();

    try {
        // const { data, error } = await supabase.rpc("get_property_by_id", { p_id: propertyId });
        const { data, error } = await supabase
            .from("property")
            .select(`*`).eq("id", propertyId);

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
        const { data, error } = await supabase
            .from("property")
            .select(`title`).eq("id", propertyId).single();

        if (error) {
            throw error;
        }

        return data
    } catch (error: any) {
        console.error("Error fetching title:", error);
        throw error;
    }
}

export const getPropertyDescription = async (propertyId: string) => {
    const supabase = createClient();
    try {
        const { data, error } = await supabase
            .from("property")
            .select(`description`).eq("id", propertyId).single();

        if (error) {
            throw error;
        }

        return data
    } catch (error: any) {
        console.error("Error fetching description:", error);
        throw error;
    }
}
