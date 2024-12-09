import React from "react";

import { getCompanyById } from "@/actions/company/getCompanyById";

import { getUserCompanyId } from "@/actions/company/getUserCompaniesById";

import { PropertyViewModeProvider } from "@/modules/hosting/property/PropertyViewModeProvider";

import { createClient, getAuthenticatedUser } from "@/utils/supabase/server";

import Properties from "@/modules/hosting/property/Properties";

async function getPropertiesByUserCompany() {
    try {

        const user = await getAuthenticatedUser();
        if (!user?.id) {
            throw new Error("User not authenticated or missing ID.");
        }

        const company_data = await getUserCompanyId(user.id);
        if (!company_data?.id) {
            throw new Error("No company associated with the user.");
        }

        const supabase = createClient();

        const { data, error } = await supabase.from("property").select("*").eq("company_id", company_data.id);

        if (error) {
            throw new Error(`Error fetching properties: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error("Error in getPropertiesByUserCompany:", error);
        throw error;
    }
}

export const revalidate = 0;

async function PropertyPage() {
    const properties = await getPropertiesByUserCompany();
    console.log(properties);
    return (
        <PropertyViewModeProvider>
            <div className="container mx-auto px-11 airBnbMobile:px-0">
                <Properties data={properties} />
            </div>
        </PropertyViewModeProvider>
    );
}
export default PropertyPage;
