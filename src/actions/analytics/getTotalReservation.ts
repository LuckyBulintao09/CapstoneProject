"use server"
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

export const getReservationAnalytics = async (property_title, period) => {
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

    if (companyError) throw new Error(`Error fetching company: ${companyError.message}`);

    const companyId = companyData?.id;
    if (!companyId) throw new Error("Company ID not found");

    console.log("Fetched company ID:", companyId);

    const days = mapTimePeriodToDays(period);
    let startDate = null;

    if (days > 0) {
      startDate = subDays(Date.now(), days);
    }

    console.log("Start date for analytics query:", startDate ? new Date(startDate).toISOString() : "All Time (no filtering)");

    let query = supabase
      .from("transactionAnalytics")
      .select("*")
      .eq("property_title", property_title)
      .order("created_at", { ascending: true });

    if (startDate) {
      query = query.gte("created_at", new Date(startDate).toISOString());
    }

    const { data: analyticsData, error: analyticsError } = await query;

    if (analyticsError) throw new Error(`Error fetching analytics data: ${analyticsError.message}`);


    let roomReservationsCount = 0;
    let onSiteVisitsCount = 0;

  
    analyticsData.forEach((entry) => {
      const service = entry.service?.trim(); 


      if (service === "Room Reservation") {
        roomReservationsCount++;
      } else if (service === "On-Site Visit") {
        onSiteVisitsCount++;
      }
    });


    const chartData = analyticsData.map((entry) => ({
      date: new Date(entry.created_at).toISOString().split("T")[0],
      service: entry.service,  
      property_title,  
    }));

    const chartDataLength = chartData.length;
    return {
      success: true,
      count: chartDataLength,  
      roomReservationsCount,
      onSiteVisitsCount,
      chartData,  
    };
  } catch (error) {
    console.error("Error in getReservationAnalytics:", error.message);
    return { success: false, message: error.message, chartData: [], count: 0 };
  }
};
