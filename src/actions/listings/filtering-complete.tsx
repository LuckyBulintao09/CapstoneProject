"use server"

import { createClient } from '@/utils/supabase/server'
import { getSpecificAmenity } from './amenities'

const supabase = createClient()

export const get_allUnits = async ({lat, lng}: {lat?: number, lng?: number}, privacy_type: string[], amenity_name: string[], radius:number) => {

    const filteredAmenitys = async () => {
        const { data, error } = await supabase
            .from('unit_amenities')
            .select('unit_id')
            .in('amenity_id', (await getSpecificAmenity(amenity_name)));
        return(data?.map(data => data.unit_id))
    }
    
    let query = supabase.rpc('get_all_units');

    if (lat && lng) {
        query = supabase.rpc('get_all_units_nearby', {lon: lng, lat: lat, rad: radius });
    }
    if (privacy_type && privacy_type.length > 0) {
        query = query.in('privacy_type', privacy_type);
    }
    let unit_id = await filteredAmenitys();
    if (unit_id && unit_id.length > 0) {
        query = query.in('id', unit_id);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
}


