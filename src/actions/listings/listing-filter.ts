"use server"
import { number } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { id } from 'date-fns/locale'
import { getSpecificAmenity } from './amenities'

const supabase = createClient()



export const get_allListings = async () => {
    const { data, error } = await supabase
        .from('unit')
        .select('*');

    if (error) {
        console.error(error)
        return error
    }

    return data

}

//this returns company id that are within the 250 meters radius
//use the company id to fetch all listings from that property
//add radius
export const get_nearbyListings = async (latitude: number, longitude: number) => {
    try {
        const { data, error } = await supabase
            .rpc('get_nearby', {lat: latitude, lon: longitude})

        if (error) {
            console.error(error)
            return error
        }
        return(data?.map(data => data.id))

    } catch (error: any) {
        console.error(error)
        return error
    }
}

export const get_nearbyInfo = async (property_id: number[] | null) => {
    try {
        const { data : propertyInfo, error } = await supabase
            .rpc('get_nearbyinfo', {p_id: property_id})

        if (error) {
            console.error(error)
            return error
        }
        //add fetch unit for each property and display infowindow
        console.log(propertyInfo)
        return(propertyInfo)

    } catch (error: any) {
        console.error(error)
        return error
    }
}


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

export const getFilteredListings = async (property_id: number[]|null, amenity_name: string[], privacy_type: string[]) => {
    const filteredAmenitys = async () => {
        const { data, error } = await supabase
            .from('unit_amenities')
            .select('unit_id')
            .in('amenity_id', (await getSpecificAmenity(amenity_name)));
        return(data?.map(data => data.unit_id))
    }

    let query = supabase
        .from('unit')
        .select(`
            *
        `)
    

    if (property_id != null) {
        query = query.in('property_id', property_id);
    }
    if (privacy_type && privacy_type.length > 0) {
        query = query.in('privacy_type', privacy_type);
    }
    let unit_id = await filteredAmenitys();
    if (unit_id && unit_id.length > 0) {
        query = query.in('id', unit_id);
    }
    const { data, error } = await query;
    return(data)
}


