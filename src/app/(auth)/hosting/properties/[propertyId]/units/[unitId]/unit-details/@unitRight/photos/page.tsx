"use server";

import React from "react";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";

import { ArrowLeft } from "lucide-react";

import { getAuthenticatedUser } from "@/utils/supabase/server";

import PhotoUploader from "./_components/unit-photo-uploader";

import { getUnitById } from "@/actions/unit/getUnitById";
import { countUnitImageStorageBucket } from "@/actions/unit/unitImage";
import UnitPhotosContent from "./_components/unit-photos-content";
import UnitPhotoUploader from "./_components/unit-photo-uploader";

async function PhotosPage({ params }: { params: { propertyId: string, unitId: string } }) {
    const unit = await getUnitById(params.unitId);
    const user = await getAuthenticatedUser();
    const photoBucketFileCount = await countUnitImageStorageBucket(user.id, params.propertyId, params.unitId);

    return (
			<section className='flex flex-col h-[calc(100vh-68px)] w-full px-6 airBnbDesktop:overflow-x-hidden airBnbDesktop:overflow-y-auto airBnbTablet:px-10 min-[1128px]:px-20 airBnbBigDesktop:px-0'>
				<header className='airBnbDesktop:mx-auto airBnbDesktop:sticky airBnbDesktop:z-[3] airBnbDesktop:top-0 airBnbDesktop:grow-0 airBnbDesktop:shrink-0 airBnbDesktop:basis-auto airBnbDesktop:pb-5 airBnbDesktop:pt-11'>
					<div className='mt-3 flex items-center justify-between w-full px-6 py-6 airBnbDesktop:gap-6 airBnbDesktop:w-[464px] airBnbDesktop:p-0 airBnbBigDesktop:w-[800px] min-[1128px]:w-[512px]'>
						<div className='flex justify-center gap-2'>
							<Link
								href={`/hosting/properties`}
								className={cn(
									buttonVariants({ variant: 'ghost', size: 'icon' }),
									'airBnbDesktop:hidden rounded-full'
								)}
							>
								<ArrowLeft className='h-5 w-5' />
							</Link>
							<h2 className='m-0 p-0 text-[1em]'>
								<span className='p-1 px-0 text-[1.5rem] font-normal'>
									Photos
								</span>
							</h2>
						</div>
						<div className='flex items-center gap-2 min-w-[16px] airBnbDesktop:min-w-[auto] airBnbDesktop:ml-auto'>
							<UnitPhotoUploader
								propertyId={params.propertyId}
								unitId={params.unitId}
								userId={user?.id}
								photoBucketFileCount={photoBucketFileCount}
							/>
						</div>
					</div>
					{/* <div className=' border-b border-gray-300 '></div> */}
				</header>
				<div className=' px-6 airBnbDesktop:px-0 min-[1128px]:px-0 py-6 pt-0 grow overflow-y-visible airBnbDesktop:pb-10 '>
					<div className='airBnbDesktop:mx-auto airBnbBigDesktop:w-[800px] min-[1128px]:w-[512px] airBnbDesktop:w-[464px]'>
						<div className='font-normal'>
							<div className='text-base leading-5 tracking-normal my-4 lg:mt-0'>
								Manage photos here. Guests will see these photos when they view
								your listing. The first image uploaded will be the cover image.
							</div>
						</div>
						<div className='grid grid-cols-2 gap-5 airBnbDesktop:grid-cols-3 airBnbDesktop:gap-4'>
							{unit && user ? (
								<UnitPhotosContent
									unit={unit}
									propertyId={params.propertyId}
									unitId={params.unitId}
									userId={user?.id}
								/>
							) : (
								<Skeleton className='aspect-square object-cover rounded-lg' />
							)}
						</div>
					</div>
				</div>
			</section>
		);
}



export default PhotosPage;
