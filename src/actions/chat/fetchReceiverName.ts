import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchReceiverName = async (receiverId: string) => {
  const { data: accountData, error: accountError } = await supabase
    .from('account')
    .select('firstname, lastname')
    .eq('id', receiverId)
    .single();

  if (accountError) {
    console.error('Error fetching receiver name:', accountError);
    return null; 
  }

  return accountData;
};