"use server"

import { createClient } from "@/utils/supabase/server"

export const getAllAmenities = async () => {
    const supabase = createClient()

    // authenticated?

    try {
        
        const {data, error} = await supabase.from('amenity').select(`id, amenity_name`)

        if (error?.code) {
            return error
        }

        console.log(data)

        return data

    } catch (error: any) {

        return error

    }
}
