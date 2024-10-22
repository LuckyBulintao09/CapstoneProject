import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const checkConversation = async (currentUserId: string, currentReceiverId: any,receiverfname: any, receiverlname: any) => {
  if (!currentUserId || !currentReceiverId) return null;

  const conversationId = `${currentUserId}_${currentReceiverId}`;

  const { data: existingConversation } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId);

  if (existingConversation && existingConversation.length > 0) {
    return conversationId; 
  }

  const { data: receiverName, error: receiverError } = await supabase
    .from('account')
    .select('firstname, lastname')
    .eq('id', currentReceiverId)
    .single();

  if (receiverError) {
    console.error('Error fetching receiver name:', receiverError);
    return null;
  }

  const { error: createError } = await supabase
    .from('conversations')
    .insert([{
      id: conversationId,
      user1: currentUserId,
      user2: currentReceiverId,
      receiver_firstname: receiverName.firstname,
      receiver_lastname: receiverName.lastname,
      created_at: new Date(),
    }]);

    const { error: someError } = await supabase
    .from('conversations')
    .insert([{
      id: `${currentReceiverId}_${currentUserId}`,
      user1: currentReceiverId,
      user2: currentUserId,
      receiver_firstname: "receiverfname",
      receiver_lastname: "receiverlname",
      created_at: new Date(),
    }]);

  if (createError) {
    console.error('Error creating conversation:', someError);
    return null;
  }

  return conversationId; 
};
