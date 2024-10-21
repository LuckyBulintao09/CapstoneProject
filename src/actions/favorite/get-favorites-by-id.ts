"use server"

import { createClient } from "@/utils/supabase/server"

export const getFavoritesById = async (id: string) => {
    const supabase = createClient()

    // authenticated?

    try {
        
        const {data, error} = await supabase.from('favorites').select(`
            Account_ID, account(firstname, lastname), Property_ID, property(property_code)
        `).eq('Account_ID', id)

        if (error?.code) {
            return error
        }

        console.log(data)

        return data

    } catch (error: any) {

        return error

    }
}
