import React from "react";

import Image from "next/image";
import Link from "next/link";

import { getAllUnitUnderProperty } from "@/actions/unit/getAllUnitUnderProperty";

import { Button, buttonVariants } from "@/components/ui/button";

import { Plus, ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";


async function PropertiesUnitsPage({ params }: { params: { propertyId: string } }) {
    const units = await getAllUnitUnderProperty(params.propertyId);

    return (
			<section className='flex flex-col h-[calc(100vh-68px)] w-full px-6 airBnbDesktop:overflow-x-hidden airBnbDesktop:overflow-y-auto airBnbTablet:px-10 min-[1128px]:px-20 airBnbBigDesktop:px-0'>
				<header className='airBnbDesktop:mx-auto airBnbDesktop:sticky airBnbDesktop:z-[3] airBnbDesktop:top-0 airBnbDesktop:grow-0 airBnbDesktop:shrink-0 airBnbDesktop:basis-auto airBnbDesktop:pb-5 airBnbDesktop:pt-11 bg-background'>
					<div className='flex items-center justify-between w-full px-10 py-6 airBnbDesktop:gap-6 airBnbDesktop:w-[464px] airBnbDesktop:p-0 airBnbBigDesktop:w-[608px] min-[1128px]:w-[512px]'>
						<div className='flex justify-center'>
							<Link
								href={`/hosting/properties`}
								className={cn(
									buttonVariants({ variant: 'ghost', size: 'icon' }),
									'rounded-full airBnbDesktop:hidden'
								)}
							>
								<ArrowLeft className='h-5 w-5' />
							</Link>
							<h2 className='m-0 p-0 text-[1em]'>
								<span className='p-1 px-0 text-[2rem] leading-9 tracking-[-0.04rem] font-[500]'>
									Units
								</span>
							</h2>
						</div>
						<div className='flex items-center gap-2 min-w-[16px] airBnbDesktop:min-w-[auto] airBnbDesktop:ml-auto'>
							<Link
								href={`/hosting/properties/${params.propertyId}/units/add-a-unit`}
								className={cn(
									buttonVariants({ variant: 'ghost' }),
									'gap-2 w-fit rounded-full'
								)}
							>
								<span>Add new unit</span>
								<Plus className='h-4 w-4' />
							</Link>
						</div>
					</div>
				</header>
				<div className='flex justify-center grow py-6 airBnbDesktop:pt-0 airBnbDesktop:pb-10'>
					<div className='airBnbDesktop:mx-auto airairBnbBigDesktop:w-[608px] min-[1128px]:w-[512px] airBnbDesktop:w-[464px]'>
						<div className='flex flex-col justify-center gap-4'>
							{units?.length > 0 ? (
								units.map((unit) => (
									<div
										key={unit.id}
										className='flex items-center shadow-xl border rounded-lg p-4 gap-4 relative'
									>
										<Link
											href={`/hosting/properties/${params.propertyId}/units/edit-unit/${unit?.id}`}
											className='left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none'
										></Link>
										<div className='flex-shrink-0'>
											<Image
												src={
													unit.thumbnail_url
														? unit.thumbnail_url
														: '/placeholderImage.webp'
												}
												alt={unit.title}
												width={64}
												height={64}
												className='rounded object-cover aspect-square'
											/>
										</div>
										<div>
											<span className='text-[1rem] leading-5 tracking-normal font-[500]'>
												{unit.title || 'Untitled Unit'}
											</span>
										</div>
									</div>
								))
							) : (
								<p className='text-center text-gray-500'>
									No units available for this property.
								</p>
							)}
						</div>
					</div>
				</div>
			</section>
		);
}

export default PropertiesUnitsPage;
