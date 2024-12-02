import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export const addAnalytics = async (company_id: number) => {
    try {
        const { data, error: insertError } = await supabase
            .from("companyAnalytics")
            .insert({ company_id });

        if (insertError) {
            console.error("Error adding analytics:", insertError);
            return { success: false, error: insertError.message };
        }

        console.log("Analytics added successfully:", data);

        return { success: true, data };

    } catch (error) {
        console.error("Unexpected error:", error);
        return { success: false, error: error.message };
    }
};
