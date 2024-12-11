"use server"

import { getAllAmenities } from "@/actions/amenety/getAllAmenities";
import { getUserCompanyId } from "@/actions/company/getUserCompaniesById";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomBreadcrumbs from "@/modules/hosting/components/CustomBreadcrumbs";
import PropertyDetailsForm from "@/modules/hosting/property/Forms/PropertyDetailsForm";
import { getAuthenticatedUser } from "@/utils/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

async function PropertyDetails({ params }: { params: { propertyId: string } }) {
    const user = await getAuthenticatedUser();
    const company = await getUserCompanyId(user?.id);
    const amenities = await getAllAmenities();
    // console.log(amenities)

    return (
        <div className="h-full pb-16 pt-8 flex flex-col justify-center items-center w-full">
            <div className="w-full flex flex-col items-start justify-center max-w-7xl mx-auto">
                {/* <CustomBreadcrumbs /> */}
                <Link href={`/hosting/properties`} className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), "rounded-full flex items-center gap-2")}>
                    <ArrowLeft className="w-4 h-4" />
                    <span>Go back</span>
                </Link>
                <div className="mb-8 max-w-[623px] px-3">
                    <h1 className="text-[2rem] leading-9 font-normal break-words">Create property</h1>
                </div>
            </div>
            <PropertyDetailsForm propertyId={params.propertyId} userId={user?.id} companyId={company?.id} amenities={amenities} />
        </div>
    );
}

export default PropertyDetails;
