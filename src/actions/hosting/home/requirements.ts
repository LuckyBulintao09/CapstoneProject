"use server"

import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export const getRequirements = async (
    userId: string
) => {
    const { data: company_ids, error: companyIdsError } = await supabase
      .from("company")
      .select("id")
      .eq("owner_id", userId)
      .single();


    const { data, error } = await supabase
      .from("property")
      .select("*")
      .or(
        "structure.is.null,address.is.null,location.is.null,description.is.null,business_permit.is.null,fire_inspection.is.null"
      )
      .eq("company_id", company_ids.id);
  
    if (error) {
      console.error("Error fetching requirements:", error);
      return null;
    }
    console.log(data)
    return data;
  };