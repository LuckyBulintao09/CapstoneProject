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

  const { data: companyData, error: companyError } = await supabase
    .from('company')
    .select('company_name')
    .eq('owner_id', receiverId)
    .single();
  console.log('companyData', companyData);
  if (companyError) {
    console.error('Error fetching company name:', companyError);
    return { ...accountData, company_name: null }; 
  }

  return { ...accountData, company_name: companyData?.company_name || null };
};
