"use server";

import { createClient } from "@/utils/supabase/server";

export async function countPropertyImageStorageBucket(userId: string, propertyId: string) {
    const supabase = createClient();
    try {
        const { data: unit_images, error: property_images_error } = await supabase.storage
            .from("unihomes image storage")
            .list(`unit/${userId}/${propertyId}/unit_image`);

        if (property_images_error) {
            console.error("Error listing files:", property_images_error.message);
            return;
        }

        return unit_images.length; //minus 1 cause it includes the folder .emptyFolderPlaceholder
    } catch (property_images_error) {
        console.error("Unexpected error:", property_images_error);
    }
}

export async function addUnitImages(fileUrls: any, unitIds: any) {
    const supabase = createClient();

    try {
        const updatePromises = unitIds.map(async (unitId) => {
            const { data, error } = await supabase.rpc("append_to_unit_images", {
                unit_id: unitId,
                new_images: fileUrls, // Same file URLs for all units
            });

            if (error) {
                console.error(`Error updating unit images for unit ID ${unitId}:`, error);
                throw new Error(error.message || `Failed to update images for unit ID ${unitId}`);
            }

            return data;
        });

        const results = await Promise.all(updatePromises);

        console.log("Unit images updated successfully:", results);

        return results; // Return the results for further inspection

    } catch (error: any) {
        console.log(error.message, "error");
        throw error.message;
    }
}

export async function addUnitPhotos(fileUrls: any, unitId: any) {
    const supabase = createClient();

    try {
        const { data, error } = await supabase.rpc("append_to_unit_images", {
            unit_id: unitId,
            new_images: fileUrls, // Same file URLs for all units
        });

        if (error?.code) {
            throw error;
        }

        return data;

    } catch (error: any) {
        console.log(error.message, "error");
        throw error.message;
    }
}

export async function countUnitImageStorageBucket(userId: string, propertyId: string, unitId: string) {
    const supabase = createClient();
    try {
        const { data: unit_images, error: unit_images_error } = await supabase.storage
            .from("unihomes image storage")
            .list(`property/${userId}/${propertyId}/unit/${unitId}/unit_image`);

        if (unit_images_error) {
            console.error("Error listing files:", unit_images_error.message);
            return;
        }

        return unit_images.length;
    } catch (property_images_error) {
        console.error("Unexpected error:", property_images_error);
    }
}

export async function removeImageFromUnit(propertyId: string, unitId: string, imageUrl: string, userId: string) {
    const supabase = createClient();

    try {
        const { data: dbData, error: dbError } = await supabase.rpc("remove_unit_image", {
            unit_id: unitId,
            image_to_remove: imageUrl,
        });

        if (dbError) {
            console.error("Error removing image from database:", dbError);
            return { error: dbError };
        }

        const { data: storageData, error: storageError } = await supabase.storage
            .from('unihomes image storage')
            .remove([`property/${userId}/${propertyId}/unit/${unitId}/unit_image/${imageUrl.split('/').pop()}`]);

        if (storageError) {
            console.error("Error removing image from storage bucket:", storageError);
            return { error: storageError };
        }

        return { data: { dbData, storageData } };

    } catch (error: any) {
        throw error;
    }
}