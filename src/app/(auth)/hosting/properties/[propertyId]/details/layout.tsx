// "use client";
import React from "react";

import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";

import CustomBreadcrumbs from "@/modules/hosting/components/CustomBreadcrumbs";

import { ArrowLeft, Eye, Plus, Settings2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";


function EditPropertyLayout({ children, right, params }: { children: React.ReactNode; right: React.ReactNode; params: { propertyId: string } }) {
    // const pathname = usePathname();
    // const rightHeadingName = pathname.split("/").filter(Boolean).pop();
    // const property = await getPropertyById(params.propertyId);
    // const units = await getAllUnitUnderProperty(params.propertyId);
    return (
        <main className="grow min-h-[100px]">
            <div className="h-[calc(100%-65px)] airBnbDesktop:flex my-0 mx-auto airBnbTablet:h-full">
                <section className="hidden airBnbDesktop:flex-col h-[calc(100vh-70px)] w-full airBnbDesktop:grow airBnbDesktop:ml-10 airBnbDesktop:border-r airBnbDesktop:flex min-[1128px]:ml-20 airBnbBigDesktop:w-[calc(76px+344px+64px)] airBnbBigDesktop:flex-none">
                    <div className="ml-[calc(32px+40px)] mt-4">
                        <CustomBreadcrumbs />
                    </div>
                    <header className="flex items-center justify-between h-12 airBnbDesktop:h-auto airBnbDesktop:justify-start airBnbDesktop:mb-6 airBnbDesktop:pl-0">
                        <div className="flex ">
                            <Link href={`/hosting/properties`} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </div>
                        <h1 className="text-[1em]">
                            <span className="pl-8 py-1 text-[2rem] font-semibold">Listing editor</span>
                        </h1>
                    </header>

                    <div className="relative grow overflow-y-auto">
                        <div className="flex flex-col h-full overflow-hidden">
                            {/* tabs */}
                            {/* <div className="airBnbDesktop:flex airBnbDesktop:items-center airBnbDesktop:py-6 airBnbDesktop:pr-16 airBnbDesktop:pl-[calc(44px+24px)]">
                                <div className="grow">
                                    <div className="flex items-center gap-5">
                                        <div className="grid auto-cols-[1fr] grid-flow-col w-full space-x-4 bg-accent p-1 rounded-full ">
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
                                    </div>
                                </div>
                                <Link
                                    href={`/hosting/properties/${params.propertyId}/details`}
                                    className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full shadow-lg p-1 ml-2")}
                                >
                                    <Settings2 className="h-5 w-5" />
                                </Link>
                            </div> */}
                            <div className="grow overflow-hidden">
                                <ScrollArea className="h-[calc(100vh-68px-64px-40px-48px)] w-full">
                                    <div className="flex flex-col gap-4 pr-16 pl-[calc(44px+32px)] pt-4 airBnbDesktop:pb-32">{children} </div>
                                </ScrollArea>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="h-full grow airBnbDesktop:flex airBnbDesktop:overflow-hidden airbnbDesktop:grow-0 airBnbDesktop:shrink-0 airBnbDesktop:basis-auto airBnbDesktop:w-[544px] min-[1128px]:w-[627px] airBnbBigDesktop:grow">
                    <section className="relative grow h-full">{right}</section>
                </div>
            </div>
        </main>
    );
}

export default EditPropertyLayout;
