"use server";

import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

const getPropertyVSPropertyAnalytics = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) throw new Error(`Error fetching user: ${userError.message}`);
    if (!user?.id) throw new Error("Authenticated user not found");

    const userId = user.id;

    const { data: companyData, error: companyError } = await supabase
      .from("company")
      .select("id")
      .eq("owner_id", userId)
      .single();

    if (companyError) throw new Error(`Error fetching company: ${companyError.message}`);
    if (!companyData?.id) throw new Error("No company associated with this user");

    const companyId = companyData.id;

    const { data: analyticsData, error: analyticsError } = await supabase
      .from("propertyAnalytics")
      .select("property_id, title, created_at")
      .eq("company_id", companyId)
      .order("created_at", { ascending: true });

    if (analyticsError) throw new Error(`Error fetching property analytics: ${analyticsError.message}`);

    return analyticsData; 
  } catch (error) {
    console.error("Error in getPropertyVSPropertyAnalytics:", error.message);
    throw error;
  }
};

export default getPropertyVSPropertyAnalytics;
