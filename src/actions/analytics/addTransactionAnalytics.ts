"use client";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export async function addTransactionAnalytics(
  company_id: string,
  service: string,
  property_title: string,
  scheduled_date: string
) {
  try {

    if (!company_id || !service || !property_title || !scheduled_date) {
      throw new Error("All fields (company_id, service, property_title, scheduled_date) are required");
    }

    const parsedDate = new Date(scheduled_date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date format for scheduled_date");
    }

    
    const transactionData = {
      company_id,
      service,
      property_title,
      scheduled_date: parsedDate.toISOString(), 
    };


    console.log("Inserting transaction analytics with data:", transactionData);


    const { data, error } = await supabase
      .from("transactionAnalytics")
      .insert([transactionData]) 
      .single();

    console.log("Supabase response:", { data, error });

    if (error) {
      console.error("Error inserting transaction analytics:", error.message);
      throw new Error(`Error inserting transaction analytics: ${error.message}`);
    }
    console.log("Transaction analytics added successfully:", data);
    return { success: true, data };

  } catch (error) {
    console.error("Error in addTransactionAnalytics:", error.message);
    return { success: false, message: error.message };
  }
}
