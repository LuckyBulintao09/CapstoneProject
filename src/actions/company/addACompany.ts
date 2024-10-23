"use server"

import { CompanySchemaTypes } from "@/lib/schemas/createCompanySchema"
import { createClient } from "@/utils/supabase/server"
import { UUID } from "crypto";

export const addACompany = async (formData: CompanySchemaTypes, userId : UUID) => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from("company")
            .insert({ ...formData, owner_id: userId })
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
