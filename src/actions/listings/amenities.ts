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
