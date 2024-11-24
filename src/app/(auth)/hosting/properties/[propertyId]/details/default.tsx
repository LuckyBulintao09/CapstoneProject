import React from "react";

import Image from "next/image";
import { getPropertyById } from "@/actions/property/get-property-by-id";
import Link from "next/link";

async function PropertyDetailsPage({ params }: { params: { propertyId: string } }) {
    const property = await getPropertyById(params.propertyId);
    console.log(property[0]);
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
                        <div className="pt-2 overflow-clip text-ellipsis whitespace-pre-line">
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
                                            <source srcSet={property[0].thumbnail_url} media="(max-width: 0px)"/>
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
                                            <source srcSet={property[0].property_image[0]} media="(max-width: 0px)"/>
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
                                            <source srcSet={property[0].property_image[property[0].property_image.length - 1]} media="(max-width: 0px)"/>
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
            <Link href={`/hosting/properties/17/details/title`}>title</Link>
            <Link href={`/hosting/properties/17/details/property-type`}>property type</Link>
            <Link href={`/hosting/properties/17/details/pricing`}>pricing</Link>
            <Link href={`/hosting/properties/17/details/occupants`}>occupants</Link>
            <Link href={`/hosting/properties/17/details/description`}>description</Link>
            <Link href={`/hosting/properties/17/details/amenities`}>amenities</Link>
            <Link href={`/hosting/properties/17/details/location`}>location</Link>
            <Link href={`/hosting/properties/17/details/house-rules`}>house rules</Link>
        </>
    );
}

export default PropertyDetailsPage;
