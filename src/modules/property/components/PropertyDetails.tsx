import { Check } from 'lucide-react';
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

		checkDescriptionHeight();
		window.addEventListener('resize', checkDescriptionHeight);

		return () => {
			window.removeEventListener('resize', checkDescriptionHeight);
		};
	}, [description]);
	return (
		<>
			<Card className='bg-white dark:bg-secondary border border-gray-300'>
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

					{shouldShowToggle && (
						<button
							onClick={handleToggle}
							className='text-blue-500 dark:text-blue-300 text-sm mt-2 '
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

			<Card className='bg-white dark:bg-secondary border border-gray-300'>
				<CardHeader>
					<CardTitle>Facilities</CardTitle>
				</CardHeader>
				<CardContent className='text-sm font-normal'>
					<div className='grid grid-cols-4 gap-1'>
						{[
							'Facility 1',
							'Facility 2',
							'Facility 3',
							'Facility 4',
							'Facility 5',
						].map((item, index) => (
							<div key={index} className='flex items-center'>
								<Check className='mr-2 text-green-600' size={16} />
								<span>{item}</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</>
	);
};

export default PropertyDetails;
