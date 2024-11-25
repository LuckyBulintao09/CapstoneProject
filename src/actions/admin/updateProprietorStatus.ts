"use server";

import { createClient } from "@/utils/supabase/server";
import { sendEmail } from "../email/updateProprietorMessage";

export const updateProprietorStatus = async (
  proprietorId: string,
  status: boolean,
  reason?: string
) => {
  const supabase = createClient();

  try {
    const { data: proprietor, error: fetchError } = await supabase
      .from("account")
      .select("firstname, lastname, email")
      .eq("id", proprietorId)
      .single();

    if (fetchError) {
      console.error("Error fetching proprietor details:", fetchError);
      return false;
    }

    const updates: any = {
      approved_government: status,
      rejected_government: !status,
    };

    if (!status && reason) {
      updates.decline_reason = reason;
    }

    const { error } = await supabase
      .from("account")
      .update(updates)
      .eq("id", proprietorId);

    if (error) {
      console.error("Error updating proprietor status:", error);
      return false;
    }

    await sendEmail({
      email: proprietor.email,
      firstName: proprietor.firstname,
      lastName: proprietor.lastname,
      status: status ? "approved" : "rejected",
      reason,
    });

    return true;
  } catch (error) {
    console.error("Unexpected error:", error);
    return false;
  }
};
