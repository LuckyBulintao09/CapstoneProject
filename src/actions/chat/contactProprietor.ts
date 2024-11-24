"use server";
import { createClient } from "@/utils/supabase/server";
import { checkConversation } from "./checkConversation";
import { sendSystemMessage } from "./systemGeneratedMessage";
const supabase = createClient();

export async function contactProprietor(proprietorId: string) {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error getting user:", error);
      throw error;
    }
    const userId = data.user?.id;
    await checkConversation(userId, proprietorId);
    return "/chat/inbox";
  } catch (error) {
    console.error("Error contacting proprietor:", error);
    throw error;
  }
}
