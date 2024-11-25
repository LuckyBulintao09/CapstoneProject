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

    return true;
  } catch (error) {
    console.error("Unexpected error:", error);
    return false;
  }
};
