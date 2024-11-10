'use server'


import { createClient } from '@/utils/supabase/server'

const supabase = createClient()

//Used for the Listing Filter
export const getAllAmenities = async () => {
    try {
        const { data, error } = await supabase
            .from('amenity')
            .select('id, amenity_name');

        if (error) {
            console.error(error);
            return error;
        }

        const householdAmenities = data.map((amenity: { id: number; amenity_name: string }) => ({
            id: amenity.id,
            value: amenity.amenity_name,
            label: amenity.amenity_name,
        }));

        // console.log(householdAmenities);
        return householdAmenities;
    } catch (error: any) {
        console.error(error);
        return error;
    }
}

//Used for the Listing Filter
export const getSpecificAmenity = async (amenity_name: string[]) => {
    try {
        const { data, error } = await supabase
            .from('amenity')
            .select('id')
            .in('amenity_name', amenity_name)

        if (error) {
            console.error(error);
            return error;
        }

        return (data?.map(data => data.id))
    } catch (error: any) {
        console.error(error);
        return error;
    }
}

//Used for the fetching amenities on specific listing
export const get_unitAmenities = async (unit_id: number) => {
    try {
        const { data: unitAmenities, error: unitAmenitiesError } = await supabase
            .from('unit_amenities')
            .select('amenity_id')
            .eq('unit_id', unit_id) 

        if (unitAmenitiesError) {
            console.error(unitAmenitiesError);
            return unitAmenitiesError;
        }

        const {data: Amenities, error: AmenitiesError} = await supabase
            .from('amenity')
            .select('id,amenity_name')
            .in('id', unitAmenities.map(unitAmenity => unitAmenity.amenity_id))
        
            if (AmenitiesError) {
                console.error(AmenitiesError);
                return AmenitiesError;
            }
            return(Amenities)

    }catch (error: any) {
        console.error(error);
        return error;
    }
}