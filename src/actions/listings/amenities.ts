'use server'

import { createClient } from '@/utils/supabase/server'

const supabase = createClient()

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

        return householdAmenities;
    } catch (error: any) {
        console.error(error);
        return error;
    }
}

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