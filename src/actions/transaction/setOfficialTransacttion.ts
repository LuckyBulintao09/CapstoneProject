"use client";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
const supabase = createClient();

export async function setOfficialTransaction(transactionId: number) {
  console.log("Updating transaction", transactionId);

  try {
    const { data, error } = await supabase
      .from("company_billing")
      .update({ isOfficial: true })
      .eq("transaction_id", transactionId);

    if (error) {
      console.error("Error updating transaction:", error.message);
      if (error.message.includes("transaction_id")) {
        toast.error("The provided transaction ID does not exist in the database.");
      } else {
        toast.error("An unexpected error occurred while marking the transaction as official.");
      }
      console.log("Check if the transaction ID exists in the company_billing table.");

      return { success: false, error: error.message };
    }

    toast.success("Transaction marked as official");
    console.log("Transaction updated successfully:", data);
    return { success: true, data };
    
  } catch (error) {
    console.error("Unexpected error:", error);

    toast.error("An unexpected error occurred. Please try again later.");
    return { success: false, error: error.message };
  }
}
