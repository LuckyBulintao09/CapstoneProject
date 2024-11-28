"use client";

import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import LoadingPage from "@/components/LoadingPage";
import { MapPin, LucideMessageCircle } from "lucide-react";
import { BusinessLogo } from "@/modules/property/components/BusinessLogo";

import useGetUserCompaniesById from "@/hooks/company/useGetUserCompaniesById";
import useGetUserId from "@/hooks/user/useGetUserId";

function CompanyCard() {
    const { data: user } = useGetUserId();
    const { data: companies, isLoading, error } = useGetUserCompaniesById(user?.id);

    if (isLoading) {
        return (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <LoadingPage />
            </div>
        );
    }

    if (true) {
        return (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Card className="col-span-full p-6 text-center bg-gray-50 shadow-md">
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-gray-800">
                            No Company Found
                        </h2>
                        <p className="text-sm text-gray-600 mt-2">
                            Create a company to start managing your properties.
                        </p>
                    </CardHeader>
                    <CardFooter>
                        <Link href="/hosting/company/add-a-company">
                            <Button variant="default" size="lg">
                                Create a Company
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-full py-16 flex flex-col min-h-screen bg-background dark:bg-secondary">
            <div className="">
                {companies.length > 0 ? (
                    <div className="">
                        <div className="grid grid-cols-4 gap-2">
                            {/* Company Details */}
                            <div className="flex items-center md:col-span-3 sm:col-span-4 xs:col-span-4">
                                <BusinessLogo image={companies[0].logo} />
                                <div className="pt-4 w-full">
                                    <div className="flex flex-col">
                                        <h1 className="font-semibold xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-left dark:text-white ml-4 mb-1">
                                            {companies[0].company_name}
                                        </h1>
                                        <p className="flex items-center text-foreground text-sm md:text-md lg:text-lg ml-4">
                                            <MapPin className="mr-1" height={18} width={18} />
                                            {companies[0].address}
                                        </p>
                                        <p className="flex items-center text-foreground text-sm md:text-md lg:text-lg ml-4">
                                            Joined UniHomes since{" "}
                                            {new Date(companies[0].created_at).toLocaleDateString(
                                                "en-US",
                                                {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                }
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Company Section */}
                        <Card className="dark:bg-transparent bg-white border border-gray-300 shadow-md mt-6">
                            <CardHeader>
                                <CardTitle>About {companies[0].company_name}</CardTitle>
                                <CardDescription className="border-b border-gray-300 pb-3">
                                    On UniHomes since{" "}
                                    {new Date(companies[0].created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 dark:text-white">
                                <div className="space-y-1">{companies[0].about}</div>
                            </CardContent>
                        </Card>

                        {/* Edit Company Button */}
                        <div>
                            <Link href={`/hosting/company/${companies[0].id}/edit-company`}>
                                <Button variant="default" size="lg" className="mt-6">
                                    Edit Company
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <Card className="col-span-full p-6 text-center bg-gray-50 shadow-md">
                        <CardHeader>
                            <h2 className="text-xl font-semibold text-gray-800">
                                No Company Found
                            </h2>
                            <p className="text-sm text-gray-600 mt-2">
                                Create a company to start managing your properties.
                            </p>
                        </CardHeader>
                        <CardFooter>
                            <Link href="/hosting/company/add-a-company">
                                <Button variant="default" size="lg">
                                    Create a Company
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default CompanyCard;
