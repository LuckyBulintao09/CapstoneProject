import React from "react";

import Link from "next/link";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { cn } from "@/lib/utils";

import { CircleAlert } from "lucide-react";
import { getAuthenticatedUser } from "@/utils/supabase/server";
import { getArrivingSoon } from "@/actions/hosting/home/transaction";
import { ArrivingCard } from "@/modules/hosting/home/components/ArrivingCard";
import { getRequirements } from "@/actions/hosting/home/requirements";

async function LessorPage() {
    const user = await getAuthenticatedUser();
    const arriving = await getArrivingSoon();
    const requirements = await getRequirements(user.id);
    return (
        <div className="pt-16 space-y-11">
            <div className="px-20 max-w-[1440px] mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-[2em] font-[500]">
                        <span className="">Welcome back, </span>
                        <span className="text-primary">{`${user?.user_metadata.firstname} ${user?.user_metadata.lastname}`}</span>
                    </h1>
                    {/* <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="link">Show all ({requirements?.length || 0})</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Property issues</DialogTitle>
                                <DialogDescription>This contains a list of issues and required actions about your property.</DialogDescription>
                            </DialogHeader>
                            <div className=" h-[calc(100vh-10rem)] ">
                                <ScrollArea>
                                    <div className="flex flex-col gap-3">
                                        <span className="text-sm">Required actions</span>
                                        <div className="flex flex-row justify-between items-center px-5 py-3 border rounded-md">
                                            <div className="flex flex-col justify-start text-sm">
                                                <span className="font-[500]">Confirm important details</span>
                                                <span className="text-destructive">Required to publish</span>
                                                <span>Lucky homes</span>
                                                <Link
                                                    href="/hosting/properties"
                                                    className={cn(
                                                        buttonVariants({ variant: "link", size: "sm" }),
                                                        " px-0 py-0 h-fit w-fit block mt-2 underline"
                                                    )}
                                                >
                                                    Go to property
                                                </Link>
                                            </div>
                                            <CircleAlert className="size-8 text-destructive" />
                                        </div>
                                    </div>
                                </ScrollArea>
                            </div>
                        </DialogContent>
                    </Dialog> */}
                </div>
                <div className="w-full shadow mt-8 rounded-lg border p-5">
                    <div className="flex overflow-x-scroll pb-4 gap-4">
                    {requirements?.map((requirement) => {
                        let statusText = "";
                        let alertColor = "";

                        // Determine the status based on specific fields
                        if (
                            !requirement.business_permit ||
                            !requirement.fire_inspection ||
                            !requirement.location ||
                            !requirement.address
                        ) {
                            statusText = "Confirm important details";
                            alertColor = "text-destructive"; // Red
                        } else if (
                            !requirement.description ||
                            !requirement.structure ||
                            !requirement.property_image ||
                            !requirement.title
                        ) {
                            statusText = "Incomplete property details";
                            alertColor = "text-warning"; // Orange
                        } else if (!requirement.isApproved) {
                            statusText = "Pending Approval";
                            alertColor = "text-primary"; // Blue
                        } else {
                            statusText = "All details confirmed";
                            alertColor = "text-success"; // Optional, for completeness
                        }

                        return (
                            <div key={requirement.id} className="flex-shrink-0 w-64 hover:shadow-md transition-shadow duration-300">
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-row justify-between items-center px-5 py-3 border rounded-md">
                                <div className="flex flex-col justify-start text-sm">
                                    <span className="font-[500]">{statusText}</span>
                                    {statusText === "Confirm important details" && (
                                    <span className="text-destructive">Required to publish</span>
                                    )}
                                    <span>{requirement.title || "Untitled Property"}</span>
                                    <Link
                                    href={`/hosting/properties/${requirement.id}/details/photos`}
                                    className={cn(
                                        buttonVariants({ variant: "link", size: "sm" }),
                                        "px-0 py-0 h-fit w-fit block mt-2 underline"
                                    )}
                                    >
                                    Go to Property
                                    </Link>
                                </div>
                                <CircleAlert className={`size-8 ${alertColor}`} />
                                </div>
                            </div>
                            </div>
                        );
                    })}
                    </div>
                </div>

            </div>
            <div className="px-20 max-w-[1440px] mx-auto pb-16">
                <div className="flex justify-between items-center">
                    <h1 className="text-[2em] font-[500]">Your reservations</h1>
                    <Link href={`/hosting/transaction_history`}>
                        <Button variant="link">All reservations</Button>
                    </Link>
                </div>
                <Tabs defaultValue="1" className="w-full mt-2">
                    <TabsList className="items-center justify-start gap-4 rounded-full bg-transparent dark:bg-transparent w-full p-0">
                        <TabsTrigger
                            value="1"
                            className="font-normal rounded-full px-3 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:[data-state=active]:text-primary-foreground data-[state=active]:font-normal dark:data-[state=active]:font-normal data-[state=active]:text-sm dark:data-[state=active]:text-sm"
                        >
                            Arriving Soon ({arriving?.length || 0})
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="1">
                        {arriving?.length === 0 ? (
                            <div className="h-48 rounded-lg flex items-center justify-center border">
                                You don't have guests staying with you right now.
                            </div>
                        ) : (
                            <div className="h-70 rounded-lg grid grid-cols-1 p-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 overflow-y-auto border">
                                {arriving.map((data, index) => (
                                    <ArrivingCard key={index} data={data} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default LessorPage;
