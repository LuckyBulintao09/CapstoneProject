"use client";
import React from "react";

import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";

import CustomBreadcrumbs from "@/modules/hosting/components/CustomBreadcrumbs";

import { ArrowLeft, Eye, Plus, Settings2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";

function EditPropertyLayout({ children, right, params }: { children: React.ReactNode; right: React.ReactNode; params: { propertyId: string } }) {
    const pathname = usePathname();
    const rightHeadingName = pathname.split("/").filter(Boolean).pop();
    return (
        <main className="grow min-h-[100px]">
            <div className="h-[calc(100%-65px)] airBnbDesktop:flex my-0 mx-auto airBnbTablet:h-full">
                <section className="hidden airBnbDesktop:flex-col h-full w-full airBnbDesktop:grow airBnbDesktop:ml-10 airBnbDesktop:border-r airBnbDesktop:flex min-[1128px]:ml-20 airBnbBigDesktop:w-[calc(76px+344px+64px)] airBnbBigDesktop:flex-none">
                    <div className="ml-[calc(32px+40px)]">
                        <CustomBreadcrumbs />
                    </div>
                    <header className="flex items-center justify-between h-12 airBnbDesktop:h-auto airBnbDesktop:justify-start airBnbDesktop:mb-6 airBnbDesktop:pl-0">
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
                            <div className="airBnbDesktop:flex airBnbDesktop:items-center airBnbDesktop:py-6 airBnbDesktop:pr-16 airBnbDesktop:pl-[calc(44px+24px)]">
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
                            </div>
                            <div className="grow overflow-hidden">
                                <ScrollArea className="h-[calc(100vh-68px-40px-64px-48px-48px)] w-full">
                                    <div className="flex flex-col gap-4 pr-16 pl-[calc(44px+32px)] pt-4 airBnbDesktop:pb-32">{children} </div>
                                </ScrollArea>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="h-full grow airBnbDesktop:flex airBnbDesktop:overflow-hidden airbnbDesktop:grow-0 airBnbDesktop:shrink-0 airBnbDesktop:basis-auto airBnbDesktop:w-[544px] min-[1128px]:w-[627px] airBnbBigDesktop:grow">
                    <section className="relative grow h-full">
                        <section className="flex flex-col h-[calc(100vh-68px)] w-full px-6 airBnbDesktop:overflow-x-hidden airBnbDesktop:overflow-y-auto airBnbTablet:px-10 min-[1128px]:px-20 airBnbBigDesktop:px-0">
                            <header className="airBnbDesktop:mx-auto airBnbDesktop:sticky airBnbDesktop:z-[3] airBnbDesktop:top-0 airBnbDesktop:grow-0 airBnbDesktop:shrink-0 airBnbDesktop:basis-auto airBnbDesktop:pb-5 airBnbDesktop:pt-11 bg-background">
                                <div className="flex items-center justify-between w-full px-10 py-6 airBnbDesktop:gap-6 airBnbDesktop:w-[464px] airBnbDesktop:p-0 airBnbBigDesktop:w-[608px] min-[1128px]:w-[512px]">
                                    <div className="flex justify-center ">
                                        <Link
                                            href={`/hosting/properties`}
                                            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full airBnbDesktop:hidden")}
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </Link>
                                        <h2 className="m-0 p-0 text-[1em]">
                                            <span className="p-1 px-0 text-[2rem] leading-9 tracking-[-0.04rem] font-[500]">
                                                {rightHeadingName.charAt(0).toLocaleUpperCase() + rightHeadingName.slice(1)}
                                            </span>
                                        </h2>
                                    </div>
                                    {rightHeadingName === "photos" && (
                                        <div className="flex items-center gap-2 min-w-[16px] airBnbDesktop:min-w-[auto] airBnbDesktop:ml-auto">
                                            <Button className="gap-2 rounded-full" variant="ghost">
                                                <span>Add photos</span>
                                                <Plus className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </header>
                            <div className="airBnbDesktop:flex airBnbDesktop:items-center airBnbDesktop:justify-center px-6 airBnbDesktop:px-0 min-[1128px]:px-0 py-6 pt-0 grow overflow-y-auto airBnbDesktop:pb-10 airBnbDesktop:overflow-y-visible">
                                {right}
                            </div>
                        </section>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default EditPropertyLayout;
