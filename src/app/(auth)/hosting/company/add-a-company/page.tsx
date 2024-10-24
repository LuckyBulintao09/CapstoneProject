"use server";

import AddCompanyForm from "@/modules/hosting/company/AddCompanyForm";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import HostingContentLayout from "@/modules/hosting/components/ContentLayout";

function AddCompany() {
    return (
        <div className="bg-secondary w-full">
            <HostingContentLayout title="Add a company">
                <Breadcrumb className="py-5 px-3 my-2 border">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/hosting">Hosting</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/hosting/company">Company</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                                <Link href="/hosting/company/add-a-company">Add a company</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="mx-auto max-w-5xl py-11">
                <AddCompanyForm />
                </div>
            </HostingContentLayout>
        </div>
    );
}

export default AddCompany;
