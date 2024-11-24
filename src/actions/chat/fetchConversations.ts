import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const supabase = createClient();

export const fetchConversations = async (currentUserId: string) => {
  try {
    const [conversationResponse, accountsResponse, companiesResponse] = await Promise.all([
      supabase
        .from("conversations")
        .select("user2, last_message, updated_at, isArchived") 
        .eq("user1", currentUserId)
        .order("updated_at", { ascending: false }),
      supabase.from("account").select("id, firstname, lastname"),
      supabase.from("company").select("owner_id, company_name"),
    ]);

    if (conversationResponse.error || accountsResponse.error || companiesResponse.error) {
      console.error("Error fetching data:", conversationResponse.error || accountsResponse.error || companiesResponse.error);
      return [];
    }

    const conversationData = conversationResponse.data || [];
    const accountsData = accountsResponse.data || [];
    const companiesData = companiesResponse.data || [];

    const accountMap = Object.fromEntries(accountsData.map(acc => [acc.id, acc]));
    const companyMap = Object.fromEntries(companiesData.map(comp => [comp.owner_id, comp.company_name]));

    return conversationData.map(conversation => {
      const account = accountMap[conversation.user2];
      const companyName = companyMap[conversation.user2];

      return {
        user2: conversation.user2,
        firstname: account?.firstname || "Unknown",
        lastname: account?.lastname || "User",
        company_name: companyName || null,
        last_message: conversation.last_message || "No messages yet",
        updated_at: conversation.updated_at,
        isArchived: conversation.isArchived || false, 
      };
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    toast.error("Error fetching data.");
    return [];
  }
};
