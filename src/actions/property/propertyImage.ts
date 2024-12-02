"use server";

import { createClient } from "@/utils/supabase/server";

export async function countPropertyImageStorageBucket(userId: string, propertyId: string) {
    const supabase = createClient();
    try {
        const { data: property_images, error: property_images_error } = await supabase.storage
            .from("unihomes image storage")
            .list(`property/${userId}/${propertyId}/property_image`);

        if (property_images_error) {
            console.error("Error listing files:", property_images_error.message);
            return;
        }

        return property_images.length - 1; //minus 1 cause it includes the folder .emptyFolderPlaceholder
    } catch (property_images_error) {
        console.error("Unexpected error:", property_images_error);
    }
}

export async function addPropertyImages(fileUrls: string[], propertyId: string) {
    const supabase = createClient();

    try {
        const { data, error } = await supabase.rpc("append_to_property_images", {
            property_id: propertyId,
            new_images: fileUrls,
        });

        if (error?.code) {
            return error;
        }

        console.log("Property images added", data);

        return data;
    } catch (error: any) {
        console.log(error);
        return error;
    }
}

export async function removeImageFromProperty(propertyId: string, imageUrl: string, userId: string) {
    const supabase = createClient();

    try {
        const { data: dbData, error: dbError } = await supabase.rpc("remove_property_image", {
            property_id: propertyId,
            image_to_remove: imageUrl,
        });

        if (dbError) {
            console.error("Error removing image from database:", dbError);
            return { error: dbError };
        }

        const { data: storageData, error: storageError } = await supabase.storage
            .from('unihomes image storage')
            .remove([`property/${userId}/${propertyId}/property_image/${imageUrl.split('/').pop()}`]);

        if (storageError) {
            console.error("Error removing image from storage bucket:", storageError);
            return { error: storageError };
        }

        return { data: { dbData, storageData } };

    } catch (error: any) {
        throw error;
    }
}