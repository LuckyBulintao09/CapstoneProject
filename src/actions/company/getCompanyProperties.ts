"use server"

import { createClient } from "@/utils/supabase/server"

export const getCompanyProperties = async (companyId: string) => {

    const supabase = createClient();

    try {

        const { data, error } = await supabase

            .from("property")

            .select('*').eq('company_id', companyId);

        if (error?.code) {

            return error;

        }

        return data;

    } catch (error: any) {

        return error;

    }
};
