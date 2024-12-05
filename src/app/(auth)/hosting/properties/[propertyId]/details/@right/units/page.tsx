import React from "react";

import Image from "next/image";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";

import { Plus, ArrowLeft, Frown } from "lucide-react";

import { cn } from "@/lib/utils";
import NumberOfUnits from "./_components/NumberOfUnits";
import UnitList from "./_components/UnitList";

async function PropertiesUnitsPage({ params }: { params: { propertyId: string } }) {

    return (
			<section className='flex flex-col h-[calc(100vh-68px)] w-full px-6 airBnbDesktop:overflow-x-hidden airBnbDesktop:overflow-y-auto airBnbTablet:px-10 min-[1128px]:px-20 airBnbBigDesktop:px-0'>
				<header className='airBnbDesktop:mx-auto airBnbDesktop:sticky airBnbDesktop:z-[3] airBnbDesktop:top-0 airBnbDesktop:grow-0 airBnbDesktop:shrink-0 airBnbDesktop:basis-auto airBnbDesktop:pb-5 airBnbDesktop:pt-11 bg-background'>
					<div className='mt-3 flex items-center justify-between w-full px-10 py-6 airBnbDesktop:gap-6 airBnbDesktop:w-[464px] airBnbDesktop:p-0 airBnbBigDesktop:w-[800px] min-[1128px]:w-[512px]'>
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
								<span className='p-1 px-0 text-[1.5rem] font-normal'>
									Units
								</span>
							</h2>
						</div>
						<div className='flex items-center gap-2 min-w-[16px] airBnbDesktop:min-w-[auto] airBnbDesktop:ml-auto'>
							<NumberOfUnits propertyId={params.propertyId} />
						</div>
					</div>
				</header>
				<div className='flex justify-center grow py-6 airBnbDesktop:pt-0 airBnbDesktop:pb-10'>
					<div className='airBnbDesktop:mx-auto airBnbBigDesktop:w-[800px] min-[1128px]:w-[512px] airBnbDesktop:w-[464px]'>
						<div className='flex flex-col justify-center gap-4'>
							<UnitList propertyId={params.propertyId} />
						</div>
					</div>
				</div>
			</section>
		);
}

export default PropertiesUnitsPage;
