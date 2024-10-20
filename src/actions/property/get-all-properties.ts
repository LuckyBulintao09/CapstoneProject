"use server"

import { createClient } from "@/utils/supabase/client"

export const getAllProperties = async () => {
    const supabase = createClient()

    // authenticated?

    try {
        
        const {data, error} = await supabase.from('property').select(`
            *,
            company (*),
            property_amenities (*),
            property_house_rules (*),
            property_images (*)
        `)

        if (error?.code) {
            return error
        }

        console.log(data)

        return data

    } catch (error: any) {

        return error

    }
}
