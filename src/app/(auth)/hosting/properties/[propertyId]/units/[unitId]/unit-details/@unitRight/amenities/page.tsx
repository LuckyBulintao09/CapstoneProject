import React from "react";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { ArrowLeft } from "lucide-react";

import UnitAmenitiesForm from "./_components/UnitAmenitiesForm";

import { getUnitAdditionalAmenities, getUnitAmenities } from "@/actions/unit/get-unit-amenities";
import { getAllAmenities } from "@/actions/amenety/getAllAmenities";

async function UnitAmenitiesPage({ params }: { params: { propertyId: string; unitId: string } }) {
    const data = await getUnitAmenities(params.unitId);
    const allAmenitiesData = await getAllAmenities();
    const additionalAmmenitiesData = await getUnitAdditionalAmenities(params.unitId);
    // console.log(additionalAmmenitiesData, "data");
    return (
        <section className="flex flex-col h-[calc(100vh-68px)] w-full px-6 airBnbDesktop:overflow-x-hidden airBnbDesktop:overflow-y-auto airBnbTablet:px-10 min-[1128px]:px-20 airBnbBigDesktop:px-0">
            <header className="airBnbDesktop:mx-auto airBnbDesktop:sticky airBnbDesktop:z-[3] airBnbDesktop:top-0 airBnbDesktop:grow-0 airBnbDesktop:shrink-0 airBnbDesktop:basis-auto airBnbDesktop:pb-5 airBnbDesktop:pt-11 bg-background">
                <div className="flex items-center justify-between w-full px-10 py-6 airBnbDesktop:gap-6 airBnbDesktop:w-[464px] airBnbDesktop:p-0 airBnbBigDesktop:w-[608px] min-[1128px]:w-[512px]">
                    <div className="flex justify-center items-center gap-2">
                        <Link
                            href={`/hosting/properties`}
                            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full airBnbDesktop:hidden")}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h2 className="m-0 p-0 text-[1em]">
                            <span className="p-1 px-0 text-[2rem] leading-9 tracking-[-0.04rem] font-[500]">Unit amenities</span>
                        </h2>
                    </div>
                </div>
            </header>

            <div className="grow py-6 airBnbDesktop:pt-0 airBnbDesktop:pb-10">
                <div className="airBnbDesktop:mx-auto airairBnbBigDesktop:w-[608px] min-[1128px]:w-[512px] airBnbDesktop:w-[464px]">
                    <div className="font-normal">
                        <div className="text-base leading-5 tracking-normal my-4 lg:mt-0">
                            Change your unit&apos;s amenities here. Click save when you&apos;re done.
                        </div>
                    </div>
                    <UnitAmenitiesForm unitId={params.unitId} amenities={data} allAmenities={allAmenitiesData} additionalAmenities={additionalAmmenitiesData} />
                </div>
            </div>
        </section>
    );
}

export default UnitAmenitiesPage;
