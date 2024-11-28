import { getAllUnitUnderProperty } from "@/actions/unit/getAllUnitUnderProperty";
import React from "react";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

async function PropertiesUnitsPage({ params }: { params: { propertyId: string } }) {
    const units = await getAllUnitUnderProperty(params.propertyId);
    console.log(units);
    return (
        <div className="flex items-center justify-center grow py-6 airBnbDesktop:pt-0 airBnbDesktop:pb-10">
            <div className="airBnbDesktop:mx-auto airairBnbBigDesktop:w-[608px] min-[1128px]:w-[512px] airBnbDesktop:w-[464px]">
                <div className="flex flex-col justify-center gap-4">
                    <Link
                        href={`/hosting/properties/${params.propertyId}/units/add-a-unit`}
                        className={cn(buttonVariants({ variant: "default" }), "gap-2 w-fit")}
                    >
                        <span>Add new unit</span>
                        <Plus className="h-4 w-4" />
                    </Link>
                    {units?.length > 0 ? (
                        units.map((unit) => (
                            <div key={unit.id} className="flex items-center shadow-xl border rounded-lg p-4 gap-4">
                                <Link
                                    href={`/hosting/properties/17/units/edit-unit/${unit?.id}`}
                                    className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                                ></Link>
                                <div className="flex-shrink-0">
                                    <Image
                                        src={unit.thumbnail_url || "/placeholder-image.png"}
                                        alt={unit.title || "Unit Thumbnail"}
                                        width={64}
                                        height={64}
                                        className="rounded object-cover aspect-square"
                                    />
                                </div>
                                <div>
                                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">{unit.title || "Untitled Unit"}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No units available for this property.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PropertiesUnitsPage;
