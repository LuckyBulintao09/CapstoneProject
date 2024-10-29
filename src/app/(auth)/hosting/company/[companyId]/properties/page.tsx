import HostingContentLayout from "@/modules/hosting/components/ContentLayout";
import CustomBreadcrumbs from "@/modules/hosting/components/CustomBreadcrumbs";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { getCompanyProperties } from "@/actions/company/getCompanyProperties";

async function Properties({ params }: { params: { companyId: string } }) {
    const companyProperties = await getCompanyProperties(params.companyId);

    console.log(companyProperties.title, "companyProperties");

    return (
        <div>
            <HostingContentLayout title="Company properties">
                <CustomBreadcrumbs />
                <div className="mx-auto max-w-5xl py-11 grid grid-cols-1 gap-5">
                    <Link href={`/hosting/host-a-property`}>Test add button</Link>
                    <div className="grid grid-cols-16 grid-rows-16 gap-4">
                        {companyProperties.map((property: any) => (
                            <Card className="col-span-4 row-span-4 relative h-max border-none shadow-md">
                                <CardHeader className="px-1 overflow-hidden py-1.5 absolute top-1 left-1 w-max shadow-sm ml-r">
                                    {/* {company?.has_business_permit && (
                                        <Badge
                                            className={cn(
                                                "text-xs",
                                                company.has_business_permit === "pending"
                                                    ? "bg-warning hover:bg-warning/90"
                                                    : company.has_business_permit === "approved"
                                                    ? "bg-success hover:bg-success/90"
                                                    : "bg-danger hover:bg-danger/90"
                                            )}
                                        >
                                            {company.has_business_permit}
                                        </Badge>
                                    )} */}
                                </CardHeader>
                                <div className="">
                                    <Image
                                        src={"https://picsum.photos/1920/1080"}
                                        alt="placeholder"
                                        width={1920}
                                        height={1080}
                                        className="object-cover aspect-square rounded-lg w-full"
                                    />
                                </div>
                                <CardFooter className="px-3 bg-secondary/20 border-white/20 backdrop-blur-md border overflow-hidden py-1.5 absolute before:rounded-xl rounded-xl bottom-1 w-[calc(100%_-_9px)] shadow-sm ml-1">
                                    <div className="flex justify-between w-full items-center">
                                        <p className="text-xs text-white truncate">{property?.title}</p>
                                        <Link
                                            href={`/hosting/company/${params.companyId}/properties/${property?.id}`}
                                            className={cn(
                                                buttonVariants({
                                                    variant: "default",
                                                    size: "sm",
                                                }),
                                                "m-0 text-xs rounded-full text-white"
                                            )}
                                        >
                                            See more
                                        </Link>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </HostingContentLayout>
        </div>
    );
}

export default Properties;
