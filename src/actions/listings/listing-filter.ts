"use server"
import { createClient } from '../../../utils/supabase/server'

const supabase = createClient()

//NOTE: it still uses console log, need to change to return data



//For specific listing to show the specific location (lon and lat)
//needs this to pass to advance marker
export const getSpecificLocation = async (property_id : number) => {
    try {
        const { data, error } = await supabase
            .rpc('get_specific_location',{property_id: property_id})

        if (error) {
            console.error(error)
            return error
        }
    
        console.log(data)
    } catch (error: any) {
        console.error(error)
        return error
    }
}

//this returns company id that are within the 500 meters radius
//use the company id to fetch all listings from that company
export const get_nearbyListings = async (latitude: number, longitude: number) => {

    try {
        const { data, error } = await supabase
            .rpc('get_nearby_listings', {latitude: latitude, longitude: longitude})

        if (error) {
            console.error(error)
            return error
        }

        console.log(data)
    } catch (error: any) {
        console.error(error)
        return error
    }
}
