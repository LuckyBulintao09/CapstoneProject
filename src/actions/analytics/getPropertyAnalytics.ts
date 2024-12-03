"use server";

import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

const getDateRange = (timePeriod: string) => {
  const today = new Date();
  let startDate: Date;

  switch (timePeriod) {
    case "30days":
      startDate = new Date(today.setDate(today.getDate() - 30));
      break;
    case "7days":
      startDate = new Date(today.setDate(today.getDate() - 7)); 
      break;
    case "1day":
      startDate = new Date(today.setDate(today.getDate() - 1)); 
      break;
    case "total":
    default:
      startDate = new Date(0);
      break;
  }

  return startDate;
};

export async function getPropertyAnalytics(timePeriod: string) {
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
    throw new Error("Company ID not found for the user");
  }

  const startDate = getDateRange(timePeriod);

  const { count, error: countError } = await supabase
    .from('propertyAnalytics') 
    .select('*', { count: 'exact' }) 
    .eq('company_id', companyId)
    .gte('created_at', startDate.toISOString());

  if (countError) {
    throw new Error(`Error fetching property analytics count: ${countError.message}`);
  }

  return count; 
}
