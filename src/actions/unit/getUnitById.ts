"use server"

import { createClient } from "@/utils/supabase/server"

export async function getUnitById(unitId: string) {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from("unit")
            .select(`*`).eq("id", unitId).single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error: any) {
        console.error("Error fetching unit:", error);
        throw error;
    }
}


export const getUnitTitle = async (unitId: string) => {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.from("unit").select(`title`).eq("id", unitId).single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error: any) {
        console.error("Error fetching title:", error);
        throw error;
    }
};

export const getUnitTypeDetails = async (unitId: string) => {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.from("unit").select(`privacy_type, room_size`).eq("id", unitId).single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error: any) {
        console.error("Error fetching addtional unit details:", error);
        throw error;
    }
};

export const getUnitSpecifications = async (unitId: string) => {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.from("unit").select(`occupants, bedrooms, beds`).eq("id", unitId).single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error: any) {
        console.error("Error fetching addtional unit details:", error);
        throw error;
    }
};

export const getUnitPrice = async (unitId: string) => {
    const supabase = createClient();
    try {
        const { data, error } = await supabase.from("unit").select(`price`).eq("id", unitId).single();

        if (error) {
            throw error;
        }

        return data;
    } catch (error: any) {
        console.error("Error fetching unit price:", error);
        throw error;
    }
};