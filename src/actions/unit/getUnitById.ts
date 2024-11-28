"use server"

import { createClient } from "@/utils/supabase/server"

export async function getUnitById(unitId: string) {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from("unit")
            .select(`*`).eq("id", unitId);

        if (error) {
            throw error;
        }

        return data;
    } catch (error: any) {
        console.error("Error fetching unit:", error);
        throw error;
    }
}