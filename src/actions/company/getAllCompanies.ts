"use server"

import { createClient } from "@/utils/supabase/server"

export const getAllCompanies = async () => {
    const supabase = createClient()

    // authenticated?

    try {
        
        const {data, error} = await supabase.from('company').select(`id, company_name`)

        if (error?.code) {
            return error
        }

        console.log(data)

        return data

    } catch (error: any) {

        return error

    }
}
