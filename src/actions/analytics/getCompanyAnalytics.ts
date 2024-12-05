"use server";

import { createClient } from "@/utils/supabase/server";
import { subDays } from "date-fns";

const supabase = createClient();

const mapTimePeriodToDays = (period) => {
  console.log(`Mapping period: ${period}`);
  switch (period) {
    case 'Last 24 hours':
      return 1; 
    case 'Last 7 days':
      return 7; 
    case 'Last 4 weeks':
      return 28; 
    case 'All Time':
    default:
      return 0;
  }
};

export const getCompanyAnalytics = async (period: string) => {
  try {
    console.log("Fetching company analytics for period:", period);
    
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(`Error fetching user data: ${userError.message}`);
    console.log("User data fetched:", userData);

    const userId = userData?.user?.id;
    if (!userId) throw new Error("User ID not found");

    const { data: companyData, error: companyError } = await supabase
      .from("company")
      .select("id")
      .eq("owner_id", userId)
      .single();

    if (companyError) throw new Error(`Error fetching the company: ${companyError.message}`);

    const days = mapTimePeriodToDays(period);
    
    let startDate = new Date(); 

    if (days > 0) {
      startDate = subDays(new Date(), days);
    } else if (days === 0) {
      startDate = null;
    }

    console.log("Start date for analytics query:", startDate);

    let query = supabase
      .from("companyAnalytics")
      .select("created_at")
      .eq("company_id", companyData.id) 
      .order("created_at", { ascending: true });

    if (startDate) {
      query = query.gte("created_at", startDate.toISOString()); 
    }

    const { data: analyticsData, error: analyticsError } = await query;

    if (analyticsError) throw new Error(`Error fetching analytics data: ${analyticsError.message}`);
    const analyticsArray = analyticsData.map(entry => ({
      company_id: companyData.id,
      created_at: entry.created_at
    }));

    console.log(analyticsArray.length)
    return {
      count: analyticsArray.length, 
    };
  } catch (error) {
    console.error("Error in getCompanyAnalytics:", error.message);
    return { analyticsArray: [], count: 0, company_id: null };
  }
};
