"use server"

import { createClient } from "@/utils/supabase/server"

export const deleteCompanyById = async (companyId: string) => {
    const supabase = createClient();

    try {
        const { error } = await supabase.from("company").delete().eq("id", companyId);

        if (error?.code) {
            throw error;
        }
    } catch (error: any) {
        throw error;
    }
};
