"use server";

import { createClient } from "@/utils/supabase/server";
import { subDays } from "date-fns";

const supabase = createClient();

export const getAnalytics = async (days: number) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(`Error fetching user data: ${userError.message}`);

    const userId = userData?.user?.id;
    if (!userId) throw new Error("User ID not found");

    const { data: companyData, error: companyError } = await supabase
      .from("company")
      .select("id")
      .eq("owner_id", userId)
      .single();

    if (companyError) throw new Error(`Error fetching the company: ${companyError.message}`);

    const startDate = subDays(new Date(), days);

    const { data: analyticsData, error: analyticsError } = await supabase
      .from("companyAnalytics")
      .select("created_at")
      .eq("company_id", companyData.id)
      .gte("created_at", startDate.toISOString()) 
      .order("created_at", { ascending: true });

    if (analyticsError) throw new Error(`Error fetching analytics data: ${analyticsError.message}`);

    const analyticsArray = analyticsData.map(entry => ({
      company_id: companyData.id,
      created_at: entry.created_at
    }));

    return {
      analyticsArray,
      count: analyticsArray.length,
      company_id: companyData.id
    };
  } catch (error) {
    console.error(error.message);
    return { analyticsArray: [], count: 0, company_id: null };
  }
};
