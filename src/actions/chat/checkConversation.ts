"use client"
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const supabase = createClient();

export const checkConversation = async (currentUserId: string, currentReceiverId: any) => {
  if (currentUserId === currentReceiverId) {
    toast.error("You cannot create a conversation with yourself.");
    return null;
  }

  if (!currentUserId || !currentReceiverId) return null;

  const conversationId = `${currentUserId}_${currentReceiverId}`;


  const { data: existingConversation, error: fetchError } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId);

  if (fetchError) {
    console.error('Error fetching conversation:', fetchError);
    return null;
  }

  if (existingConversation && existingConversation.length > 0) {
    return conversationId; 
  }


  const { error: createError1 } = await supabase
    .from('conversations')
    .insert([
      {
        id: conversationId,
        user1: currentUserId,
        user2: currentReceiverId,
        created_at: new Date(),
      },
    ]);

  const { error: createError2 } = await supabase
    .from('conversations')
    .insert([
      {
        id: `${currentReceiverId}_${currentUserId}`,
        user1: currentReceiverId,
        user2: currentUserId,
        created_at: new Date(),
      },
    ]);

  if (createError1 || createError2) {
    console.error('Error creating conversation:', createError1 || createError2);
    return null;
  }

  return conversationId;
};
