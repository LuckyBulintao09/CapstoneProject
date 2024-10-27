"use server"

import { createClient } from "@/utils/supabase/server"

export const getCompanyById = async (companyId: string) => {

    const supabase = createClient();

    try {
        const { data, error } = await supabase

            .from("company").select('*').eq('id', companyId).single();

        if (error?.code) {

            return error;

        }

        return data;

    } catch (error: any) {

        return error;

    }
};
