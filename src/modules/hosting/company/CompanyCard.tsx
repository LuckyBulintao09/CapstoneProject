"use client";

import {
    Card,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"

import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

import useGetUserCompaniesById from "@/hooks/company/useGetUserCompaniesById";
import useGetUserId from "@/hooks/user/useGetUserId";
import { Skeleton } from "@/components/ui/skeleton";

function CompanyCard() {
    const { data: user } = useGetUserId()
    const companies = useGetUserCompaniesById(user?.id);
    return (
        <div className="grid grid-cols-16 grid-rows-16 gap-4">
            <Link href="/hosting/company/add-a-company" className={cn(buttonVariants({ variant: "default", size: "sm" }), "col-span-full w-fit")}>Add a company</Link>
            {companies.isSuccess ? (
                companies.data.map((company: any) => (
                    <Card className="col-span-4 row-span-4 relative h-max border-none shadow-md">
                        <CardHeader className="px-1 overflow-hidden py-1.5 absolute top-1 left-1 w-max shadow-sm ml-r">
                            {company?.has_business_permit && (
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
                            )}
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
                                <p className="text-xs text-white truncate">{company?.company_name}</p>
                                <Link
                                    href={`/hosting/company/${company?.id}/edit-company`}
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
                ))
            ) : (
                <>
                    <Skeleton className="col-span-4 row-span-4 border aspect-square rounded-xl" />
                    <Skeleton className="col-span-4 row-span-4 border aspect-square rounded-xl" />
                    <Skeleton className="col-span-4 row-span-4 border aspect-square rounded-xl" />
                    <Skeleton className="col-span-4 row-span-4 border aspect-square rounded-xl" />
                    <Skeleton className="col-span-4 row-span-4 border aspect-square rounded-xl" />
                    <Skeleton className="col-span-4 row-span-4 border aspect-square rounded-xl" />
                    <Skeleton className="col-span-4 row-span-4 border aspect-square rounded-xl" />
                    <Skeleton className="col-span-4 row-span-4 border aspect-square rounded-xl" />
                </>
            )}
        </div>
    );
}

export default CompanyCard;
