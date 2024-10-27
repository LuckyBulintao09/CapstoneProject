"use server"

import { createClient } from "@/utils/supabase/server"

export const addCompanyBusinessPermit = async (url: string, userId : string, companyId: string) => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from("company")
            .update({ business_permit: url, has_business_permit: "pending" })
            .eq("id", companyId)
            .eq("owner_id", userId)
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
