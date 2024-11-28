"use server"

import { createClient } from "@/utils/supabase/server"

export const addPropertyBusinessPermit = async (url: string, propertyId: string) => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from("property")
            .update({ business_permit: url})
            .eq("id", propertyId)
            .select();

        if (error?.code) {
            return error;
        }

        console.log("Property business permit added", data);

        return data;
    } catch (error: any) {
        return error;
    }
};
