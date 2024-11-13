import { createClient } from "@/utils/supabase/client"
const supabase = createClient()

export const getAllPropertyUnderSpecificCompany = async (id: number) => {
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
    const { data, error } = await supabase
        .rpc('get_all_properties_under_company', {c_id: id})
    if (error) {
        console.error(error)
        return error
    }
    return data
}