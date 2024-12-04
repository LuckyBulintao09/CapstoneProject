import { getUserCompaniesById } from "@/actions/company/getUserCompaniesById";
import Properties from "@/modules/hosting/property/Properties";
import { PropertyViewModeProvider } from "@/modules/hosting/property/PropertyViewModeProvider";
import { createClient, getAuthenticatedUser } from "@/utils/supabase/server";
import React from "react";

async function getPropertiesByUserCompany(companies: any) {
    const companyIds = companies.map((company: any) => company.id);
    const supabase = createClient();

    try {
        const { data, error } = await supabase.from("property").select("*").in("company_id", companyIds);

        if (error) {
            throw error;
        }
        return data;
    } catch (error: any) {
        throw error;
    }
}

export const revalidate = 0;

async function PropertyPage() {
    const user = await getAuthenticatedUser();

    if (!user) {
      return null;
    }
    const companies = await getUserCompaniesById(user.id)

    if (!companies) {
      return null;
    }

    const properties = await getPropertiesByUserCompany(companies);

    return (
			<PropertyViewModeProvider>
				<div className='px-32 md:px-24 sm:px-20 xs:px-10 mx-auto pb-16'>
					<Properties data={properties} />
				</div>
			</PropertyViewModeProvider>
		);
}

export default PropertyPage;
