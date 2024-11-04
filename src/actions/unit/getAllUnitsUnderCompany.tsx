import { createClient } from "@/utils/supabase/client"
const supabase = createClient()

export const getAllUnitsUnderCompany = async (companyId:Number) => {
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
