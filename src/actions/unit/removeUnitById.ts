"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function removeUnitById(id: string, propertyId: string) {
    const supabase = createClient();

    try {
        const { error } = await supabase.from("unit").delete().eq("id", id);

        if (error?.code) {
            throw error;
        }
    } catch (error: any) {
        throw error
    }

    redirect(`/hosting/properties/${propertyId}/details/units`);
}
