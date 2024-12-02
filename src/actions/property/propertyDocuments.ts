"use server"

import { createClient } from "@/utils/supabase/server"

export const getBusinessPermit = async (propertyId: string) => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase.from("property").select("business_permit").eq("id", propertyId).single();

        if (error?.code) {
            return error;
        }

        return data;
    } catch (error: any) {
        return error;
    }
}

export const addPropertyBusinessPermit = async (url: string, propertyId: string) => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from("property")
            .update({ business_permit: url})
            .eq("id", propertyId)
            .select();

        if (error?.code) {
            return error;
        }

        return data;
    } catch (error: any) {
        return error;
    }
};

export const removeBusinessPermit = async (propertyId: string, imageUrl: string, userId: string) => {
    const supabase = createClient();

    try {
        const { data: dbData, error: dbError } = await supabase.from("property").update({ business_permit: null }).eq("id", propertyId).select();

        if (dbError) {
            console.error("Error removing image from database:", dbError);
            return { error: dbError };
        }

        const { data: storageData, error: storageError } = await supabase.storage
            .from('unihomes image storage')
            .remove([`property/${userId}/${propertyId}/business_permit/${imageUrl.split('/').pop()}`]);

        if (storageError) {
            console.error("Error removing image from storage bucket:", storageError);
            return { error: storageError };
        }

        return { data: { dbData, storageData } };

    } catch (error: any) {
        throw error;
    }
}

export const downloadBusinessPermit = async (userId: string, propertyId: string, imageUrl: string) => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase.storage.from('unihomes image storage').download(`property/${userId}/${propertyId}/business-permit/${imageUrl.split('/').pop()}`);

        if (error) {
            throw error;
        }
        
        console.log(data)
    } catch (error: any) {
        throw error;
    }
}

export const getFireInspection = async (propertyId: string) => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase.from("property").select("fire_inspection").eq("id", propertyId).single();

        if (error?.code) {
            return error;
        }

        return data;
    } catch (error: any) {
        return error;
    }
}

export const addPropertyFireInspection = async (url: string, propertyId: string) => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from("property")
            .update({ fire_inspection: url})
            .eq("id", propertyId)
            .select();

        if (error?.code) {
            return error;
        }

        return data;
    } catch (error: any) {
        return error;
    }
};

export const removeFireInspection = async (propertyId: string, imageUrl: string, userId: string) => {
    const supabase = createClient();

    try {
        const { data: dbData, error: dbError } = await supabase.from("property").update({ fire_inspection: null }).eq("id", propertyId).select();

        if (dbError) {
            console.error("Error removing image from database:", dbError);
            return { error: dbError };
        }

        const { data: storageData, error: storageError } = await supabase.storage
            .from('unihomes image storage')
            .remove([`property/${userId}/${propertyId}/fire_inspection/${imageUrl.split('/').pop()}`]);

        if (storageError) {
            console.error("Error removing image from storage bucket:", storageError);
            return { error: storageError };
        }

        return { data: { dbData, storageData } };

    } catch (error: any) {
        throw error;
    }
}

export const downloadFireInspection = async (userId: string, propertyId: string, imageUrl: string) => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase.storage.from('unihomes image storage').download(`property/${userId}/${propertyId}/fire_inspection/${imageUrl.split('/').pop()}`);

        if (error) {
            return error;
        }

        return data;
    } catch (error: any) {
        return error;
    }
}