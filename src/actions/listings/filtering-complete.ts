"use server"

import { createClient } from '@/utils/supabase/server'
import { getSpecificAmenity } from './amenities'

const supabase = createClient()

// export const get_allProperties = async (
//     {lat, lng}: {lat?: number, lng?: number}, 
//     privacy_type: string[], 
//     amenity_name: string[], 
//     radius:number,
//     minPrice: number,
//     maxPrice: number,
//     beds: number,
//     rooms: number,
//     structure: string[],
//     distance: number | null,
//     stars: number | null,
//     score: number | null
// ) => {

//     const filteredAmenitys = async () => {
//         const { data, error } = await supabase
//             .from('unit_amenities')
//             .select('unit_id')
//             .in('amenity_id', (await getSpecificAmenity(amenity_name)));
//         return(data?.map(data => data.unit_id))
//     }
    
//     let query = supabase.rpc('get_all_properties');

//     if (lat && lng) {
//         query = supabase.rpc('get_nearby_properties', {lon: lng, lat: lat, rad: radius });
//     }
//     if(distance && lat && lng) {
//         query = supabase.rpc('get_nearby_properties', {lon: lng, lat: lat, rad: distance });
//     }
//     if (privacy_type && privacy_type.length > 0) {
//         query = query.overlaps('privacy_types', privacy_type);
//     }
//     let unit_id = await filteredAmenitys();
//     if (unit_id && unit_id.length > 0) {
//         query = query.overlaps('unit_ids', unit_id);
//     }
//     if (minPrice || maxPrice) {
//         if (minPrice && maxPrice) {
//             query = query.or(
//                 `minimum_price.gte.${minPrice},maximum_price.lte.${maxPrice}`
//             );
//         } else if (minPrice) {
//             query = query.gte('minimum_price', minPrice);
//         } else if (maxPrice) {
//             query = query.lte('maximum_price', maxPrice);
//         }
//     }
//     if (beds) {
//         query = query.gte('min_bed', beds);
//     }
//     if (rooms) {
//         query = query.gte('min_room', rooms);
//     }
//     if (structure && structure.length > 0) {
//         query = query.in('structure', structure);
//     }
//     if (stars) {
//         query = query.gte('average_ratings', stars);
//     }
//     if (score) {
//         query = query.gte('combined_review_score', score);
//     }

    
//     const { data, error } = await query;
//     if (error) throw error;
//     return data;
// }

export const get_allProperties = async (
    { lat, lng }: { lat?: number; lng?: number },
    privacy_type: string[],
    amenity_name: string[],
    radius: number,
    minPrice: number,
    maxPrice: number,
    beds: number,
    rooms: number,
    structure: string[],
    distance: number | null,
    stars: number | null,
    score: number | null
) => {
    // Strictly match units containing all amenities
    const getFilteredUnitIds = async () => {
        const amenityIds = await getSpecificAmenity(amenity_name); // Returns amenity IDs
        if (!amenityIds?.length) return []; // If no amenities provided, return empty

        const { data, error } = await supabase
            .from("unit_amenities")
            .select("unit_id, amenity_id");

        if (error) {
            console.error("Error fetching unit amenities:", error);
            return [];
        }

        // Group units by their amenities
        const unitsGroupedByAmenities = data.reduce((acc, item) => {
            if (!acc[item.unit_id]) acc[item.unit_id] = new Set();
            acc[item.unit_id].add(item.amenity_id);
            return acc;
        }, {});

        // Filter units containing all amenities
        return Object.entries(unitsGroupedByAmenities)
            .filter(([, amenities]) =>
                amenityIds.every((id) => amenities.has(id))
            )
            .map(([unitId]) => unitId);
    };

    let query = supabase.rpc("get_all_properties");

    // Combine distance filters
    if (lat && lng && (radius || distance)) {
        query = supabase.rpc("get_nearby_properties", {
            lon: lng,
            lat: lat,
            rad: distance || radius,
        });
    }

    // Filter by privacy types
    if (privacy_type?.length > 0) {
        query = query.overlaps("privacy_types", privacy_type);
    }

    // Filter by strict amenities
    const unitIds = await getFilteredUnitIds();
    if (unitIds.length > 0) {
        query = query.overlaps("unit_ids", unitIds);
    }

    // Price filters
    if (minPrice || maxPrice) {
        query = query.or([
            minPrice && `minimum_price.gte.${minPrice}`,
            maxPrice && `maximum_price.lte.${maxPrice}`,
        ].filter(Boolean).join(","));
    }

    // Beds and rooms
    if (beds) query = query.gte("min_bed", beds);
    if (rooms) query = query.gte("min_room", rooms);

    // Filter by structure
    if (structure?.length > 0) {
        query = query.in("structure", structure);
    }

    // Ratings and scores
    if (stars) query = query.gte("average_ratings", stars);
    if (score) query = query.gte("combined_review_score", score);

    // Execute the query
    const { data, error } = await query;
    if (error) {
        console.error("Error fetching properties:", error);
        throw error;
    }

    return data;
};
