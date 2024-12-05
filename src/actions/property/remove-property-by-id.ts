"use server";

import { createClient } from "@/utils/supabase/server";
import { permanentRedirect } from "next/navigation";

export async function removePropertyById(id: string) {
    const supabase = createClient();

    try {
        const { error } = await supabase.from("property").delete().eq("id", id);

        if (error?.code) {
            throw error;
        }
    } catch (error: any) {
        throw error;
    }

    permanentRedirect("/hosting/properties");
}
