import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export const getAnalytics = async (company_id: number) => {
    try {
        const { count, error } = await supabase
            .from("companyAnalytics")
            .select("id", { count: "exact", head: true }) 
            .eq("company_id", company_id);  

        if (error) {
            console.error("Error fetching analytics count:", error);
            return { success: false, error: error.message };
        }

        console.log("Analytics count fetched:", count);

        return { success: true, count };
    } catch (error) {
        console.error("Unexpected error:", error);
        return { success: false, error: error.message };
    }
};
