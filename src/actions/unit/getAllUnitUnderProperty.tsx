"use server"

import { createClient } from "@/utils/supabase/client";

export const getAllUnitUnderProperty = async (propertyId: string, offset: number, limit:number) => {
    const supabase = createClient();
    const propertyIdNumber = Number(propertyId);
    try {
        const { data, error } = await supabase
        .from("unit")
        .select("*")
        .eq("property_id", propertyIdNumber)
        .range(offset, limit)
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
    } catch (error: any) {
        throw error;
    }

};

export const getAllUnitsUnderProperty2 = async (propertyId: string) => {
    const supabase = createClient();
    const propertyIdNumber = Number(propertyId);
    try {
        const { data, error } = await supabase
        .from("unit")
        .select("*")
        .eq("property_id", propertyIdNumber)
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
    } catch (error: any) {
        throw error;
    }

};

export const getUnitsCount = async (propertyId: string) => {
    const supabase = createClient();
    const propertyIdNumber = Number(propertyId);
    try {
        const { count, error } = await supabase
            .from("unit")
            .select("*", { count: "exact" })
            .eq("property_id", propertyIdNumber);

        if (error) throw error;

        return count;
    } catch (error: any) {
        throw error;
    }

};