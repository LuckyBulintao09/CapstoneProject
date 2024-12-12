import { createClient } from "@/utils/supabase/client";
import { updateInbox } from "./updateInbox";
import { toast } from "sonner";

const supabase = createClient();

interface SendImageParams {
  userId: string;
  receiverId: string;
  conversationId: string;
  messageContent: string;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
}

export const sendImageAsMessage = async ({
  userId,
  receiverId,
  conversationId,
  messageContent,
  setMessages,
}: SendImageParams) => {
  if (!conversationId) {
    console.error("Conversation ID is not set.");
    return;
  }

  if (!messageContent.trim()) {
    toast.error("Message cannot be empty");
    return;
  }

  try {
    // Insert message into the database
    const { data, error } = await supabase.from("messages").insert([
      {
        sender_id: userId,
        receiver_id: receiverId,
        content: messageContent,
        conversation_id: conversationId,
        created_at: new Date(),
      },
    ]);

    // Handle inbox update
    const messageContentUpdate = "Sent an image.";
    await updateInbox(userId, receiverId, messageContentUpdate);

    if (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending message. Please try again.");
      return;
    }

    if (data && data.length > 0) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...data[0], sender_id: userId },
      ]);
    }
  } catch (error) {
    console.error("Error sending image message:", error);
    toast.error("Error sending message. Please try again.");
  }
};
