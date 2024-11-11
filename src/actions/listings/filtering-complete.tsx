"use server"

import { createClient } from '@/utils/supabase/server'
import { getSpecificAmenity } from './amenities'

const supabase = createClient()

export const get_allProperties = async (
    {lat, lng}: {lat?: number, lng?: number}, 
    privacy_type: string[], 
    amenity_name: string[], 
    radius:number,
    minPrice: number,
    maxPrice: number,
    beds: number,
    rooms: number,
    structure: string[]
) => {

    const filteredAmenitys = async () => {
        const { data, error } = await supabase
            .from('unit_amenities')
            .select('unit_id')
            .in('amenity_id', (await getSpecificAmenity(amenity_name)));
        return(data?.map(data => data.unit_id))
    }
    
    let query = supabase.rpc('get_all_properties');

    if (lat && lng) {
        query = supabase.rpc('get_nearby_properties', {lon: lng, lat: lat, rad: radius });
    }
    if (privacy_type && privacy_type.length > 0) {
        query = query.overlaps('privacy_types', privacy_type);
    }
    let unit_id = await filteredAmenitys();
    if (unit_id && unit_id.length > 0) {
        query = query.overlaps('unit_ids', unit_id);
    }
    if (minPrice && maxPrice) {
        query = query.gte('minimum_price', minPrice).lte('maximum_price', maxPrice);
    }
    if (beds) {
        query = query.gte('min_bed', beds);
    }
    if (rooms) {
        query = query.gte('min_room', rooms);
    }
    if (structure && structure.length > 0) {
        query = query.in('structure', structure);
    }


    
    const { data, error } = await query;
    if (error) throw error;
    return data;
}

