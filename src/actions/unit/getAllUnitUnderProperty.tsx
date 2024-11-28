import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export const getAllUnitUnderProperty = async (propertyId: string) => {
    const propertyIdNumber = Number(propertyId);
    const { data, error } = await supabase
        .from("unit")
        .select()
        .eq("property_id", propertyIdNumber);

    if (error) throw error;
    return data;
};