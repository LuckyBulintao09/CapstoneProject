import { createClient } from "@/utils/supabase/client";
import { updateInbox } from "./updateInbox";
import { toast } from "sonner";
import { newMessageNotification } from "../notification/notification";

const supabase = createClient();

interface SendMessageParams {
  userId: string;
  receiverId: string;
  conversationId: string;
  messageContent: string;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
}

export const sendMessage = async ({
  userId,
  receiverId,
  conversationId,
  messageContent,
  setMessages,
}: SendMessageParams) => {
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

  await updateInbox(userId, receiverId, messageContent);
  const messageContentNotification = "You have a new message."
  await newMessageNotification(receiverId, messageContentNotification);

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
