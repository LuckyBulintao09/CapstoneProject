"use server";

import { createClient } from "@/utils/supabase/client";

export const getAllPropertiesUnderUser = async (userId: string) => {
    const supabase = createClient();

    const { data: companies, error: companyError } = await supabase.from("company").select("id").eq("owner_id", userId);

    if (companyError) {
        console.error("Error fetching companies:", companyError);
        return null;
    }

    // Extract company IDs into an array
    const companyIds = companies.map((company) => company.id);

    if (companyIds.length === 0) {
        // If the user has no companies, return an empty array
        return [];
    }

    // Now fetch all properties for these company IDs
    const { data: properties, error: propertyError } = await supabase
        .from("property")
        .select(
            `
      id,
      title,
      address,
      location,
      isPropertyBoosted,
      company:company_id (id, company_name)
    `
        )
        .in("company_id", companyIds);

    if (propertyError) {
        console.error("Error fetching properties:", propertyError);
        return null;
    }

    return properties;
};
