"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

export async function createEmptyUnit() {
    const supabase = createClient();

        const { data, error } = await supabase
            .from("unit")
            .insert([{}]).select().single();
    
        if (error?.code) {
            throw error;
        }
        
        redirect(`/hosting/unit/add-a-unit/${data.id}/select-a-property`);
    
}