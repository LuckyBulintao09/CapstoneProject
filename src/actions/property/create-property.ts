"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

export async function createProperty() {
    const supabase = createClient();

        const { data, error } = await supabase
            .from("property")
            .insert([{}]).select().single();
    
        if (error?.code) {
            console.error("Error inserting data:", error);
        }
        
        redirect(`/hosting/property/host-a-property/${data.id}/details`);
    
}