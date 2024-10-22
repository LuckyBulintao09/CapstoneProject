import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchReceiverName = async (receiverId: string) => {
  const { data, error } = await supabase
    .from('account')
    .select('firstname, lastname')
    .eq('id', receiverId)
    .single();

  if (error) {
    console.error('Error fetching receiver name:', error);
    return null; 
  }
  return data; 
};
