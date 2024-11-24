"use client"
import React from "react";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

import CustomBreadcrumbs from "@/modules/hosting/components/CustomBreadcrumbs";

import { ArrowLeft, Eye, Settings2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

function EditPropertyLayout({ children, right, params }: { children: React.ReactNode, right: React.ReactNode, params: { propertyId: string } }) {
    const pathname = usePathname();
    return (
        <div className="hidden airBnbDesktop:flex my-0 mx-auto h-full">
            <section className="border-r flex flex-col h-full w-full airBnbDesktop:grow airBnbDesktop:mx-10 min-[1128px]:mx-20 airBnbBigDesktop:w-[calc(76px+344px+64px)]">
                <div className="ml-[calc(32px+40px)]">
                    <CustomBreadcrumbs />
                </div>
                <header className="flex items-center justify-center h-12 mb-5 px-4 airBnbDesktop:pl-0 airBnbDesktop:mb-6 airBnbDesktop:pr-4 airBnbDesktop:h-auto airBnbDesktop:justify-start ">
                    <div className="flex ">
                        <Link href={`/hosting/properties`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </div>
                    <h1 className="text-[1em]">
                        <span className="pl-8 py-1 text-[2rem] leading-9 tracking-[-0.04rem]">Listing editor</span>
                    </h1>
                </header>
                <div className="relative grow overflow-y-auto">
                    <div className="flex flex-col h-full overflow-hidden">
                        {/* tabs */}
                        <div className="airBnbDesktop:flex airBnbDesktop:items-center airBnbDesktop:py-6 airBnbDesktop:pr-8 airBnbDesktop:pl-[calc(44px+24px)]">
                            <div className="grow">
                                <div className="flex items-center gap-5">
                                    <div className="auto-cols-[1fr] grid-flow-col w-fit space-x-4 bg-accent p-1 rounded-full ">
                                        <Link
                                            href={`/hosting/properties/${params.propertyId}/details`}
                                            className={cn(
                                                buttonVariants(),
                                                "font-normal rounded-full px-8 py-0 hover:text-white dark:hover:text-white",
                                                pathname.includes(`/hosting/properties/${params.propertyId}/details`)
                                                    ? "bg-primary"
                                                    : "bg-transparent text-foreground"
                                            )}
                                        >
                                            Your space
                                        </Link>
                                        <Link
                                            href={`/hosting/properties/${params.propertyId}/arrival-instructions`}
                                            className={cn(
                                                buttonVariants(),
                                                "font-normal rounded-full px-8 py-0 hover:text-white dark:hover:text-white",
                                                pathname === `/hosting/properties/${params.propertyId}/arrival-instructions`
                                                    ? "bg-primary"
                                                    : "bg-transparent text-foreground"
                                            )}
                                        >
                                            Arrival guide
                                        </Link>
                                    </div>
                                    <Link
                                        href={`/hosting/properties/${params.propertyId}/details`}
                                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full shadow-lg p-1")}
                                    >
                                        <Settings2 className="h-5 w-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="grow overflow-hidden">
                            <ScrollArea className="h-[calc(100vh-68px-40px-64px-48px-48px)] w-full">
                                <div className="flex flex-col gap-4 pr-16 pl-[calc(44px+32px)] pt-4 airBnbDesktop:pb-32">{children} </div>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </section>
            <div className="border h-full grow hidden airBnbDesktop:flex airBnbDesktop:overflow-hidden airbnbDesktop:flex-none airBnbDesktop:w-[544px] min-[1128px]:w-[627px] airBnbBigDesktop:grow">
                {right}
            </div>
        </div>
    );
}

export default EditPropertyLayout