"use server"

import { createClient } from "@/utils/supabase/server"

export const getAllCompanies = async () => {
    const supabase = createClient()

    // authenticated?

    try {
        
        const {data, error} = await supabase.from('ameneties').select(`id, amenety_name`)

        if (error?.code) {
            return error
        }

        console.log(data)

        return data

    } catch (error: any) {

        return error

    }
}
