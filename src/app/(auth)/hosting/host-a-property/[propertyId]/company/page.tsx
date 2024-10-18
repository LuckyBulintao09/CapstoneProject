"use server"

import { getAllCompanies } from "@/actions/company/getAllCompanies";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import PropertyCompanyForm from "@/modules/hosting/add-listing/PropertyCompanyForm";

async function Company({ params }: { params: { propertyId: string } }) {
    const companies = await getAllCompanies(); 
    return (
        <ResponsiveLayout className="h-screen flex items-center justify-center border relative">
            <PropertyCompanyForm companies={companies} propertyId={params.propertyId}/>
        </ResponsiveLayout>
    );
}

export default Company;
