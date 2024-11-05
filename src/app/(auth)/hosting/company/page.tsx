"use server";

import CompanyCard from "@/modules/hosting/company/CompanyCard";
import HostingContentLayout from "@/modules/hosting/components/ContentLayout";
import CustomBreadcrumbs from "@/modules/hosting/components/CustomBreadcrumbs";
import React from "react";

async function Company() {

    return (
        <div>
            <HostingContentLayout title="Company">
                <CustomBreadcrumbs />
                
                <div className="mx-auto max-w-5xl py-11">
                    <CompanyCard />
                </div>
            </HostingContentLayout>
        </div>
    );
}

export default Company;
