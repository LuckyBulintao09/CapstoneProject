"use server";

import { createClient } from "@/utils/supabase/client"

export const getAllUnitsUnderCompany = async (companyId:Number) => {
    const supabase = createClient()
    try {
        const { data, error } = await supabase
            .from("unit")
            .select("*")
            .eq("company_id", companyId)
        if (error) {
            console.error(error)
            return error
        }
        return data
    } catch (error: any) {
        console.error(error)
        return error
    }
}
