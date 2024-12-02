"use server";

import React from "react";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { ArrowLeft } from "lucide-react";

import { getAuthenticatedUser } from "@/utils/supabase/server";
import { getPropertyById } from "@/actions/property/get-property-by-id";
import { countPropertyImageStorageBucket } from "@/actions/property/propertyImage";

import PhotoUploader from "./_components/photo-uploader";
import PhotosContent from "./_components/photos-content";
import { Skeleton } from "@/components/ui/skeleton";

async function PhotosPage({ params }: { params: { propertyId: string } }) {
    const property = await getPropertyById(params.propertyId);
    
    const user = await getAuthenticatedUser();
    const photoBucketFileCount = await countPropertyImageStorageBucket(user.id, params.propertyId);

    return (
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
                            <span className="p-1 px-0 text-[2rem] leading-9 tracking-[-0.04rem] font-[500]">Photos</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 min-w-[16px] airBnbDesktop:min-w-[auto] airBnbDesktop:ml-auto">
                        <PhotoUploader propertyId={params.propertyId} userId={user?.id} photoBucketFileCount={photoBucketFileCount} />
                    </div>
                </div>
            </header>
            <div className=" px-6 airBnbDesktop:px-0 min-[1128px]:px-0 py-6 pt-0 grow overflow-y-auto airBnbDesktop:pb-10 airBnbDesktop:overflow-y-visible">
                <div className="airBnbDesktop:mx-auto airBnbBigDesktop:w-[608px] min-[1128px]:w-[512px] airBnbDesktop:w-[464px]">
                    <div className="mb-6 font-normal airBnbDesktop:mb-12">
                        <div className="text-[1rem] leading-5 tracking-normal my-0">
                            Manage photos here. Guests will see these photos when they view your listing. The first image uploaded will be the cover image.
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 airBnbDesktop:grid-cols-3 airBnbDesktop:gap-4">
                        {(property && user) ? (
                            <PhotosContent property={property} propertyId={params.propertyId} userId={user?.id} />
                        ) : (
                            <Skeleton className="aspect-square object-cover rounded-lg" />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}



export default PhotosPage;
