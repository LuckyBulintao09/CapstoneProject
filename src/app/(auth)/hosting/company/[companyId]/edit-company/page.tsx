import EditCompanyForm from "@/modules/hosting/company/EditCompanyForm";
import HostingContentLayout from "@/modules/hosting/components/ContentLayout";
import CustomBreadcrumbs from "@/modules/hosting/components/CustomBreadcrumbs";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { getCompanyById } from "@/actions/company/getCompanyById";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FileUploader } from "@/modules/hosting/company/FileUploader";
import { File } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BusinessPermitDelete from "@/modules/hosting/company/BusinessPermitDelete";

export const revalidate = 0

async function EditCompany({params}: {params: {companyId: string}}) {

    const company = await getCompanyById(params.companyId);

    return (
        <div className="w-full">
            <HostingContentLayout title="Edit company">
                <CustomBreadcrumbs />

                <div className="mx-auto max-w-5xl py-11 grid grid-cols-1 gap-5">

                    <Card>
                        <CardHeader>
                            <CardTitle>Company Details</CardTitle>
                            <CardDescription>Edit the company name and description here.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {company ? <EditCompanyForm companyId={params.companyId} company={company} /> : <span>Loading...</span>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                            <span>Business Permit</span>
                            <Badge className={cn(
                                "text-sm",
                                company.has_business_permit === "pending" ? "bg-warning hover:bg-warning/90" : company.has_business_permit === "approved" ? "bg-success hover:bg-success/90" : "bg-danger hover:bg-danger/90"
                            )}>{company.has_business_permit}</Badge>
                            </CardTitle>
                            <CardDescription className="text-destructive">Verify your business by uploading a business permit here.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileUploader companyId={params.companyId} />
                                <BusinessPermitDelete companyId={params.companyId} fileUrl={company?.business_permit} />
                            </div>
                            {company?.business_permit ? (
                                <div className="flex items-center gap-2">
                                    <File className="size-4" />
                                    <Link href={company.business_permit} target="_blank">View Business Permit</Link>
                                </div>    
                            ) : (
                                <div className="flex items-center gap-2">
                                    <File className="size-4" />
                                    No file uploaded
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Compnay settings</CardTitle>
                            <CardDescription>Change company settings here.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="destructive" className="w-fit">Delete compnay</Button>
                        </CardContent>
                    </Card>
                    
                </div>
            </HostingContentLayout>
        </div>
    );
}

export default EditCompany;
