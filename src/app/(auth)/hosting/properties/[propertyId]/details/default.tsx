import React from "react";

import Image from "next/image";
import { getPropertyById } from "@/actions/property/get-property-by-id";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import { getAllUnitUnderProperty } from "@/actions/unit/getAllUnitUnderProperty";

async function PropertyDetailsPage({ params }: { params: { propertyId: string } }) {
    const property = await getPropertyById(params.propertyId);
    const units = await getAllUnitUnderProperty(params.propertyId);

    console.log(units.length);
    return (
        <>
            <div>
                {/* add some onclick effect */}
                <div className="shadow-xl border rounded-lg relative p-[22px]">
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Photo gallery</span>
                    <Link
                        href={`/hosting/properties/17/details/photos`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-ellipsis whitespace-pre-line text-muted-foreground">
                            <div className="-mt-1 flex items-center gap-6">
                                {property[0].property_image.length + 1}
                                {" photos"}
                            </div>
                        </div>

                        <div className="flex flex-row items-center justify-center max-w-[294px] relative mt-8 mx-auto">
                            <div className="w-40 overflow-hidden relative z-[1] rounded-xl shadow-lg">
                                <div className="h-auto w-auto bg-cover pt-[100%] bg-center bg-no-repeat">
                                    <div className="left-0 right-0 absolute top-0 bottom-0 flex items-center justify-center ">
                                        <picture>
                                            <source srcSet={property[0].thumbnail_url} media="(max-width: 0px)" />
                                            <Image
                                                src={property[0].thumbnail_url}
                                                alt={property[0].title}
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
                                            <source srcSet={property[0].property_image[0]} media="(max-width: 0px)" />
                                            <Image
                                                src={property[0].property_image[0]}
                                                alt={property[0].title}
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
                                                srcSet={property[0].property_image[property[0].property_image.length - 1]}
                                                media="(max-width: 0px)"
                                            />
                                            <Image
                                                src={property[0].property_image[property[0].property_image.length - 1]}
                                                alt={property[0].title}
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
                <div className="shadow-xl border rounded-lg relative p-[22px]">
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Title</span>
                    <Link
                        href={`/hosting/properties/17/details/title`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div className="text-[1.375rem] -tracking-[0.01375rem] font-[500] leading-[1.625rem]">{property[0].title}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="shadow-xl border rounded-lg relative p-[22px]">
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Property type</span>
                    <Link
                        href={`/hosting/properties/17/details/property-type`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-[1rem] tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div>{property[0].structure}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="shadow-xl border rounded-lg relative p-[22px]">
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Description</span>
                    <Link
                        href={`/hosting/properties/17/details/description`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-[1rem] tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div>{property[0].description}</div>
                        </div>
                    </div>
                </div>
            </div>


            <div>
                <div className="shadow-xl border rounded-lg relative p-[22px]">
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Location</span>
                    <Link
                        href={`/hosting/properties/17/details/location`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-[1rem] tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div>{property[0].address}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="shadow-xl border rounded-lg relative p-[22px]">
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">House rules</span>
                    <Link
                        href={`/hosting/properties/17/details/house-rules`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-[1rem] tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div>{"bawal umihi dito"}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="shadow-xl border rounded-lg relative p-[22px]">
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Documents</span>
                    <Link
                        href={`/hosting/properties/17/details/documents`}
                        className="left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                    ></Link>
                    <div>
                        <div className="pt-2 overflow-clip text-[1rem] tracking-normal leading-5 text-ellipsis font-normal whitespace-pre-line text-muted-foreground">
                            <div>{"3 documents submitted"}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="shadow-xl border rounded-lg relative p-[22px]">
                    <span className="text-[1rem] leading-5 tracking-normal font-[500]">Units</span>
                    <Link
                        href={`/hosting/properties/17/details/units`}
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
                    href={`/hosting/properties/${params.propertyId}/view-your-space`}
                    className={cn(
                        buttonVariants({ variant: "default" }),
                        "rounded-full space-x-2"
                    )}
                >
                    <Eye className="h-5 w-5" />
                    <span>View</span>
                </Link>
            </div>
        </>
    );
}

export default PropertyDetailsPage;
