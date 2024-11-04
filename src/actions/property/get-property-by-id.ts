"use server";

import { createClient } from "@/utils/supabase/server";

export const getPropertyById = async (propertyId: string) => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase.rpc("get_property_by_id", { p_id: propertyId });

        if (error) {
            throw error;
        }

        return data;
    } catch (error: any) {
        console.error("Error fetching property:", error);
        throw error;
    }
};
