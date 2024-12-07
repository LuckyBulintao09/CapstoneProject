"use server";

import { createClient } from "@/utils/supabase/server";
export async function expirePropertiesFunction() {
  const supabase = createClient();

  try {
    // First, handle expired properties where due_date has passed
    const { data: expiredProperties, error: expireError } = await supabase
      .from("property")
      .update({ isApproved: 'pending' }) // Expire properties
      .lt("due_date", new Date().toISOString()) // Only properties with a past due_date
      .eq("isApproved", 'approved'); // Only update approved properties

    if (expireError) {
      console.error("Error expiring properties:", expireError.message);
      throw expireError;
    }

    console.log(
      `Expired ${expiredProperties ? expiredProperties.length : 0} properties.`
    );

    // Next, handle properties where isApproved is false (clear the due_date)
    const { data: clearedProperties, error: clearError } = await supabase
      .from("property")
      .update({ due_date: null }) // Clear due_date
      .eq("isApproved", 'pending'); // Only where isApproved is already false

    if (clearError) {
      console.error("Error clearing due dates:", clearError.message);
      throw clearError;
    }

    console.log(
      `Cleared due dates for ${
        clearedProperties ? clearedProperties.length : 0
      } properties.`
    );


    return {
      expiredCount: expiredProperties ? expiredProperties.length : 0,
      clearedCount: clearedProperties ? clearedProperties.length : 0,
    };
  } catch (error) {
    console.error("Unexpected error during expiration process:", error.message);
    throw new Error(error.message || "Failed to process expiration.");
  }
}
