"use server";

import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export const fetchUserProperties = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw new Error(`Error getting user: ${userError.message}`);
  }

  const userId = userData?.user?.id;
  if (!userId) {
    throw new Error("User ID is not available");
  }

  const { data: companyData, error: companyError } = await supabase
    .from('company')
    .select('id')
    .eq('owner_id', userId)
    .single();

  if (companyError) {
    throw new Error(`Error fetching company: ${companyError.message}`);
  }

  const companyId = companyData?.id;
  if (!companyId) {
    throw new Error("Company ID is not available");
  }

  const { data, error } = await supabase
    .from('property')
    .select('title')
    .eq('company_id', companyId);

  if (error) {
    console.error('Error fetching properties:', error.message);
    return [];
  }

  return data.map(property => property.title);
};
