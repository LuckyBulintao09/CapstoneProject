import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CustomBreadcrumbs from "@/modules/hosting/components/CustomBreadcrumbs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

function PropertyPage({ params }: { params: { propertyId: string } }) {
    return (
        <>
            <div className="grid grid-cols-2 max-w-7xl mx-auto divide-x ">
                <section className="flex flex-col w-full h-full pt-11">
                    <div className="ml-[calc(32px+40px)]"><CustomBreadcrumbs /></div>
                    <header className="flex items-center justify-centermt-11 mb-[calc(11rem/2rem)]">
                        <div className="flex ">
                            <Link href={`/hosting/properties`} className={cn(buttonVariants({variant: "ghost", size: "icon"}), "rounded-full")}><ArrowLeft className="h-5 w-5"/></Link>
                        </div>
                        <h1 className="text-[1em]"><span className="pl-8 py-1 text-[2rem] leading-9 tracking-[-0.04rem]">Listing editor</span></h1>
                    </header>
                </section>
                <div className="pt-11">col2</div>
            </div>
        </>
    );
}

export default PropertyPage;
