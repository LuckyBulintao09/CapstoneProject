import React from "react";

import Image from "next/image";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { getPropertyById } from "@/actions/property/get-property-by-id";
import Link from "next/link";

async function PropertyDetailsPage({ params }: { params: { propertyId: string } }) {
    const property = await getPropertyById(params.propertyId);
    console.log(property[0]);
    return (
        <div className="flex flex-col gap-4 items-center justify-center">
            <div className="flex gap-4 items-center">
                <Link href={`/hosting/properties/17/details/photos`}>
                    <Card className="cursor-pointer w-fit h-full shadow-xl">
                        <CardHeader className="space-y-0">
                            <CardTitle className="text-[1rem] leading-5 tracking-normal font-[500]">Photo gallery</CardTitle>
                            <CardDescription>
                                {property[0].property_image.length + 1}
                                {" photos"}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex items-center relative h-full p-6 pt-0">
                            <Image
                                src={property[0].property_image[0]}
                                alt={property[0].title}
                                width={1524}
                                height={2032}
                                className="rounded-xl object-cover aspect-square select-none size-48 transform scale-85 translate-x-1/3 -rotate-2 z-0"
                            />

                            <Image
                                src={property[0].thumbnail_url}
                                alt={property[0].title}
                                width={1524}
                                height={2032}
                                className="rounded-xl object-cover aspect-square select-none size-48 z-10"
                            />

                            <Image
                                src={property[0].property_image[property[0].property_image.length - 1]}
                                alt={property[0].title}
                                width={1524}
                                height={2032}
                                className="rounded-xl object-cover aspect-square select-none size-48 transform scale-85 -translate-x-1/3 rotate-2 z-0"
                            />
                        </CardContent>
                    </Card>
                </Link>
                <Link href={`/hosting/properties/17/details/title`}>title</Link>
                <Link href={`/hosting/properties/17/details/property-type`}>property type</Link>
                <Link href={`/hosting/properties/17/details/pricing`}>pricing</Link>
                <Link href={`/hosting/properties/17/details/occupants`}>occupants</Link>
                <Link href={`/hosting/properties/17/details/description`}>description</Link>
                <Link href={`/hosting/properties/17/details/amenities`}>amenities</Link>
                <Link href={`/hosting/properties/17/details/location`}>location</Link>
                <Link href={`/hosting/properties/17/details/house-rules`}>house rules</Link>
            </div>
            {/* photos */}
            {/* <Dialog>
                <DialogTrigger asChild>
                    
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog> */}
        </div>
    );
}

export default PropertyDetailsPage;
