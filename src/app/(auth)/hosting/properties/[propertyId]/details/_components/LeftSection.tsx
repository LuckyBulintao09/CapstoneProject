"use client";

import React from "react";

import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { Eye } from "lucide-react";

import MapLocation from "../@right/_components/MapLocation";
import { usePathname } from "next/navigation";

function LeftSection({ property, units, location, propertyId }: any) {
    const pathname = usePathname();
    return (
        <>
            <div>
                {/* add some onclick effect */}
                <div className={cn("border-2 rounded-lg relative p-[22px]", pathname === `/hosting/properties/${propertyId}/details/photos` ? "border-primary shadow-xl" : " border-accent")}>
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Photo gallery</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/details/photos`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-ellipsis whitespace-pre-line text-muted-foreground">
                            <div className="-mt-1 flex items-center gap-6">
                                {property?.property_image && property.property_image.length > 0
                                    ? `${property.property_image?.length} photos`
                                    : "You have 0 photos for this property right now, consider uploading some."}
                            </div>
                        </div>

                        <div className="flex flex-row items-center justify-center max-w-[294px] relative mt-8 mx-auto">
                            <div className="w-40 overflow-hidden relative z-[1] rounded-xl shadow-lg">
                                <div className="h-auto w-auto bg-cover pt-[100%] bg-center bg-no-repeat">
                                    <div className="left-0 right-0 absolute top-0 bottom-0 flex items-center justify-center ">
                                        <picture>
                                            <source
                                                srcSet={
                                                    property?.property_image && property.property_image.length > 0
                                                        ? property.property_image[0]
                                                        : "/placeholderImage.webp"
                                                }
                                                media="(max-width: 0px)"
                                            />
                                            lamao
                                            <Image
                                                src={
                                                    property?.property_image && property.property_image.length > 0
                                                        ? property.property_image[0]
                                                        : "/placeholderImage.webp"
                                                }
                                                alt={property.title || "Thumbnail"}
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
                                                    property?.property_image && property.property_image.length > 0
                                                        ? property.property_image[0]
                                                        : "/placeholderImage.webp"
                                                }
                                                media="(max-width: 0px)"
                                            />
                                            <Image
                                                src={
                                                    property?.property_image && property.property_image.length > 0
                                                        ? property.property_image[0]
                                                        : "/placeholderImage.webp"
                                                }
                                                alt={property.title}
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
                                                    property?.property_image && property.property_image.length > 0
                                                        ? property.property_image[property.property_image.length - 1]
                                                        : "/placeholderImage.webp"
                                                }
                                                media="(max-width: 0px)"
                                            />
                                            <Image
                                                src={
                                                    property?.property_image && property.property_image.length > 0
                                                        ? property.property_image[property.property_image.length - 1]
                                                        : "/placeholderImage.webp"
                                                }
                                                alt={property.title || "Thumbnail"}
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
                <div className={cn("border-2 rounded-lg relative p-[22px]", pathname === `/hosting/properties/${propertyId}/details/title` ? "border-primary shadow-xl" : " border-accent")}>
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Title</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/details/title`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div className="text-[1.375rem] -tracking-[0.01375rem] font-[500] leading-[1.625rem]">{property.title}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className={cn("border-2 rounded-lg relative p-[22px]", pathname === `/hosting/properties/${propertyId}/details/property-type` ? "border-primary shadow-xl" : " border-accent")}>
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Property type</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/details/property-type`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-[1rem] tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div>{property.structure}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className={cn("border-2 rounded-lg relative p-[22px]", pathname === `/hosting/properties/${propertyId}/details/description` ? "border-primary shadow-xl" : " border-accent")}>
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Description</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/details/description`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-[1rem] tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div>{property.description}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className={cn("border-2 rounded-lg relative p-[22px]", pathname === `/hosting/properties/${propertyId}/details/location` ? "border-primary shadow-xl" : " border-accent")}>
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Location</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/details/location`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-[1rem] tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div>{property.address}</div>
                        </div>
                        <div className="flex flex-row items-center justify-center relative mt-2">
                            <MapLocation location={location} />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className={cn("border-2 rounded-lg relative p-[22px]", pathname === `/hosting/properties/${propertyId}/details/documents` ? "border-primary shadow-xl" : " border-accent")}>
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Documents</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/details/documents`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-[1rem] tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div>{property.business_permit ? "Business permit added" : "No documents added"}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className={cn("border-2 rounded-lg relative p-[22px]", pathname === `/hosting/properties/${propertyId}/details/units` ? "border-primary shadow-xl" : " border-accent")}>
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Units</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/details/units`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-[1rem] tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div>{`${units.length} units added`}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute left-[calc(44px+32px)] right-[64px] mx-auto my-0 bottom-[40px] w-max z-[3] ">
                <Link
                    // href={`/hosting/properties/${params.propertyId}/view-your-space`}
                    href={`/property/${propertyId}`}
                    className={cn(buttonVariants({ variant: "default" }), "rounded-full space-x-2")}
                >
                    <Eye className="h-5 w-5" />
                    <span>View</span>
                </Link>
            </div>
        </>
    );
}

export default LeftSection;
