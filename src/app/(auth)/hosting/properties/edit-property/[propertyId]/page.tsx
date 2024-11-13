import { getUserCompaniesById } from "@/actions/company/getUserCompaniesById";
import { getPropertyById } from "@/actions/property/get-property-by-id";
import UpdatePropertyDetailsForm from "@/modules/hosting/property/UpdatePropertyDetailsForm";
import { getAuthenticatedUser } from "@/utils/supabase/server";

async function EditPropertyPage({ params }: { params: { propertyId: string } }) {
    const user = await getAuthenticatedUser();
    const companies = await getUserCompaniesById(user.id);
    const property = await getPropertyById(params.propertyId);  

    // console.log(companies, "companies");
    // console.log(property, "property");
    
    return (
        <div className="h-full flex justify-center items-center relative w-full">
            <UpdatePropertyDetailsForm companies={companies} propertyId={params.propertyId} property={property} />
        </div>
    );
}

export default EditPropertyPage;
