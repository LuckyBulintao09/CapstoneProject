"use server"

import { createClient } from "@/utils/supabase/server"

export const addPropertyImages = async (fileUrls: string[], propertyId: string) => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from("property")
            .update({ property_image: fileUrls})
            .eq("id", propertyId)
            .select();

        if (error?.code) {
            return error;
        }

        console.log("Property images added", data);

        return data;
    } catch (error: any) {
        return error;
    }
};
