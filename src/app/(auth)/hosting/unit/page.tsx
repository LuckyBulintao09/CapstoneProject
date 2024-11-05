import React from "react";

import { UnitViewModeProvider } from "@/modules/hosting/unit/UnitViewModeProvider";
import Units from "@/modules/hosting/unit/Units";

import { getUserCompaniesById } from "@/actions/company/getUserCompaniesById";
import { createClient, getAuthenticatedUser } from "@/utils/supabase/server";
import { getUnitsUnderCompanyProperty } from "@/actions/unit/getUnitsUnderCompanyProperty";

async function getPropertiesByUserCompany(companies: any) {
    const companyIds = companies.map((company: any) => company.id);
    const supabase = createClient();

    try {
        const { data, error } = await supabase.from("property").select("*").in("company_id", companyIds);

        if (error) {
            throw error;
        }
        console.log("Fetched Properties Data:", data);
        return data;
    } catch (error: any) {
        throw error;
    }
}

async function UnitPage() {
    const user = await getAuthenticatedUser();

    if (!user) {
      return null;
    }

    const units = await getUnitsUnderCompanyProperty(user.id);
    console.log(units)

    return (
        <UnitViewModeProvider>
            <div className="container mx-auto">
                <Units data={units} />
            </div>
        </UnitViewModeProvider>
    );
}

export default UnitPage;
