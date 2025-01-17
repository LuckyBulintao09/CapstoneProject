import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

// Helper function to calculate the date filter based on the period
const getDateFilter = (period: string) => {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "24h":
      startDate = new Date(now);
      startDate.setHours(now.getHours() - 24);
      break;
    case "7d":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case "30d":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
      break;
    case "all":
    default:
      return null; // If period is 'all', no filter is applied
  }

  return startDate.toISOString();
};

// Fetch all analytics data
export const getAllAnalytics = async (period: string = "all") => {
  try {
    // Call delete data older than two months
    // await deleteDataOlderThanTwoMonths(); // Ensure old data is deleted first

    const dateFilter = getDateFilter(period);
    let query = supabase.from("analytics").select("card_id, created_at");

    if (dateFilter) {
      query = query.gte("created_at", dateFilter); // Apply date filter if provided
    }

    const { data: analyticsData, error: analyticsError } = await query;

    if (analyticsError) {
      console.error("Error fetching analytics data:", analyticsError.message || analyticsError);
      throw new Error("Error fetching analytics data");
    }

    if (!analyticsData || analyticsData.length === 0) {
      console.warn("No analytics data available.");
      return []; // Return empty array if no data found
    }

    const cardIds = analyticsData.map((entry) => entry.card_id);
    const { data: cardsData, error: cardsError } = await supabase
      .from("card")
      .select("id, title")
      .in("id", cardIds); // Fetch card titles based on card ids

    if (cardsError) {
      console.error("Error fetching card data:", cardsError.message || cardsError);
      throw new Error("Error fetching card data");
    }

    if (!cardsData || cardsData.length === 0) {
      console.warn("No card data available.");
      return []; // Return empty array if no card data found
    }

    // Create a mapping from card id to card title
    const cardTitlesMap: { [key: string]: string } = {};
    cardsData.forEach((card) => {
      cardTitlesMap[card.id] = card.title;
    });

    // Calculate counts for each card title based on analytics data
    const counts: { [key: string]: number } = {};
    analyticsData.forEach((entry) => {
      const title = cardTitlesMap[entry.card_id];
      if (title) {
        counts[title] = (counts[title] || 0) + 1;
      }
    });

    // Return the results as an array of title-count objects
    const result = Object.entries(counts).map(([title, count]) => ({
      title,
      count,
    }));

    return result;
  } catch (error) {
    console.error("Unexpected error in getAllAnalytics:", error);
    throw error;
  }
};

// Delete data older than two months from the analytics table
export const deleteDataOlderThanTwoMonths = async () => {
  try {
    const now = new Date();
    const twoMonthsAgo = new Date(now);
    twoMonthsAgo.setMonth(now.getMonth() - 2);
    const twoMonthsAgoISOString = twoMonthsAgo.toISOString();

    const { data, error } = await supabase
      .from("analytics")
      .delete()
      .lt("created_at", twoMonthsAgoISOString); // Delete records older than 2 months

    if (error) {
      console.error("Error deleting data:", error.message || error);
      throw new Error("Error deleting data");
    }

    console.log("Deleted old data:", data); // Log the deleted data for verification
  } catch (error) {
    console.error("Unexpected error while deleting old data:", error);
  }
};

// Call this function when you want to fetch the data (for testing purposes)
getAllAnalytics("all"); // You can pass any period, like "30d", "24h", etc.
