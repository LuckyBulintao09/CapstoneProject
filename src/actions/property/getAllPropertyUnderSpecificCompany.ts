"use server";
import { createClient } from "@/utils/supabase/client"

export const getAllPropertyUnderSpecificCompany = async (id: number) => {
    const supabase = createClient()
    let { data, error } = await supabase
        .from('property')
        .select('id, title,address')
        .eq('company_id', id)
    if (error) {
        console.error(error)
        return error
    }
    return data
    }

export const getAllPropertyUnderSpecificCompanyRPC = async (id: number) => {
    const supabase = createClient()
    const { data, error } = await supabase
        .rpc('get_all_properties_under_company', {c_id: id})
    if (error) {
        console.error(error)
        return error
    }
    return data
}