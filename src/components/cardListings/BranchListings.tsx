import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { BentoGrid, BentoGridItem } from '../ui/bento-grid';
import { Badge } from '../ui/badge';
import { Star } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWalking } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { Select } from '@react-three/drei';
export default function BranchListings({
	id,
	title,
	description,
	minimum_price,
	maximum_price,
	address,
	created_at,
	ispropertyboosted,
	property_image,
	average_ratings,
	property_title,
	company_name,
	distance,
	travelTime,
	selectedFilter,
	selectedPrivacyType,
	minPrice,
	maxPrice,
	rooms,
	beds
}: BranchlistingsProps) {
	const router = useRouter();

	const min_formattedPrice = new Intl.NumberFormat('en-PH', {
		style: 'currency',
		currency: 'PHP',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(minimum_price);

	const max_formattedPrice = new Intl.NumberFormat('en-PH', {
		style: 'currency',
		currency: 'PHP',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(maximum_price);

	const timeAgo = created_at
		? formatDistanceToNow(new Date(created_at), { addSuffix: true })
		: 'N/A';

	const handleClick = () => {
		const query = new URLSearchParams();

		
		if (selectedFilter?.length > 0) {
			selectedFilter.forEach((amenity) => {
				query.append('amenities', amenity);
			})
		}
		if (selectedPrivacyType) query.set('privacy', selectedPrivacyType);
		if (minPrice) query.set('minPrice', minPrice.toString());
		if (maxPrice) query.set('maxPrice', maxPrice.toString());
		if (beds) query.set('bed', beds.toString());
		if (rooms) query.set('room', rooms.toString());

		const queryString = query.toString();
		if (queryString) {
			router.push(`/property/${id}?${queryString}`);
		} else {
			router.push(`/property/${id}`);
		}
	};
	return (
		<div>
			<BentoGrid
				className='max-w-screen mx-auto cursor-pointer'
				onClick={handleClick}
			>
				<BentoGridItem
					title={
						<div className='flex items-center justify-between'>
							<span className='sm:text-sm xs:text-xs line-clamp-1'>
								{title}
							</span>
							<div className='flex items-center'>
								{average_ratings ? (
									<>
										<Star className='h-4 w-4 text-yellow-500' fill='#eab308' />
										<span className='ml-1 text-sm xs:text-xs'>
											{average_ratings.toFixed(1)}
										</span>
									</>
								) : // nilagay ko lang para sa mga hindi na-review na listing
								null}
							</div>
						</div>
					}
					description={
						<div>
							<p className='line-clamp-1'>{property_title}</p>
							<p className='line-clamp-1'>{company_name}</p>
							{/* <strong>
								<p className="line-clamp-1"> {details}</p>
							</strong> */}
							<p className='line-clamp-1'> {address}</p>
							<p className='line-clamp-1'>Listed {timeAgo}</p>{' '}
							{/* Handle missing or invalid dates */}
							<div className='flex flex-row mt-2'>
								Starting at
								<span className='font-bold mx-2'>{min_formattedPrice}</span>
							</div>
							{/* Travel Time Display */}
							{/* PAAYOS UNG DESIGN AHHAHA */}
							{/* {distance && travelTime && (
                <div className="relative left-3/4 transform -translate-x-1/2 bg-white p-2 rounded-full shadow-md w-1/3">
                  <span className="text-sm font-semibold text-gray-700">
                    <span className="text-primary">
                      {travelTime.minutes}:{travelTime.seconds}
                    </span>{" "}
                    mins walk
                  </span>
                </div>
              )} */}
						</div>
					}
					header={
						<div className='relative'>
							<div className='bg-gray-200 w-full h-[170px] rounded-lg overflow-hidden flex items-center justify-center'>
								{property_image && property_image.trim() !== '' ? (
									<img
										src={property_image}
										alt='Thumbnail'
										className='w-full h-full object-cover cursor-pointer'
										onClick={handleClick}
									/>
								) : (
									<p className='text-center text-gray-500'>Image not found</p>
								)}
								<div className='absolute top-2 right-2 flex space-x-2'>
									{ispropertyboosted && (
										<Badge
											className='bg-primary text-white px-2 py-1 rounded-full'
											variant='secondary'
										>
											Featured
										</Badge>
									)}
									{distance && travelTime && (
										<div className='bg-white px-3 py-1 rounded-full shadow-md flex items-center space-x-1'>
											<FontAwesomeIcon
												icon={faWalking}
												className='h-4 w-4 text-primary'
											/>
											<span className='text-sm font-semibold text-gray-700'>
												{travelTime.minutes}:{travelTime.seconds} mins walk
											</span>
										</div>
									)}
								</div>
							</div>
						</div>
					}
					className='shadow-sm h-auto flex flex-col justify-between p-3 cursor-pointer'
				/>
			</BentoGrid>
		</div>
	);
}
