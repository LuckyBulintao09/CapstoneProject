import { createClient } from "@/utils/supabase/client";
import { updateInbox } from "./updateInbox";
import { toast } from "sonner";

const supabase = createClient();

interface SendImageAsMessageParams {
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
}: SendImageAsMessageParams) => {
  if (!conversationId) {
    console.error('Conversation ID is not set.');
    return;
  }

  if (!messageContent.trim()) {
    toast.error('Message cannot be empty');
    return;
  }

  const { data, error } = await supabase.from('messages').insert([{
    sender_id: userId,
    receiver_id: receiverId,
    content: messageContent,
    conversation_id: conversationId,
    created_at: new Date(),
  }]);

  const messageContentUpdate = "Sent an image."
  await updateInbox(userId, receiverId, messageContentUpdate);

  if (error) {
    console.error('Error sending message:', error);
    toast.error('Error sending message. Please try again.');
  } else if (data && data.length > 0) {
    setMessages(prevMessages => [
      ...prevMessages,
      { ...data[0], sender_id: userId }
    ]);
  }
};
