import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchMessages = async (currentUserId: string, currentReceiverId: string) => {
  if (!currentUserId || !currentReceiverId) return;
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
    .or(`sender_id.eq.${currentReceiverId},receiver_id.eq.${currentReceiverId}`)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  return data;
};
