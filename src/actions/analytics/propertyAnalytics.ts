"use server"
import { createClient } from "@/utils/supabase/server";
const supabase = createClient();

export const addAnalytics = async (propertyId: any, companyId: any, title: any) => {
    try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) {
            console.error("Error fetching user:", userError);
            return { success: false, error: userError.message };
        }
        const userId = userData?.user?.id || "anonymous";

        if (userId !== "anonymous") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const { data: existingEntry, error: queryError } = await supabase
                .from("propertyAnalytics")
                .select("id")
                .eq("user_id", userId)
                .eq("property_id", propertyId)
                .gte("created_at", today.toISOString()); 

            if (queryError) {
                console.error("Error checking existing analytics entry:", queryError);
                return { success: false, error: queryError.message };
            }

    
            if (existingEntry && existingEntry.length > 0) {
                console.log("User already has an entry for today. Skipping insert.");
                return { success: true, message: "Entry already exists for today." };
            }
        }

        const { data, error: insertError } = await supabase
            .from("propertyAnalytics")
            .insert({
                company_id: companyId,
                property_id: propertyId,
                title: title,
                user_id: userId 
            });

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
