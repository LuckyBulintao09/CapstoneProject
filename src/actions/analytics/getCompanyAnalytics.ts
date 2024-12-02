"use server";
import { createClient } from "@/utils/supabase/server";
const supabase = createClient();

export const getAnalytics = async () => {
  try {

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(`Error fetching user data: ${userError.message}`);
    
    const userId = userData?.user?.id;
    if (!userId) throw new Error("User ID not found");

    console.log("User ID:", userId);

 
    const { data: companyData, error: companyError } = await supabase
      .from("company")
      .select("id")
      .eq("owner_id", userId)
      .single();

    if (companyError) {
      if (companyError.code === "PGRST116" || companyError.message.includes("No rows found")) {
        console.log("No company found for the user.");
        return 0;  
      }
      throw new Error(`Error fetching the company: ${companyError.message}`);
    }

    console.log("User's company ID:", companyData.id);

    const { count: analyticsCount, error: analyticsError } = await supabase
      .from("companyAnalytics")
      .select("*", { count: "exact", head: true }) 
      .eq("company_id", companyData.id);

    if (analyticsError) throw new Error(`Error fetching analytics count: ${analyticsError.message}`);

    console.log("Analytics count:", analyticsCount);
    return analyticsCount || 0;
  } catch (error) {
    console.error(error.message);
    return 0;  
  }
};
