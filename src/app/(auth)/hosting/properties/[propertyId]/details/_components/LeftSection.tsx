"use client";

import React from "react";

import Image from "next/image";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { Check, Eye, TriangleAlert, X } from "lucide-react";

import MapLocation from "../@right/_components/MapLocation";

import { usePathname, useRouter } from "next/navigation";
import DeleteProperty from "./DeleteProperty";
import { createClient } from "@/utils/supabase/client";
import { checkPropertyDocuments } from "@/actions/property/propertyDocuments";
import Reapplication from "./Reapplication";

function LeftSection({ property, units, location, propertyId, property_house_rules, propertyAmenities, businessPermit, fireInspection, documentsStatus, userId }: any) {
    const pathname = usePathname();
    const supabase = createClient();
    const router = useRouter();
    const lastPayloadRef = React.useRef(null);
    
    React.useEffect(() => {
        const channel = supabase
            .channel("public-property")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "property",
                },
                (payload: any) => {
                    if (JSON.stringify(lastPayloadRef.current) !== JSON.stringify(payload)) {
                        lastPayloadRef.current = payload;
                        router.refresh();
                    }
                }
            )
            .subscribe();
            
        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, router]);

    console.log(documentsStatus, "left section");

    return (
        <>
            {property?.isApproved === "missing" || property?.isApproved === "rejected" ? (
                <div>
                    <div
                        className={cn("border rounded-lg relative p-[22px] shadow-xl", {
                            "border-destructive bg-destructive/20": property?.isApproved === "rejected",
                            "border-orange-500": property?.isApproved === "missing",
                        })}
                    >
                        <div className="flex flex-row items-center gap-2">
                            <div
                                className={cn("h-2 w-2 rounded-full", {
                                    "bg-destructive": property?.isApproved === "rejected",
                                    "bg-orange-500": property?.isApproved === "missing",
                                })}
                            />
                            <span className="text-[1rem] leading-5 tracking-normal font-[500]">
                                Complete required steps
                            </span>
                        </div>
                        <Link
                            href={`/hosting/properties/${propertyId}/details/documents`}
                            className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                        ></Link>
                        <div>
                            <div className="pt-2 overflow-clip text-sm tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-foreground">
                                <div>
                                    <p className="break-words w-[464px]">
                                        Finish these final tasks to publish your property.{" "}
                                        <span className={cn({"hidden": property?.isApproved !== "rejected"})}>
                                            If your property is rejected without reason, please contact{" "}
                                            <strong className="relative z-[3] cursor-text h-auto w-auto underline">
                                                unihomes2024@gmail.com
                                            </strong>
                                        </span>
                                    </p>
                                </div>
                                <ul className="mt-2">
                                    {property?.isApproved === "missing" && (
                                        <li className="flex flex-row items-center gap-2">
                                            <TriangleAlert className="h-4 w-4 mt-[2px]" />
                                            <span className="text-[0.875rem] leading-5 tracking-normal font-[400]">
                                                Add property documents
                                            </span>
                                        </li>
                                    )}
                                    {property?.isApproved === "rejected" && (
                                        <>
                                            <li className="flex flex-row items-start gap-2">
                                                <TriangleAlert className="h-4 w-4 mt-[2px]" />
                                                <span className="text-[0.875rem] leading-5 tracking-normal font-[400]">
                                                    {property?.decline_reason}
                                                </span>
                                            </li>
                                            <li className="mt-3 relative z-[4] w-fit h-fit">
                                                <Reapplication propertyId={propertyId} propertyTitle={property?.title} documentsStatus={documentsStatus} userId={userId} classNames=" h-auto w-auto" />
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            <div>
                {/* add some onclick effect */}
                <div
                    className={cn(
                        "border-2 rounded-lg relative p-[22px]",
                        pathname === `/hosting/properties/${propertyId}/details/photos`
                            ? "border-primary shadow-xl"
                            : " border-accent"
                    )}
                >
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Photo gallery</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/details/photos`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-ellipsis whitespace-pre-line text-muted-foreground">
                            <div className="-mt-1 flex items-center gap-6">
                                {property?.property_image && property?.property_image.length > 0
                                    ? `${property?.property_image?.length} photos`
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
                                                    property?.property_image && property?.property_image.length > 0
                                                        ? property?.property_image[0]
                                                        : "/placeholderImage.webp"
                                                }
                                                media="(max-width: 0px)"
                                            />
                                            lamao
                                            <Image
                                                src={
                                                    property?.property_image && property?.property_image.length > 0
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
                                                    property?.property_image && property?.property_image.length > 0
                                                        ? property?.property_image[0]
                                                        : "/placeholderImage.webp"
                                                }
                                                media="(max-width: 0px)"
                                            />
                                            <Image
                                                src={
                                                    property?.property_image && property?.property_image.length > 0
                                                        ? property?.property_image[0]
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
                                                    property?.property_image && property?.property_image.length > 0
                                                        ? property?.property_image[property?.property_image.length - 1]
                                                        : "/placeholderImage.webp"
                                                }
                                                media="(max-width: 0px)"
                                            />
                                            <Image
                                                src={
                                                    property?.property_image && property?.property_image.length > 0
                                                        ? property?.property_image[property?.property_image.length - 1]
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
                <div
                    className={cn(
                        "border-2 rounded-lg relative p-[22px]",
                        pathname === `/hosting/properties/${propertyId}/details/title`
                            ? "border-primary shadow-xl"
                            : " border-accent"
                    )}
                >
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Title</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/details/title`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div className="text-[1.375rem] -tracking-[0.01375rem] font-[500] leading-[1.625rem]">
                                {property?.title}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div
                    className={cn(
                        "border-2 rounded-lg relative p-[22px]",
                        pathname === `/hosting/properties/${propertyId}/details/property-type`
                            ? "border-primary shadow-xl"
                            : " border-accent"
                    )}
                >
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Property details</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/details/property-type`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-[1rem] tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div className="flex flex-col gap-3">
                                <div>{`${property.structure.charAt(0).toUpperCase()}${property.structure.slice(
                                    1
                                )}`}</div>
                                <div className="flex flex-row flex-wrap gap-2 shrink-0 w-full max-w-[464px] h-full max-h-[200px]">
                                    {propertyAmenities?.length > 0 ? (
                                        propertyAmenities?.map(
                                            ({
                                                amenity_id,
                                                amenity_name,
                                            }: {
                                                amenity_id: number;
                                                amenity_name: string;
                                            }) => (
                                                <div className="flex items-center gap-1 shrink-0  " key={amenity_id}>
                                                    <Check className="w-4 h-4 text-success" />
                                                    <span className="text-xs">{amenity_name}</span>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <X className="w-4 h-4 text-danger" />
                                            <span className="text-xs">No amenities</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-row flex-wrap w-full max-w-[464px] h-full max-h-[200px] gap-2">
                                    <div className="w-[464px] max-h-[200px] overflow-y-auto rounded-md z-[4]">
                                        {property_house_rules?.length > 0 ? (
                                            <ul className="space-y-1">
                                                {property_house_rules.map(
                                                    ({ id, rule }: { id: number; rule: string }) => (
                                                        <li className="flex items-center gap-2" key={id}>
                                                            <TriangleAlert className="w-4 h-4 text-warning" />
                                                            <span className="text-sm">{rule}</span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <X className="w-4 h-4 text-danger" />
                                                <span className="text-sm">This property has no house rules</span>
                                            </div>
                                        )}
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
                        pathname === `/hosting/properties/${propertyId}/details/description`
                            ? "border-primary shadow-xl"
                            : " border-accent"
                    )}
                >
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Description</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/details/description`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-[1rem] tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div>
                                <p className="break-words w-[464px]">{property?.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div
                    className={cn(
                        "border-2 rounded-lg relative p-[22px]",
                        pathname === `/hosting/properties/${propertyId}/details/location`
                            ? "border-primary shadow-xl"
                            : " border-accent"
                    )}
                >
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Location</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/details/location`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-[1rem] tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div>{property?.address}</div>
                        </div>
                        <div className="flex flex-row items-center justify-center relative mt-2">
                            <MapLocation location={location} />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div
                    className={cn(
                        "border-2 rounded-lg relative p-[22px]",
                        pathname === `/hosting/properties/${propertyId}/details/documents`
                            ? "border-primary shadow-xl"
                            : " border-accent"
                    )}
                >
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Documents</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/details/documents`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-[1rem] tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div className="grow space-y-2">
                                <ul className="list-none text-sm text-muted-foreground">
                                    <li className="flex gap-1 items-center">
                                        {property?.business_permit ? (
                                            <Check className="shrink-0 text-success w-5 h-5" />
                                        ) : (
                                            <X className="shrink-0 text-danger w-5 h-5" />
                                        )}
                                        <span>Business permit</span>
                                    </li>
                                    <li className="flex gap-1 items-center">
                                        {property?.fire_inspection ? (
                                            <Check className="shrink-0 text-success w-5 h-5" />
                                        ) : (
                                            <X className="shrink-0 text-danger w-5 h-5" />
                                        )}
                                        <span>Fire safety permit</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div
                    className={cn(
                        "border-2 rounded-lg relative p-[22px]",
                        pathname === `/hosting/properties/${propertyId}/details/units`
                            ? "border-primary shadow-xl"
                            : " border-accent"
                    )}
                >
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Units</span>
                    <Link
                        href={`/hosting/properties/${propertyId}/details/units`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-[1rem] tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div>{`${units} unit(s) added`}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <DeleteProperty propertyId={propertyId} propertyTitle={property?.title} />
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
