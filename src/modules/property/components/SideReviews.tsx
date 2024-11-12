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
import { createClient } from '@/utils/supabase/client';
import Autoplay from 'embla-carousel-autoplay';
import React, { useState, useEffect } from 'react';

interface SideReviewsProps {
	propertyId: number;
	propertyReviews: any;
}

const SideReviews: React.FC<SideReviewsProps> = ({ propertyId }) => {
	const [reviews, setReviews] = useState<any[]>([]);
	const [locationPercentage, setLocationPercentage] = useState<number>(0);
	const [cleanlinessPercentage, setCleanlinessPercentage] = useState<number>(0);
	const [valueForMoneyPercentage, setValueForMoneyPercentage] =
		useState<number>(0);

	useEffect(() => {
		const supabase = createClient();

		const fetchReviews = async () => {
			const { data, error } = await supabase
				.from('ratings_review')
				.select(
					`
                    user_id, 
                    ratings, 
                    comment, 
                    location,
                    cleanliness,
                    value_for_money
                `
				)
				.eq('unit_id', propertyId);

			if (error) {
				console.error('Error fetching reviews:', error);
			} else {
				setReviews(data);
				const totalReviews = data.length;
				if (totalReviews > 0) {
					const locationSum = data.reduce(
						(sum, review) => sum + review.location,
						0
					);
					const cleanlinessSum = data.reduce(
						(sum, review) => sum + review.cleanliness,
						0
					);
					const valueForMoneySum = data.reduce(
						(sum, review) => sum + review.value_for_money,
						0
					);

					setLocationPercentage(locationSum / totalReviews);
					setCleanlinessPercentage(cleanlinessSum / totalReviews);
					setValueForMoneyPercentage(valueForMoneySum / totalReviews);
				}
			}
		};

		fetchReviews();
	}, [propertyId]);

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

	const totalReviews = reviews.length;

	return (
		<div>
			<Card className='bg-white border border-gray-300 mr-0'>
				<CardHeader className='pb-3'>
					<CardDescription>
						<p className='text-lg mb-0 pb-0 font-bold'>
							{overallRating.toFixed(1)} {ratingDescription}
						</p>
						<p className='text-md pt-0 mt-0 text-primary'>
							{totalReviews} review{totalReviews !== 1 && 's'}
						</p>
					</CardDescription>
				</CardHeader>
				<CardContent className='text-sm font-normal'>
					<div className='space-x-2 space-y-2 pl-1'>
						<Badge className='bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-900 inline-block max-w-fit rounded-sm px-2'>
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
							{reviews?.map((review) => (
								<CarouselItem key={review.user_id} className='pl-1'>
									<Card className='bg-white mt-3 border-gray-300'>
										<CardHeader className='p-4 py-2'>
											<CardDescription className='line-clamp-3'>
												"{review.comment || 'No comment'}"
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
