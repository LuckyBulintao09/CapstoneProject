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

interface GalleryModalProps {
	isOpen: boolean;
	onClose: () => void;
	images: string[];
	reviews: any[];
	locationPercentage: number;
	cleanlinessPercentage: number;
	valueForMoneyPercentage: number;
	setSelectedImage: (url: string) => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({
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
			<DialogContent className='p-6 max-w-7xl bg-white mx-2'>
				<DialogHeader>
					<DialogTitle>All Photos</DialogTitle>
				</DialogHeader>

				<Tabs defaultValue='property_view'>
					<TabsList className='mb-2 gap-2 bg-white'>
						<TabsTrigger
							value='property_view'
							className='hover:text-primary data-[state=active]:bg-white data-[state=active]:border-b border-primary data-[state=active]:text-primary rounded-none'
						>
							Property View
						</TabsTrigger>
						<TabsTrigger
							value='rooms'
							className='hover:text-primary data-[state=active]:bg-white data-[state=active]:border-b border-primary data-[state=active]:text-primary rounded-none'
						>
							Rooms
						</TabsTrigger>
					</TabsList>

					<hr className='border-t border-gray-300' />

					{/* PROPERTY VIEW */}
					<TabsContent value='property_view' className='h-[450px] mt-0'>
						<div className='grid grid-cols-4'>
							<div className='col-span-3 border-r-1 border-gray-300'>
								<ScrollArea className='h-[430px] overflow-y-auto pr-4 my-4'>
									<div className='grid grid-cols-3 gap-4'>
										{/* CHANGE: property_images dapat dito */}
										{images.map((url, index) => (
											<img
												key={index}
												src={url}
												alt={`property image ${index + 1}`}
												className='rounded-lg object-cover w-full h-full transition-all duration-300 ease-in-out transform hover:brightness-75 cursor-pointer'
												onClick={() => setSelectedImage(url)}
											/>
										))}
									</div>
								</ScrollArea>
							</div>

							<div className='grid-rows-2 col-span-1'>
								<div>
									<Card className='bg-white border-none shadow-none'>
										<CardHeader className='p-3 my-2'>
											<div className='grid grid-cols-5 items-center'>
												<div className='flex justify-center items-center'>
													{/* review score */}
													<Card className='p-2 bg-primary text-center text-white border-none'>
														<span className='text-md font-semibold'>
															{overallRating.toFixed(1)}
														</span>
													</Card>
												</div>

												<div className='col-span-4'>
													<CardDescription className='ml-2'>
														<p className='font-bold text-lg'>
															{ratingDescription}
														</p>
														<p className='font-medium'>
															{reviews.length}{' '}
															{reviews.length === 1 ? 'review' : 'reviews'}
														</p>
													</CardDescription>
												</div>
											</div>
										</CardHeader>
									</Card>
								</div>

								<div className='border-t-1 border-gray-300'></div>
								<ScrollArea className='h-[360px] overflow-y-auto pr-4'>
									<div>
										{reviews.length > 0 ? (
											reviews.map((review, index) => (
												<Card
													key={index}
													className='bg-white border-none shadow-none'
												>
													<CardHeader className='border-b border-gray-300 p-5'>
														<CardDescription className='text-gray-700 italic mb-3'>
															{`"${review.comment}"`}
														</CardDescription>

														<div className='flex items-center mt-2'>
															<Avatar className='h-6 w-6 rounded-full overflow-hidden'>
																<AvatarImage
																	src={review.account?.profile_url}
																	className='object-cover w-full h-full'
																/>
																<AvatarFallback className='flex items-center justify-center w-full h-full bg-gray-300 text-white text-xs'>
																	{review.account?.firstname?.charAt(0)}
																	{review.account?.lastname?.charAt(0)}
																</AvatarFallback>
															</Avatar>
															<span className='ml-2 text-sm font-semibold text-gray-800'>
																{review.account?.firstname}
															</span>
														</div>
													</CardHeader>
												</Card>
											))
										) : (
											<p>No reviews available for this property.</p>
										)}
									</div>
									<div>
										<GalleryModalReviewSection
											locationPercentage={locationPercentage}
											cleanlinessPercentage={cleanlinessPercentage}
											valueForMoneyPercentage={valueForMoneyPercentage}
										/>
									</div>
								</ScrollArea>
							</div>
						</div>
					</TabsContent>

					{/* ROOM VIEW */}
					<TabsContent value='rooms' className='h-[450px] mt-0'>
						<div className='grid grid-cols-4'>
							<div className='col-span-3 border-r-1 border-gray-300'>
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

							<div className='grid-rows-2 col-span-1'>
								<div>
									<Card className='bg-white border-none shadow-none'>
										<CardHeader className='p-3 my-2'>
											<div className='grid grid-cols-5 items-center'>
												<div className='flex justify-center items-center'>
													{/* review score */}
													<Card className='p-2 bg-primary text-center text-white border-none'>
														<span className='text-md font-semibold'>
															{overallRating.toFixed(1)}
														</span>
													</Card>
												</div>

												<div className='col-span-4'>
													<CardDescription className='ml-2'>
														<p className='font-bold text-lg'>
															{ratingDescription}
														</p>
														<p className='font-medium'>
															{reviews.length}{' '}
															{reviews.length === 1 ? 'review' : 'reviews'}
														</p>
													</CardDescription>
												</div>
											</div>
										</CardHeader>
									</Card>
								</div>

								<div className='border-t-1 border-gray-300'></div>
								<ScrollArea className='h-[360px] overflow-y-auto pr-4'>
									<div>
										{reviews.length > 0 ? (
											reviews.map((review, index) => (
												<Card
													key={index}
													className='bg-white border-none shadow-none'
												>
													<CardHeader className='border-b border-gray-300 p-5'>
														<CardDescription className='text-gray-700 italic mb-3'>
															{`"${review.comment}"`}
														</CardDescription>

														<div className='flex items-center mt-2'>
															<Avatar className='h-6 w-6 rounded-full overflow-hidden'>
																<AvatarImage
																	src={review.account?.profile_url}
																	className='object-cover w-full h-full'
																/>
																<AvatarFallback className='flex items-center justify-center w-full h-full bg-gray-300 text-white'>
																	{review.account?.firstname?.charAt(0)}
																	{review.account?.lastname?.charAt(0)}
																</AvatarFallback>
															</Avatar>
															<span className='ml-2 text-sm font-semibold text-gray-800'>
																{review.account?.firstname}
															</span>
														</div>
													</CardHeader>
												</Card>
											))
										) : (
											<p>No reviews available for this property.</p>
										)}
									</div>
									<div>
										<GalleryModalReviewSection
											locationPercentage={locationPercentage}
											cleanlinessPercentage={cleanlinessPercentage}
											valueForMoneyPercentage={valueForMoneyPercentage}
										/>
									</div>
								</ScrollArea>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
};

export default GalleryModal;
