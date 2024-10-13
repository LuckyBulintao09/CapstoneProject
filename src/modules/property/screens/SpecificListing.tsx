'use client';

import React, { useState } from 'react';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { Card } from '@/components/ui/card';
import { Image, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import tempValues from '@/lib/constants/tempValues';

import BusinessReviews from '../components/BusinessReviews';
import MainPreview from '../components/MainPreview';
import RightPreviewsCarousel from '../components/RightPreviewsCarousel';
import PropertyDetails from '../components/PropertyDetails';
import Banner from '../components/Banner';
import { BookingCard } from '../components/BookingCard';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

export function SpecificListing() {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => {
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
	};
	const [isFavourite, setIsFavourite] = useState(false);

	const toggleFavourite = () => {
		setIsFavourite(!isFavourite);
	};
	return (
		<ResponsiveLayout>
			<div>
				<div className='grid grid-cols-5 gap-2 mt-4'>
					<MainPreview openModal={openModal} />
					<RightPreviewsCarousel />
				</div>

				<div>
					<div className='grid lg:grid-cols-3 grid-cols-1 gap-4 my-6 '>
						<div className='col-span-2'>
							<div className='space-y-5'>
								{/* Header */}
								<div className=' flex justify-between items-center'>
									<div>
										<h1 className='font-semibold xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-left dark:text-white'>
											{
												tempValues.BRANCHES_AND_ROOMS[1].available_rooms[1]
													.room_title
											}
										</h1>
										<p className='flex items-center text-muted-foreground lg:text-md'>
											<MapPin className='mr-1' height={18} width={18} />
											Baguio City
										</p>
									</div>
									<div className='relative flex items-center mr-3'>
										<div className='group'>
											<div onClick={toggleFavourite} className='cursor-pointer'>
												{isFavourite ? (
													<HeartSolid className='h-8 w-8 text-red-500' />
												) : (
													<HeartOutline className='h-8 w-8 text-gray-500' />
												)}
											</div>

											<div className='absolute left-0 hidden group-hover:block bg-black text-white text-xs rounded-md p-2 w-32'>
												Add to favourites
											</div>
										</div>
									</div>
								</div>

								<div className='flex items-center border-y border-gray-300 mr-4 py-4'>
									<Avatar className='mr-3 lg:mr-4'>
										<AvatarFallback>YN</AvatarFallback>
									</Avatar>
									<div className='flex flex-col'>
										<h3 className='font-bold text-sm lg:text-base'>
											Lessor Name
										</h3>
										<p className='text-sm text-gray-700'>Property Owner</p>
									</div>
								</div>

								<PropertyDetails />
								<Banner />
							</div>
						</div>
						<div className='flex lg:justify-end lg:items-start col-span-full lg:col-span-1'>
							<div className=' w-max h-max sticky top-20'>
								<BookingCard />
							</div>
						</div>
					</div>
				</div>

				<div>
					{/* other info */}
					<div>
						<div className='flex flex-col border-t border-gray-300 py-8 mr-4'>
							<h4 className='text-2xl font-semibold tracking-tight'>
								Other Information
							</h4>
							<div className='flex flex-row justify-between'>
								{tempValues.OTHER_INFO.map((info) => (
									<div
										className='flex flex-row items-center gap-3 my-3'
										key={info.id}
									>
										<Image />
										<div>
											<small className='text-sm font-medium leading-none'>
												{info.info}
											</small>
										</div>
									</div>
								))}
							</div>
						</div>
						{/* nearby places */}
						<div>
							<div className='flex flex-col '>
								<h4 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
									Nearby Places
								</h4>
								<div className='flex flex-row justify-between'>
									{tempValues.NEARBY_PLACES.map((item) => (
										<div
											className='flex flex-row items-center gap-3 my-3'
											key={item.id}
										>
											<Image />
											<div>
												<h5 className='scroll-m-20 text-lg font-semibold tracking-tight'>
													{item.place}
												</h5>
												<p className='text-sm text-muted-foreground'>
													{item.km}
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						<div className='flex flex-col  border-t border-gray-300 py-8 mr-4'>
							<h4 className='text-2xl font-semibold tracking-tight pb-4'>
								Customer Reviews
							</h4>
							<BusinessReviews />
						</div>
						<div className='flex flex-col border-t border-gray-300 py-8 mr-4'>
							<h4 className='text-2xl font-semibold tracking-tight pb-4'>
								Where you&apos;ll be
							</h4>
							<Card className='lg:h-[550px] md:h-full sm:h-[300px] xs:h-[365px] border-none'>
								<iframe
									src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.190906189018!2d120.59490157532025!3d16.415127984315635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3391a15d8cb0dc9b%3A0xe282b2015f6debba!2sUniversity%20of%20Baguio!5e0!3m2!1sen!2sph!4v1727501045306!5m2!1sen!2sph'
									className='rounded-md w-full h-full border-none'
									loading='lazy'
									referrerPolicy='no-referrer-when-downgrade'
								></iframe>
							</Card>
						</div>

						<div className='flex flex-col border-t border-gray-300 py-8 mr-4'>
							<h4 className='text-2xl font-semibold tracking-tight pb-4'>
								Things to know
							</h4>
							<div className='grid grid-cols-2'>
								<div className=''>
									<p className='font-bold'>House Rules</p>
									{tempValues.HOUSE_RULES.map((rule) => (
										<p className='py-1' key={rule.id}>
											{rule.rule}
										</p>
									))}
								</div>
								<div>
									<p className='font-bold'>Safety & Property</p>
									{tempValues.SAFETY_PROPERTY.map((rule) => (
										<p className='py-1' key={rule.id}>
											{rule.rule}
										</p>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Modal for Full Image */}
			{isOpen && (
				<div
					className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50'
					onClick={closeModal}
				>
					<img
						src='https://picsum.photos/600/400'
						alt='Full view property'
						className='max-w-[90vw] max-h-[90vh] object-contain rounded-md'
					/>
				</div>
			)}
		</ResponsiveLayout>
	);
}
