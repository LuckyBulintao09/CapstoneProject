"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function removePropertyById(id: string) {
    const supabase = createClient();

    const { error } = await supabase.from("property").delete().eq("id", id);

    if (error?.code) {
        console.error("Error inserting data:", error);
    }

    redirect("/hosting/host-a-property");
}
