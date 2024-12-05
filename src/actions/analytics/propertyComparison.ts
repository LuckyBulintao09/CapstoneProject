"use server";

import { createClient } from "@/utils/supabase/server";
import { subDays } from "date-fns";  

const supabase = createClient();

const mapTimePeriodToDays = (period) => {
  switch (period) {
    case "Last 24 hours":
      return 1;
    case "Last 7 days":
      return 7;
    case "Last 4 weeks":
      return 28;
    case "All Time":
    default:
      return 0; 
  }
};

export default async function getPropertyComparison(dateRange: any) {
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

    const days = mapTimePeriodToDays(dateRange);
    let startDate = null;

    if (days > 0) {
      startDate = subDays(Date.now(), days); 
    }

    console.log("Start date for property comparison query:", startDate ? new Date(startDate).toISOString() : "All Time (no filtering)");

    let query = supabase
      .from("transactionAnalytics")
      .select("property_title, created_at") 
      .eq("company_id", companyId)
      .order("created_at", { ascending: true });

    if (startDate) {
      const startDateISOString = new Date(startDate).toISOString();
      console.log("Applying date filter with startDate:", startDateISOString);

    
      query = query.gte("created_at", startDateISOString);  
    }


    const { data: propertyData, error: propertyError } = await query;

    if (propertyError) throw new Error(`Error fetching property data: ${propertyError.message}`);


    if (!propertyData || propertyData.length === 0) {
      console.log("No data found for the given date range.");

      const { data: allData, error: allDataError } = await supabase
        .from("transactionAnalytics")
        .select("*")
        .eq("company_id", companyId);

      console.log("Data without date filter:", allData); 
    }

    const resultArray = propertyData.map((entry) => ({
      propertyTitle: entry.property_title,  
      date: entry.created_at,  
    }));

    return resultArray;

  } catch (error) {
    console.error("Error in getPropertyComparison:", error.message);
    return { success: false, message: error.message, result: [] };
  }
}
