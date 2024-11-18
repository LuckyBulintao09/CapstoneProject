import { createClient } from "@/utils/supabase/client";
import { checkConversation } from "./checkConversation";
import { sendMessage } from "./sendMessage";
import { toast } from "sonner";

const supabase = createClient();

export const sendMessageAfterReservation = async (
  unitId: string,
  userId: string,
  setMessages: React.Dispatch<React.SetStateAction<any[]>>
) => {
  try {
    const { data, error } = await supabase
      .from("unit")
      .select("property:property_id(company:company_id(owner:owner_id(id)))")
      .eq("id", unitId)
      .single(); 

    if (error || !data) {
      console.error("Error fetching owner account ID:", error);
      return;
    }

    const ownerAccountId = data.property.company.owner.id;
    if (!ownerAccountId) {
      console.error("Owner Account ID is missing.");
      return;
    }

    const [conversationId] = await Promise.all([
      checkConversation(userId, ownerAccountId),
    ]);

    if (conversationId) {
      await sendMessage({
        userId,
        receiverId: ownerAccountId,
        conversationId,
        messageContent: "I have reserved a unit!",
        setMessages,
      });
      toast.success("Owner notified. You can now chat with the owner!");
    } else {
      console.error("Conversation ID is missing.");
    }
  } catch (err) {
    console.error("Error in sendMessageAfterReservation:", err);
  }
};
