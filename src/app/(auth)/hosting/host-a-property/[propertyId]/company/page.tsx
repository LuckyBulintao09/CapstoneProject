"use server"

import { getAllCompanies } from "@/actions/company/getAllCompanies";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import ListingStepButton from "@/modules/hosting/add-listing/ListingStepButton";
import PropertyCompanyForm from "@/modules/hosting/add-listing/PropertyCompanyForm";

async function ComanyForm({ params }: { params: { propertyId: string } }) {
    const companies = await getAllCompanies(); 
    return (
        <ResponsiveLayout className="h-screen flex items-center justify-center border relative">
            <PropertyCompanyForm companies={companies}/>
            <ListingStepButton hrefTo={`/hosting/host-a-property/${params.propertyId}/property-type`} hrefFrom={`/hosting/host-a-property/`}/>
        </ResponsiveLayout>
    );
}

export default ComanyForm;
