import tempValues from '@/lib/constants/tempValues';
import { Image } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Shield, Building, Bed, UserIcon } from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
interface PropertyDetailsProps {
	details: string;
	privacyType: string;
	structure: string;
	bedrooms: number;
	beds: number;
	occupants: number;
	description: string;
	amenitiesList: any[];
	address: string;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
	privacyType,
	structure,
	bedrooms,
	beds,
	occupants,
	description,
	amenitiesList,
	address,
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [shouldShowToggle, setShouldShowToggle] = useState(false);
	const descriptionRef = useRef<HTMLDivElement>(null);

	const handleToggle = () => {
		setIsExpanded(!isExpanded);
	};

	useEffect(() => {
		// Check if the description should show the "See more" button
		const checkDescriptionHeight = () => {
			if (descriptionRef.current) {
				const descriptionHeight = descriptionRef.current.scrollHeight;
				const lineHeight = parseInt(
					window.getComputedStyle(descriptionRef.current).lineHeight,
					10
				);
				const numberOfLines = descriptionHeight / lineHeight;

				if (numberOfLines > 4) {
					setShouldShowToggle(true);
				} else {
					setShouldShowToggle(false);
				}
			}
		};

		// Call the function on mount and window resize
		checkDescriptionHeight();
		window.addEventListener('resize', checkDescriptionHeight);

		// Clean up event listener
		return () => {
			window.removeEventListener('resize', checkDescriptionHeight);
		};
	}, [description]);
	return (
		<>
			<Card className='bg-white border border-gray-300'>
				<CardHeader>
					<CardTitle>Property Overview</CardTitle>
					<CardDescription className='border-b border-gray-300 pb-3'>
						{address}
					</CardDescription>
				</CardHeader>
				<CardContent className='text-sm font-normal'>
					<div
						className={`${
							isExpanded ? '' : 'line-clamp-4'
						} overflow-hidden transition-all`}
						ref={descriptionRef}
					>
						{description}
					</div>
					{/* Show "See more" or "See less" button only if necessary */}
					{shouldShowToggle && (
						<button
							onClick={handleToggle}
							className='text-blue-500 text-sm mt-2 '
						>
							{isExpanded ? 'See less' : 'See more'}
						</button>
					)}
					<div className='flex flex-col space-y-4 border-t border-gray-300 mt-4 pt-4'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center'>
								<Shield className='w-6 h-6 text-gray-700 dark:text-neutral-300 mr-2' />
								<h5 className='text-md font-semibold '>Privacy Type</h5>
							</div>
							<p className='text-gray-700 dark:text-neutral-300'>
								{privacyType}
							</p>
						</div>
						<div className='flex items-center justify-between'>
							<div className='flex items-center'>
								<Building className='w-6 h-6 text-gray-700 dark:text-neutral-300 mr-2' />
								<h5 className='text-md font-semibold'>Building Structure</h5>
							</div>
							<p className='text-gray-700 dark:text-neutral-300'>{structure}</p>
						</div>
						<div className='flex items-center justify-between'>
							<div className='flex items-center'>
								<Bed className='w-6 h-6 text-gray-700 dark:text-neutral-300 mr-2' />
								<h5 className='text-md font-semibold'>Number of Bedrooms</h5>
							</div>
							<p className='text-gray-700 dark:text-neutral-300'>{bedrooms}</p>
						</div>
						<div className='flex items-center justify-between'>
							<div className='flex items-center'>
								<Bed className='w-6 h-6 text-gray-700 dark:text-neutral-300 mr-2' />
								<h5 className='text-md font-semibold'>Number of Beds</h5>
							</div>
							<p className='text-gray-700 dark:text-neutral-300'>{beds}</p>
						</div>
						<div className='flex items-center justify-between'>
							<div className='flex items-center'>
								<UserIcon className='w-6 h-6 text-gray-700 dark:text-neutral-300 mr-2' />
								<h5 className='text-md font-semibold'>Current Occupants</h5>
							</div>
							<p className='text-gray-700 dark:text-neutral-300'>{occupants}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<div>
				{/* general */}
				{amenitiesList && amenitiesList.length > 0 && (
					<div className='border-t border-gray-300 flex flex-col py-6 mr-4'>
						<h4 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
							General
						</h4>
						<div className='grid grid-cols-2 lg:grid-cols-2 md:grid-cols-1 gap-2'>
							{amenitiesList.map((amenity) => (
								<div
									className='flex flex-row items-center gap-3 my-2'
									key={amenity.id}
								>
									<span className='inline-block w-2 h-2 bg-gray-700 rounded-full mr-2' />
									<div>
										<h5 className='scroll-m-20 text-lg font-semibold tracking-tight'>
											{amenity.amenity_name}
										</h5>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default PropertyDetails;
