import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface SideReviewsProps {
	propertyId: number;
	propertyReviews: any;
}

const SideReviews: React.FC<SideReviewsProps> = ({
	propertyId,
	propertyReviews,
}) => {
	const [locationPercentage, setLocationPercentage] = useState<number>(0);
	const [cleanlinessPercentage, setCleanlinessPercentage] = useState<number>(0);
	const [valueForMoneyPercentage, setValueForMoneyPercentage] =
		useState<number>(0);

	useEffect(() => {
		if (propertyReviews.length > 0) {
			const averageLocation = propertyReviews.reduce(
				(sum, review) => sum + review.location,
				0
			);
			setLocationPercentage(averageLocation / propertyReviews.length);

			const averageCleanliness = propertyReviews.reduce(
				(sum, review) => sum + review.cleanliness,
				0
			);
			setCleanlinessPercentage(averageCleanliness / propertyReviews.length);

			const averageValueForMoney = propertyReviews.reduce(
				(sum, review) => sum + review.value_for_money,
				0
			);
			setValueForMoneyPercentage(averageValueForMoney / propertyReviews.length);
		}
	}, []);

	// Map the average rating to a descriptive scale
	const mapScoreToRating = (averageScore: number): string => {
		if (averageScore >= 9) return 'Exceptional';
		if (averageScore >= 8) return 'Wonderful';
		if (averageScore >= 7) return 'Excellent';
		if (averageScore >= 6) return 'Good';
		if (averageScore >= 5) return 'Pleasant';
		if (averageScore >= 4) return 'Fair';
		if (averageScore >= 3) return 'Disappointing';
		if (averageScore >= 2) return 'Poor';
		if (averageScore >= 1) return 'Very Poor';
		return 'Bad';
	};

	// Calculate the overall average rating
	const overallRating =
		(locationPercentage + cleanlinessPercentage + valueForMoneyPercentage) / 3;
	const ratingDescription = mapScoreToRating(overallRating);

	const totalReviews = propertyReviews.length;

	return (
		<div>
			<Card className='bg-white dark:bg-secondary border border-gray-300 mr-0'>
				<CardHeader className='pb-3'>
					<CardDescription>
						<p className='text-lg mb-0 pb-0 font-bold dark:text-gray-100'>
							{overallRating.toFixed(1)} {ratingDescription}
						</p>
						<p className='text-md pt-0 mt-0 text-primary dark:text-blue-300'>
							{totalReviews} review{totalReviews !== 1 && 's'}
						</p>
					</CardDescription>
				</CardHeader>
				<CardContent className='text-sm font-normal'>
					<div className='space-x-2 space-y-2 pl-1'>
						<Badge className='bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-900 inline-block max-w-fit rounded-sm px-1'>
							Location: {locationPercentage.toFixed(1)}
						</Badge>
						<Badge className='bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-900 inline-block max-w-fit rounded-sm px-2'>
							Cleanliness: {cleanlinessPercentage.toFixed(1)}
						</Badge>
						<Badge className='bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-900 inline-block max-w-fit rounded-sm px-1'>
							Value for Money: {valueForMoneyPercentage.toFixed(1)}
						</Badge>
					</div>

					<Carousel
						orientation='horizontal'
						plugins={[
							Autoplay({
								delay: 4000,
								stopOnInteraction: true,
							}),
						]}
					>
						<CarouselContent>
							{propertyReviews?.map((review) => (
								<CarouselItem key={review.user_id} className='pl-1'>
									<Card className='bg-white mt-3 border-gray-300 dark:bg-secondary '>
										<CardHeader className='p-4 py-2 h-[75px]'>
											<CardDescription className='overflow-hidden text-ellipsis dark:text-gray-300'>
												<div className='flex items-center justify-between'>
													<span className='line-clamp-3 overflow-hidden text-ellipsis'>
														"{review.comment || 'No comment'}"
													</span>
													<div className='flex items-center'>
														<Star
															className='h-4 w-4 text-yellow-500'
															fill='#eab308'
														/>
														<span className='ml-1 text-xs sm:text-sm'>
															{review.ratings.toFixed(1)}
														</span>
													</div>
												</div>
											</CardDescription>
										</CardHeader>
									</Card>
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>
				</CardContent>
			</Card>
		</div>
	);
};

export default SideReviews;
