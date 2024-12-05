"use client";

import React from "react";

import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { Bed, Box, Check, Eye, LockKeyhole, Ruler, UsersRound, X } from "lucide-react";

import { usePathname } from "next/navigation";
import DeleteUnit from "./DeleteUnit";

function UnitLeftSection({ unit, unitId, propertyId, unit_amenities, unit_additional_amenities }: any) {
    const pathname = usePathname();
    return (
        <>
            <div>
                {/* add some onclick effect */}
                <div
                    className={cn(
                        "border-2 rounded-lg relative p-[22px]",
                        pathname === `/hosting/properties/${propertyId}/units/${unitId}/unit-details/photos`
                            ? "border-primary shadow-xl"
                            : " border-accent"
                    )}
                >
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Photo gallery</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/units/${unitId}/unit-details/photos`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-ellipsis whitespace-pre-line text-muted-foreground">
                            <div className="-mt-1 flex items-center gap-6">
                                {unit?.unit_image && unit?.unit_image.length > 0
                                    ? `${unit?.unit_image?.length} photos`
                                    : "You have 0 photos for this unit right now, consider uploading some."}
                            </div>
                        </div>

                        <div className="flex flex-row items-center justify-center max-w-[294px] relative mt-8 mx-auto">
                            <div className="w-40 overflow-hidden relative z-[1] rounded-xl shadow-lg">
                                <div className="h-auto w-auto bg-cover pt-[100%] bg-center bg-no-repeat">
                                    <div className="left-0 right-0 absolute top-0 bottom-0 flex items-center justify-center ">
                                        <picture>
                                            <source
                                                srcSet={
                                                    unit?.unit_image && unit?.unit_image.length > 0 ? unit?.unit_image[0] : "/placeholderImage.webp"
                                                }
                                                media="(max-width: 0px)"
                                            />
                                            lamao
                                            <Image
                                                src={unit?.unit_image && unit?.unit_image.length > 0 ? unit.unit_image[0] : "/placeholderImage.webp"}
                                                alt={unit?.title || "Thumbnail"}
                                                width={160}
                                                height={160}
                                                className="left-0 right-0 h-full w-full absolute top-0 bottom-0 object-cover overflow-clip"
                                            />
                                        </picture>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden absolute w-[136px] top-[16px] left-[8px] -rotate-2 rounded-xl shadow-lg">
                                <div className="h-auto w-auto bg-cover pt-[100%] bg-center bg-no-repeat">
                                    <div className="left-0 right-0 absolute top-0 bottom-0 flex items-center justify-center ">
                                        <picture>
                                            <source
                                                srcSet={
                                                    unit?.unit_image && unit?.unit_image.length > 0 ? unit?.unit_image[0] : "/placeholderImage.webp"
                                                }
                                                media="(max-width: 0px)"
                                            />
                                            <Image
                                                src={unit?.unit_image && unit?.unit_image.length > 0 ? unit?.unit_image[0] : "/placeholderImage.webp"}
                                                alt={unit?.title}
                                                width={160}
                                                height={160}
                                                className="left-0 right-0 h-full w-full absolute top-0 bottom-0 object-cover overflow-clip"
                                            />
                                        </picture>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-hidden absolute w-[136px] top-[16px] right-[8px] rotate-2 rounded-xl shadow-lg">
                                <div className="h-auto w-auto bg-cover pt-[100%] bg-center bg-no-repeat">
                                    <div className="left-0 right-0 absolute top-0 bottom-0 flex items-center justify-center ">
                                        <picture>
                                            <source
                                                srcSet={
                                                    unit?.unit_image && unit?.unit_image.length > 0
                                                        ? unit?.unit_image[unit?.unit_image.length - 1]
                                                        : "/placeholderImage.webp"
                                                }
                                                media="(max-width: 0px)"
                                            />
                                            <Image
                                                src={
                                                    unit?.unit_image && unit?.unit_image.length > 0
                                                        ? unit?.unit_image[unit?.unit_image.length - 1]
                                                        : "/placeholderImage.webp"
                                                }
                                                alt={unit?.title || "Thumbnail"}
                                                width={160}
                                                height={160}
                                                className="left-0 right-0 h-full w-full absolute top-0 bottom-0 object-cover overflow-clip"
                                            />
                                        </picture>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div
                    className={cn(
                        "border-2 rounded-lg relative p-[22px]",
                        pathname === `/hosting/properties/${propertyId}/units/${unitId}/unit-details/title`
                            ? "border-primary shadow-xl"
                            : " border-accent"
                    )}
                >
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Title</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/units/${unitId}/unit-details/title`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div className="text-[1.375rem] -tracking-[0.01375rem] font-[500] leading-[1.625rem]">{unit?.title}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div
                    className={cn(
                        "border-2 rounded-lg relative p-[22px]",
                        pathname === `/hosting/properties/${propertyId}/units/${unitId}/unit-details/unit-type`
                            ? "border-primary shadow-xl"
                            : " border-accent"
                    )}
                >
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Unit type</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/units/${unitId}/unit-details/unit-type`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div className="pt-2 overflow-clip text-[1rem] tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <LockKeyhole className="w-4 h-4" />
                                        <span>{unit?.privacy_type?.charAt(0).toUpperCase() + unit?.privacy_type?.slice(1)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Ruler className="w-4 h-4" />
                                        <span>{(unit?.room_size).toFixed(2)} m&sup2;</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div
                    className={cn(
                        "border-2 rounded-lg relative p-[22px]",
                        pathname === `/hosting/properties/${propertyId}/units/${unitId}/unit-details/occupancy-specifications`
                            ? "border-primary shadow-xl"
                            : " border-accent"
                    )}
                >
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Occupancy information</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/units/${unitId}/unit-details/occupancy-specifications`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-[1rem] tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <UsersRound className="w-4 h-4" />
                                    <span>{unit?.occupants} occupants</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Box className="w-4 h-4" />
                                    <span>{unit?.bedrooms} bedrooms</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Bed className="w-4 h-4" />
                                    <span>{unit?.beds} beds</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div
                    className={cn(
                        "border-2 rounded-lg relative p-[22px]",
                        pathname === `/hosting/properties/${propertyId}/units/${unitId}/unit-details/amenities`
                            ? "border-primary shadow-xl"
                            : " border-accent"
                    )}
                >
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Amenities</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/units/${unitId}/unit-details/amenities`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-[1rem] tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div className="flex flex-row gap-3 flex-wrap w-[464px]">
                                {unit_amenities?.length > 0 ? (
                                    unit_amenities?.map(({ amenity_id, amenity_name }: { amenity_id: number; amenity_name: string }) => (
                                        <div className="flex items-center gap-1 shrink-0  " key={amenity_id}>
                                            <Check className="w-4 h-4 text-success" />
                                            <span className="text-xs">{amenity_name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <X className="w-4 h-4 text-danger" />
                                        <span className="text-xs">No amenities</span>
                                    </div>
                                )}

                                {unit_additional_amenities?.length > 0 ? (
                                    unit_additional_amenities?.map(({ id, text }: { id: number; text: string }) => (
                                        <div className="flex items-center gap-1 shrink-0  " key={id}>
                                            <Check className="w-4 h-4 text-success" />
                                            <span className="text-xs">{text}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <X className="w-4 h-4 text-danger" />
                                        <span className="text-xs">No additional amenities</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div
                    className={cn(
                        "border-2 rounded-lg relative p-[22px]",
                        pathname === `/hosting/properties/${propertyId}/units/${unitId}/unit-details/price`
                            ? "border-primary shadow-xl"
                            : " border-accent"
                    )}
                >
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Unit price</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/units/${unitId}/unit-details/price`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div className="text-[1.375rem] -tracking-[0.01375rem] font-[500] leading-[1.625rem]">
                                <span>
                                    ₱{" "}
                                    {new Intl.NumberFormat("en-PH", {
                                        style: "decimal",
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(unit.price)}{" "}
                                    (PHP)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <DeleteUnit unitId={unitId} unitTitle={unit?.title} propertyId={propertyId} />
            </div>
        </>
    );
}

export default UnitLeftSection;
