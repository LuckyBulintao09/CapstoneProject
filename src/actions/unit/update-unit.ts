"use server";

import { createClient } from "@/utils/supabase/server"
import { permanentRedirect, redirect } from "next/navigation";
import { addUnitImages } from "./unitImage";

export async function updateUnit(unitId: string, propertyId: string, values: any, fileUrls: any) {
    const supabase = createClient();

    const { data: unitData, error:unitError } = await supabase
        .from("unit")
        .update({
            property_id: propertyId,
            title: values.title,
            price: values.price,
            privacy_type: values.privacy_type,
            bedrooms: values.bedrooms,
            beds: values.beds,
            occupants: values.occupants,
            room_size: values.room_size,
        })
        .eq("id", unitId)
        .select();
    
        if (unitError?.code) {
            throw unitError;
        }

        await insertAmenities(values.amenities, unitId);
        await addUnitImages(fileUrls, unitId);
        console.log(fileUrls, "fileUrls in update unit action");
        redirect(`/hosting/properties/${propertyId}/details/units`);
    
}

export async function createDuplicateUnit(propertyId: string, values: any, fileUrls: any,  numberOfUnits: number) {
    const supabase = createClient();

    if (typeof numberOfUnits !== 'number' || isNaN(numberOfUnits)) {
        throw new Error('numberOfUnits must be a valid number.');
    }

    if (numberOfUnits < 1 || numberOfUnits > 10) {
        throw new Error('numberOfUnits must be between 1 and 10 inclusive.');
    }

    if (/[^0-9]/.test(String(numberOfUnits))) {
        throw new Error('numberOfUnits cannot contain special characters.');
    }

    const unitsToInsert = Array(numberOfUnits).fill({
        property_id: propertyId,
        price: values.price,
        title: values.title,
        privacy_type: values.privacy_type,
        bedrooms: values.bedrooms,
        beds: values.beds,
        occupants: values.occupants,
        outside_view: values.outside_view,
        room_size: values.room_size,
    });

    try {
        const {data, error} = await supabase
            .from("unit")
            .insert(unitsToInsert).select();
        if (error?.code) {
            throw error;
        }

        for (const unit of data) {
            const updatedTitle = `${values.title}-${unit.id}`;

            // Update the unit title with the unit ID
            await supabase
                .from("unit")
                .update({ title: updatedTitle })
                .eq("id", unit.id);

            // Insert amenities and images
            await insertAmenities(values.amenities, unit.id);
            await addUnitImages(fileUrls, unit.id);
        }

        permanentRedirect(`/hosting/properties/${propertyId}/details/units`);  
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}

const insertAmenities = async (data: {value: string, label: string}[], unitId: string) => {
    const supabase = createClient();

    const amenities_insert = data.map(({value}: {value: string}) => ({
        unit_id: unitId,
        amenity_id: value
    }))

    const { data: unitAmenitiesData, error:unitAmenitiesError } = await supabase
        .from("unit_amenities")
        .insert(amenities_insert)
        .select();

    if (unitAmenitiesError?.code) {
        throw unitAmenitiesData;
    }
}

export const toggleIsReserved = async (unitId: string, isReserved: boolean) => {
    const supabase = createClient();

    const { data, error } = await supabase.from("unit").update({ isReserved: isReserved }).eq("id", unitId).select();

    if (error?.code) {
        throw error;
    }

    return data;
}