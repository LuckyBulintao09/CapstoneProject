"use server"

import { getUserCompanyId } from "@/actions/company/getUserCompaniesById";
import CustomBreadcrumbs from "@/modules/hosting/components/CustomBreadcrumbs";
import PropertyDetailsForm from "@/modules/hosting/property/Forms/PropertyDetailsForm";
import { getAuthenticatedUser } from "@/utils/supabase/server";

async function PropertyDetails({ params }: { params: { propertyId: string } }) {
    const user = await getAuthenticatedUser();
    const company = await getUserCompanyId(user?.id);

    return (
        <div className="h-full pb-16 pt-8 flex flex-col justify-center items-center w-full">
            <div className="w-full flex flex-col items-start justify-center max-w-7xl mx-auto">
                <CustomBreadcrumbs />
                <div className="mb-8 max-w-[623px]">
                    <h1 className="text-[2rem] leading-9 font-normal break-words">Create property</h1>
                </div>
            </div>
            <PropertyDetailsForm propertyId={params.propertyId} user={user?.id} companyId={company?.id} />
        </div>
    );
}

export default PropertyDetails;
