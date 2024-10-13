import React from 'react';
import { BentoGrid, BentoGridItem } from '../ui/bento-grid';
import { Badge } from '../ui/badge';
import { Star } from 'lucide-react';

interface Amenity {
	amenity_name: string;
	value: boolean;
}
interface BranchlistingsProps {
	id: number;
	title: string;
	description: string;
	price: number;
	featured: boolean;
	amenities: Amenity[];
	lessor_name: string;
}

export default function BranchListings({
	title,
	description,
	featured,
	price,
}: // amenities,
BranchlistingsProps) {
	const formattedPrice = new Intl.NumberFormat('en-PH', {
		style: 'currency',
		currency: 'PHP',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price);
	return (
		<div>
			<BentoGrid className='max-w-screen mx-auto'  >
				<BentoGridItem
					title={
						<div className='flex items-center justify-between'>
							<span className='sm:text-sm xs:text-xs line-clamp-1'>
								{title}
							</span>
							<div className='flex items-center'>
								<Star className='h-4 w-4 text-yellow-500' fill='#eab308' />
								<span className='ml-1 text-sm xs:text-xs'>4.5</span>
							</div>
						</div>
					}
					description={
						<div>
							<p className='line-clamp-1'>{description}</p>
							<div className='flex flex-row mt-2'>
								{/* {amenities.map((item, id) =>
									item.value ? (
										<Badge
											className='relative top-2 dark:bg-white dark:text-card'
											variant='secondary'
											key={id}
										>
											{item.amenity_name}
										</Badge>
									) : null
								)} */}
								<span className='font-bold mr-1'>{formattedPrice}</span> month
							</div>
						</div>
					}
					header={
						<div className='relative'>
							<div className='bg-gray-200 w-full h-[170px] rounded-lg overflow-hidden'>
								<img
									src={'https://picsum.photos/400/250'}
									alt='Thumbnail'
									className='w-full h-full object-cover'

									//  IF POSSIBLE ADD THIS ON BENTO GRID COMPONENT
									onClick={() => {window.location.href = "/property/room";}}
								/>
								{featured && (
									<Badge
										className='absolute right-2 top-2 bg-primary text-white'
										variant='secondary'
									>
										Featured
									</Badge>
								)}
							</div>
						</div>
					}
					className='shadow-sm h-auto flex flex-col justify-between p-4'
				/>
			</BentoGrid>
		</div>
	);
}
