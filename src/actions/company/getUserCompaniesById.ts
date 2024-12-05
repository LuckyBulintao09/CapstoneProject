"use server"

import { createClient } from "@/utils/supabase/server"

export const getUserCompaniesById = async (userId : string) => {

    const supabase = createClient();

    try {
        const { data, error } = await supabase

            .from("company").select('*').eq('owner_id', userId);

        if (error?.code) {

            return error;

        }

        return data;

    } catch (error: any) {

        return error;

    }
};


export const getUserCompanyId = async (userId : string) => {

    const supabase = createClient();

    try {
        const { data, error } = await supabase

            .from("company").select('id').eq('owner_id', userId).single();

        if (error?.code) {

            return error;

        }

        return data;

    } catch (error: any) {

        return error;

    }
};