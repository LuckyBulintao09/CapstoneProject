"use server";
import { createClient } from "@/utils/supabase/server";

export const fetchDropdownDetails = async (userId: string) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("company")
        .select(`
            property (
                id,
                title,
                unit (
                    id,
                    title,
                    isReserved
                )
            )
        `)
        .eq("owner_id", userId);

    if (error) {
        throw error;
    }
    console.log(data)
    return data
};

export const fetchEditDetails = async (id: number) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("transaction")
        .select(`
            *,
            unit (
                id,
                title,
                isReserved,
                property (
                    id,
                    title
                )
            ),
            account (
                firstname,
                lastname
            )
            `)
        .eq("id", id)
        .single();

    if (error) {
        throw error;
    }

    return data
};
