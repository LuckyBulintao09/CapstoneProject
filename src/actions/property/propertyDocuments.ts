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

export const addPropertyBusinessPermit = async (url: string, propertyId: string, userId: any) => {
    const supabase = createClient();

    try {
        const { data: list, error: listError } = await supabase.storage.from("unihomes image storage").list(`property/${userId}/${propertyId}/business_permit`);

        if (listError) {
            console.error("Error listing files:", listError.message);
            throw { error: listError };
        }

        const filesToRemove = list.map((x) => `property/${userId}/${propertyId}/business_permit/${x.name}`);

        const { data: bpData ,error: bpRemoveError } = await supabase.storage.from("unihomes image storage").remove(filesToRemove);
        
        if (bpRemoveError) {
            console.error("Error removing files:", bpRemoveError.message);
            throw { error: bpRemoveError };
        }

        const { data: dbData, error: businessPermitColError } = await supabase
            .from("property")
            .update({ business_permit: url})
            .eq("id", propertyId)
            .select();

        if (businessPermitColError?.code) {
            return businessPermitColError;
        }

        return { data: { dbData, bpData } };
    } catch (error: any) {
        return error;
    }
};

export const removeBusinessPermit = async (propertyId: string, imageUrl: string, userId: string) => {
    const supabase = createClient();

    try {
        const { data: list, error: listError } = await supabase.storage.from("unihomes image storage").list(`property/${userId}/${propertyId}/business_permit`);

        if (listError) {
            console.error("Error listing files:", listError.message);
            throw { error: listError };
        }

        const filesToRemove = list.map((x) => `property/${userId}/${propertyId}/business_permit/${x.name}`);

        const { data: bpData ,error: bpRemoveError } = await supabase.storage.from("unihomes image storage").remove(filesToRemove);
        
        if (bpRemoveError) {
            console.error("Error removing files:", bpRemoveError.message);
            throw { error: bpRemoveError };
        }
        const { data: dbData, error: dbError } = await supabase.from("property").update({ business_permit: null }).eq("id", propertyId).select();

        if (dbError) {
            console.error("Error removing image from database:", dbError);
            return { error: dbError };
        }

        return { data: { dbData, bpData } };

    } catch (error: any) {
        throw error;
    }
}

// fire inspection
export const getFireInspection = async (propertyId: string) => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase.from("property").select("fire_inspection").eq("id", propertyId).single();

        if (error?.code) {
            return error;
        }
        // console.log(data, "fire inspection")
        return data;
    } catch (error: any) {
        return error;
    }
}

export const addPropertyFireInspection = async (url: string, propertyId: string, userId: any) => {
    const supabase = createClient();

    try {

        const fireInspectionUrl = await getFireInspection(propertyId);

       if (fireInspectionUrl?.fire_inspection) {
           const fileName = fireInspectionUrl?.fire_inspection.split("/").pop();
           const { data: fiData, error: fiRemoveError } = await supabase.storage
               .from("unihomes image storage")
               .remove([`property/${userId}/${propertyId}/fire_inspection/${fileName}`]);
           console.log("success", fiData);

           if (fiRemoveError) {
               console.error("Error removing files:", fiRemoveError.message);
               throw { error: fiRemoveError };
           }
       }

        const { data: dbData, error: dbError } = await supabase
                .from("property")
                .update({ fire_inspection: url })
                .eq("id", propertyId)
                .select();


        if (dbError?.code) {
            return dbError;
        }

        return { data: { dbData } };
    } catch (error: any) {
        return error;
    }
};

export const removeFireInspection = async (propertyId: string, imageUrl: string, userId: string) => {
    const supabase = createClient();

    try {
        const fileName = imageUrl.split("/").pop();
        const { data: fiData, error: fiRemoveError } = await supabase.storage
            .from("unihomes image storage")
            .remove([`property/${userId}/${propertyId}/fire_inspection/${fileName}`]);
        console.log("success", fiData);

        if (fiRemoveError) {
            console.error("Error removing files:", fiRemoveError.message);
            throw { error: fiRemoveError };
        }

        const { data: dbData, error: dbError } = await supabase
            .from("property")
            .update({ fire_inspection: null })
            .eq("id", propertyId)
            .select();

        if (dbError?.code) {
            return dbError;
        }

        return { data: { dbData } };

    } catch (error: any) {
        throw error;
    }
}
