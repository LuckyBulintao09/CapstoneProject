/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel';
import { createClient } from '../../../utils/supabase/client';
import { Loader } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from '@/components/ui/button';
import GalleryModal from './GalleryModal';

interface MainPreviewProps {
	openModal: () => void;
	propertyId: number;
}

const MainPreview: React.FC<MainPreviewProps> = ({ propertyId }) => {
	const [propertyImages, setPropertyImages] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
	const [reviews, setReviews] = useState<any[]>([]);
	const [locationPercentage, setLocationPercentage] = useState<number>(0);
	const [cleanlinessPercentage, setCleanlinessPercentage] = useState<number>(0);
	const [valueForMoneyPercentage, setValueForMoneyPercentage] =
		useState<number>(0);

	// CHANGE TO PROPERTY
	useEffect(() => {
		const supabase = createClient();

		const fetchPropertyImages = async () => {
			setLoading(true);
			const { data, error } = await supabase
				.from('unit_images')
				.select('*')
				.eq('unit_id', propertyId);

			if (error) {
				console.error('Error fetching property images:', error);
			} else if (data && data.length > 0) {
				const images = [
					data[0].image1_url,
					data[0].image2_url,
					data[0].image3_url,
					data[0].image4_url,
					data[0].image5_url,
				].filter((url) => url);
				setPropertyImages(images);
			}
			setLoading(false);
		};

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
					value_for_money,
					account (firstname, lastname, profile_url)
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

		fetchPropertyImages();
		fetchReviews();
	}, [propertyId]);
	return (
		<>
			<div className='col-span-4 pr-0 mr-0'>
				<Card className='lg:h-[550px] md:h-full sm:h-[300px] xs:h-[365px] border-none relative'>
					{loading ? (
						<div className='flex flex-col items-center justify-center h-full'>
							<Loader />
							<p className='mb-2'>Loading Image</p>
						</div>
					) : (
						propertyImages.length > 0 && (
							<img
								src={propertyImages[0]}
								alt='property image'
								className='rounded-md w-full h-full cursor-pointer transition-all duration-300 ease-in-out transform hover:brightness-75'
								onClick={() => setSelectedImage(propertyImages[0])}
							/>
						)
					)}

					<Button
						className='absolute bottom-4 right-4 bg-primary px-4 py-2 rounded-md shadow-lg'
						onClick={() => setIsGalleryModalOpen(true)}
					>
						View all photos
					</Button>
				</Card>
			</div>

			{selectedImage && (
				<Dialog
					open={Boolean(selectedImage)}
					onOpenChange={() => setSelectedImage(null)}
				>
					<DialogContent className='p-0 max-w-6xl'>
						<img
							src={selectedImage}
							alt='Selected property'
							className='w-full h-auto'
						/>
					</DialogContent>
				</Dialog>
			)}

			<GalleryModal
				isOpen={isGalleryModalOpen}
				onClose={() => setIsGalleryModalOpen(false)}
				images={propertyImages}
				reviews={reviews}
				locationPercentage={locationPercentage}
				cleanlinessPercentage={cleanlinessPercentage}
				valueForMoneyPercentage={valueForMoneyPercentage}
				setSelectedImage={setSelectedImage}
			/>
			<div>
				<Carousel
					orientation='vertical'
					plugins={[
						Autoplay({
							delay: 2000,
							stopOnInteraction: true,
						}),
					]}
				>
					<CarouselContent className='lg:h-[568px] md:h-[568px] sm:h-[320px] pt-4 pb-2 flex flex-col gap-2'>
						{loading ? (
							<div className='flex flex-col items-center justify-center h-full'>
								<Loader />
								<p className='mb-2'>Loading Image</p>
							</div>
						) : (
							propertyImages.map((url, index) => (
								<CarouselItem
									key={index}
									className='lg:basis-1/2 md:basis-1/3 sm:basis-1/2 basis-1/2 pt-0'
								>
									<div className='h-full flex items-center justify-center'>
										<img
											src={url}
											alt={`property image ${index + 1}`}
											className='rounded-md object-cover h-full cursor-pointer transition-all duration-300 ease-in-out transform hover:brightness-75'
											onClick={() => setSelectedImage(url)}
										/>
									</div>
								</CarouselItem>
							))
						)}
					</CarouselContent>
				</Carousel>
			</div>

			{selectedImage && (
				<Dialog
					open={Boolean(selectedImage)}
					onOpenChange={() => setSelectedImage(null)}
				>
					<DialogContent className='p-0 max-w-6xl'>
						<img
							src={selectedImage}
							alt='Selected property'
							className='w-full h-auto'
						/>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
};

export default MainPreview;
