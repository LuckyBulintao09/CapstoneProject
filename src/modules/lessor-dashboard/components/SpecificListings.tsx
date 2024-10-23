import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';

interface BranchListings {
	id: number;
	room_title: string;
	room_capacity: number;
	lifestyle: string;
	description: string;
	availability: boolean;
	price: number;
	thumbnail_url: string;
	title: string;
}

export default function SpecificListings({
	room_title,
	thumbnail_url,
	description,
	availability,
	price,
	id,
	title,
}: BranchListings) {
	const formattedPrice = new Intl.NumberFormat('en-PH', {
		style: 'currency',
		currency: 'PHP',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price);

	return (
		<div>
			<BentoGrid className='max-w-screen mx-auto'>
				<Link href={`/property/room/${id}`} passHref>
					<BentoGridItem
						title={
							<div className='flex items-center justify-between'>
								<span className='sm:text-sm xs:text-xs line-clamp-1'>
									{room_title}
								</span>
								{/* <div className='flex items-center'>
									<Star className='h-4 w-4 text-yellow-500' fill='#eab308' />
									<span className='ml-1 text-sm xs:text-xs'>4.5</span>
								</div> */}
							</div>
						}
						description={
							<div>
								<p className='line-clamp-1'>{title} </p>
								<p className='line-clamp-1'>{description}</p>
								<div className='flex flex-row mt-2'>
									<span className='font-bold mr-1'>{formattedPrice}</span> month
								</div>
							</div>
						}
						header={
							<div className='relative'>
								<div className='bg-gray-200 w-full h-[170px] rounded-lg overflow-hidden'>
									<img
										src={thumbnail_url}
										alt='Thumbnail'
										className='w-full h-full object-cover'
									/>
									{availability && (
										<Badge
											className='absolute right-2 top-2 bg-primary text-white'
											variant='secondary'
										>
											Available
										</Badge>
									)}
								</div>
							</div>
						}
						className='shadow-sm h-auto flex flex-col justify-between p-4'
					/>
				</Link>
			</BentoGrid>
		</div>
	);
}
