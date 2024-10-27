"use server"

import { createClient } from "@/utils/supabase/server"

export const deleteCompanyBusinessPermit = async (companyId: string) => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from("company")
            .update({ business_permit: null, has_business_permit: "missing" })
            .eq("id", companyId)
            .select();

        if (error?.code) {
            return error;
        }

        console.log("Company added", data);

        return data;
    } catch (error: any) {
        return error;
    }
};
