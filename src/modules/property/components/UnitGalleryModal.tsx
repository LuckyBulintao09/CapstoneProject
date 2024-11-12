/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import GalleryModalReviewSection from './GalleryModalReviewSection';

interface UnitGalleryModalProps {
	isOpen: boolean;
	onClose: () => void;
	images: string[];
	reviews: any[];
	locationPercentage: number;
	cleanlinessPercentage: number;
	valueForMoneyPercentage: number;
	setSelectedImage: (url: string) => void;
}

const UnitGalleryModal: React.FC<UnitGalleryModalProps> = ({
	isOpen,
	onClose,
	images,
	reviews,
	locationPercentage,
	cleanlinessPercentage,
	valueForMoneyPercentage,
	setSelectedImage,
}) => {
	// rating scale - based sa booking.com
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

	const getReviewAverage = (review: any) => {
		return (review.location + review.cleanliness + review.value_for_money) / 3;
	};

	const getOverallRating = () => {
		const totalReviews = reviews.length;
		if (totalReviews === 0) return 0;

		const totalScore = reviews.reduce(
			(sum, review) => sum + getReviewAverage(review),
			0
		);
		const averageScore = totalScore / totalReviews;
		return averageScore;
	};

	const overallRating = getOverallRating();
	const ratingDescription = mapScoreToRating(overallRating);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='p-6 max-w-7xl bg-white mx-2 dark:bg-secondary'>
				<DialogHeader>
					<DialogTitle className='text-primary dark:text-gray-100'>
						Room Title Gallery
					</DialogTitle>
				</DialogHeader>

				<Tabs defaultValue='rooms'>
					<hr className='border-t border-gray-300' />

					{/* ROOM VIEW */}
					<TabsContent value='rooms' className='h-[450px] mt-0'>
						<div>
							<ScrollArea className='h-[430px] overflow-y-auto pr-4 my-4'>
								<div className='grid grid-cols-3 gap-4'>
									{images.map((url, index) => (
										<img
											key={index}
											src={url}
											alt={`property image ${index + 1}`}
											className='rounded-md object-cover w-full h-full transition-all duration-300 ease-in-out transform hover:brightness-75 cursor-pointer'
										/>
									))}
								</div>
							</ScrollArea>
						</div>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
};

export default UnitGalleryModal;
