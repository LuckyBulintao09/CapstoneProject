import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import React from 'react';

const GalleryModalReviewSection = ({
	locationPercentage,
	cleanlinessPercentage,
	valueForMoneyPercentage,
}) => {
	return (
		<Card className='bg-white dark:bg-secondary border-none shadow-none'>
			<CardHeader className='pr-2'>
				<CardDescription className='text-gray-800 dark:text-gray-100 font-semibold mb-3'>
					Categories:
					<div className='flex justify-between items-center my-2'>
						<span className='font-normal text-sm'>Location</span>
						<span className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
							{locationPercentage.toFixed(1)}
						</span>
					</div>
					<Progress value={locationPercentage * 10} className='h-2 w-full' />
					<div className='flex justify-between items-center my-2'>
						<span className='font-normal text-sm'>Cleanliness</span>

						<span className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
							{cleanlinessPercentage.toFixed(1)}
						</span>
					</div>
					<Progress value={cleanlinessPercentage * 10} className='h-2' />
					<div className='flex justify-between items-center my-2 '>
						<span className='font-normal text-sm'>Value for Money</span>

						<span className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
							{valueForMoneyPercentage.toFixed(1)}
						</span>
					</div>
					<Progress value={valueForMoneyPercentage * 10} className='h-2' />
				</CardDescription>
			</CardHeader>
		</Card>
	);
};

export default GalleryModalReviewSection;
