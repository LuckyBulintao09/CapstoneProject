import { getPropertyAmenities, getPropertyHouseRules, getPropertyType } from "@/actions/property/get-property-by-id";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { ArrowLeft } from "lucide-react";
import PropertyTypeForm from "./_components/PropertyTypeForm";
import { getAllAmenities } from "@/actions/amenety/getAllAmenities";

async function PropertyTypePage({params}: {params: {propertyId: string}}) {
    const { structure } = await getPropertyType(params.propertyId);
	const property_house_rules = await getPropertyHouseRules(params.propertyId);
	const property_amenities = await getPropertyAmenities(params.propertyId);
	const all_amenities = await getAllAmenities();

    return (
			<section className='flex flex-col h-[calc(100vh-68px)] w-full px-6 airBnbDesktop:overflow-x-hidden airBnbDesktop:overflow-y-auto airBnbTablet:px-10 min-[1128px]:px-20 airBnbBigDesktop:px-0'>
				<header className='airBnbDesktop:mx-auto airBnbDesktop:sticky airBnbDesktop:z-[3] airBnbDesktop:top-0 airBnbDesktop:grow-0 airBnbDesktop:shrink-0 airBnbDesktop:basis-auto airBnbDesktop:pb-5 airBnbDesktop:pt-11 bg-background'>
					<div className='mt-3 flex items-center justify-between w-full px-10 py-6 airBnbDesktop:gap-6 airBnbDesktop:w-[464px] airBnbDesktop:p-0 airBnbBigDesktop:w-[800px] min-[1128px]:w-[512px]'>
						<div className='flex justify-center items-center gap-2'>
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
									Property Type
								</span>
							</h2>
						</div>
					</div>
				</header>
				<div className='grow py-6 airBnbDesktop:pt-0 airBnbDesktop:pb-10'>
					<div className='airBnbDesktop:mx-auto airairBnbBigDesktop:w-[608px] min-[1128px]:w-[512px] airBnbDesktop:w-[464px] '>
						<PropertyTypeForm
							propertyType={structure}
							propertyId={params.propertyId}
							propertyHouseRules={property_house_rules}
							propertyAmenities={property_amenities}
							allAmenities={all_amenities}
						/>
					</div>
				</div>
			</section>
		);
}

export default PropertyTypePage;
