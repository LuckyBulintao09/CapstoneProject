"use server";

// gets all units under a property under a company
// ex. get units a,b, and c from property 1 under company 1

import { createClient } from "@/utils/supabase/client";


export async function getUnitsUnderCompanyProperty(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_units_with_details', { user_id: userId });
    if (error) throw error; 
    return data;
};