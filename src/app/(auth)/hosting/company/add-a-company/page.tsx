"use server";

import AddCompanyForm from "@/modules/hosting/company/AddCompanyForm";
import HostingContentLayout from "@/modules/hosting/components/ContentLayout";
import CustomBreadcrumbs from "@/modules/hosting/components/CustomBreadcrumbs";

function AddCompany() {
    return (
        <div className="bg-secondary w-full">
            <HostingContentLayout title="Add a company">
                <CustomBreadcrumbs />
                <div className="mx-auto max-w-5xl py-11">
                    <AddCompanyForm />
                </div>
            </HostingContentLayout>
        </div>
    );
}

export default AddCompany;
