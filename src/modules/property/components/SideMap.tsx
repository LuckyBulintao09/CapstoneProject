import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { DirectionsRenderer, GoogleMap, Marker } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from '@/components/ui/popover';

interface SideReviewsProps {
	propertyId: number;
}

const SideMap: React.FC<SideReviewsProps> = ({ propertyId }) => {
	const [reviews, setReviews] = useState<any[]>([]);
	const [locationAverage, setLocationAverage] = useState<number>(0);
	const [directions, setDirections] = useState<any>(null);
	const supabase = createClient();

	const [userPosition, setUserPosition] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [position, setPosition] = useState({
		lat: 16.420039834357972,
		lng: 120.59908426196893,
	});

	const landmarks = [
		{ name: 'SM Baguio City', distance: 1.0 },
		{ name: 'Burnham Park', distance: 1.2 },
		{ name: 'Session Road', distance: 1.5 },
		{ name: 'Mines View Park', distance: 2.3 },
		{ name: 'Botanical Garden', distance: 1.8 },
		{ name: 'Wright Park', distance: 2.0 },
		{ name: 'The Mansion', distance: 2.1 },
		{ name: 'Our Lady of Lourdes Grotto', distance: 3.0 },
	];
	useEffect(() => {
		const fetchReviews = async () => {
			const { data, error } = await supabase
				.from('ratings_review')
				.select(
					'user_id, ratings, comment, location, cleanliness, value_for_money'
				)
				.eq('unit_id', propertyId);

			if (error) {
				console.error('Error fetching reviews:', error);
			} else if (data) {
				setReviews(data);
				const totalReviews = data.length;

				if (totalReviews > 0) {
					const locationSum = data.reduce(
						(sum, review) => sum + review.location,
						0
					);
					setLocationAverage(locationSum / totalReviews);
				}
			}
		};

		fetchReviews();
	}, [propertyId, supabase]);

	const handleAddUserLocation = () => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				if (position.coords.accuracy > 100) {
					console.error('Location accuracy is too low. Please try again.');
				} else {
					setUserPosition({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					});
					fetchDirections();
				}
			},
			(error) => {
				console.error('Error fetching user location:', error);
			}
		);
	};

	const fetchDirections = () => {
		if (!userPosition) return;

		const directionsService = new google.maps.DirectionsService();
		directionsService.route(
			{
				origin: userPosition,
				destination: position,
				travelMode: google.maps.TravelMode.DRIVING,
			},
			(result, status) => {
				if (status === google.maps.DirectionsStatus.OK) {
					setDirections(result);
				} else {
					console.error('Directions request failed:', status);
				}
			}
		);
	};

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

	const ratingDescription = mapScoreToRating(locationAverage);

	return (
		<div>
			<Card className='bg-white border border-gray-300'>
				<CardHeader>
					<CardDescription>
						<GoogleMap
							mapContainerClassName='w-full h-44 rounded-sm'
							zoom={14}
							center={userPosition || position}
							options={{
								fullscreenControl: false,
							}}
						>
							{userPosition && <Marker position={userPosition} />}
							<Marker position={position} />
							{directions && <DirectionsRenderer directions={directions} />}
						</GoogleMap>

						<p className='text-lg mb-0 pb-0 font-bold mt-2'>
							{locationAverage.toFixed(1)} {ratingDescription}
						</p>
						<p className='text-sm pt-0 mt-0'>Location Rating Score</p>
						<span className='text-sm pt-0 mt-0'>
							1.2 kilometers from the center
						</span>

						<div className='border-t border-gray-300 my-2' />
						<div>
							<p className='text-sm font-semibold'>Nearby landmarks</p>
							{landmarks.slice(0, 4).map((landmark, index) => (
								<div
									key={index}
									className='flex justify-between items-center mt-1'
								>
									<p className='text-xs'>{landmark.name}</p>
									<p className='text-xs text-right'>{landmark.distance} km</p>
								</div>
							))}
							{landmarks.length > 4 && (
								<Popover>
									<PopoverTrigger asChild>
										<button className='text-xs text-blue-500 mt-2'>
											See more
										</button>
									</PopoverTrigger>
									<PopoverContent
										align='end'
										side='top'
										className='p-4 bg-white shadow-xl border-gray-200'
									>
										<p className='text-sm font-semibold'>Nearby landmarks</p>
										{landmarks.map((landmark, index) => (
											<div
												key={index}
												className='flex justify-between items-center'
											>
												<p className='text-xs'>{landmark.name}</p>
												<p className='text-xs text-right'>
													{landmark.distance} km
												</p>
											</div>
										))}
									</PopoverContent>
								</Popover>
							)}
						</div>
					</CardDescription>
				</CardHeader>
			</Card>
		</div>
	);
};

export default SideMap;
