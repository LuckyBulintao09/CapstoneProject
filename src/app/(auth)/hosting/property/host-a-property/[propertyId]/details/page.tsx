"use server"

import { getUserCompaniesById } from "@/actions/company/getUserCompaniesById";
import PropertyCompanyForm from "@/modules/hosting/property/PropertyDetailsForm";
import { getAuthenticatedUser } from "@/utils/supabase/server";

async function PropertyDetails({ params }: { params: { propertyId: string } }) {
    const user = await getAuthenticatedUser();
    const companies = await getUserCompaniesById(user.id);
    return (
        <div className="h-full flex justify-center items-center relative w-full">
            <PropertyCompanyForm companies={companies} propertyId={params.propertyId}/>
        </div>
    );
}

export default PropertyDetails;
