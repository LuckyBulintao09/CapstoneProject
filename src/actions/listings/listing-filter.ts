"use server"
import { number } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { id } from 'date-fns/locale'
import { getSpecificAmenity } from './amenities'

const supabase = createClient()

//For specific listing to show the specific location (lon and lat)
//needs this to pass to advance marker
//not yet fixed
export const getSpecificLocation = async (unit_id : number) => {
    try {
        const { data, error } = await supabase
            .rpc('get_specific_location',{p_id: unit_id})

        if (error) {
            console.error(error)
            return error
        }
        return(data[0])
    } catch (error: any) {
        console.error(error)
        return error
    } 
}
