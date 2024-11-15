import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { DirectionsRenderer, GoogleMap, Marker } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from '@/components/ui/popover';
import Distance from '@/components/google/distance';

interface SideReviewsProps {
	propertyId: number;
	propertyLoc: any;
	propertyReviews: any;
	landmarks: any;
}

const SideMap: React.FC<SideReviewsProps> = ({
	propertyId,
	propertyLoc,
	propertyReviews,
	landmarks,
}) => {
	const [locationAverage, setLocationAverage] = useState<number>(0);
	const [directions, setDirections] = useState<any>(null);
	const [userPosition, setUserPosition] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [position, setPosition] = useState(propertyLoc);
	const [landmarkDirections, setLandmarkDirections] = useState<any[]>([]);

	useEffect(() => {
		if (propertyReviews.length > 0) {
			const averageLocation = propertyReviews.reduce(
				(sum, review) => sum + review.location,
				0
			);
			setLocationAverage(averageLocation / propertyReviews.length);
		}
	}, [propertyId, propertyReviews]);

	useEffect(() => {
		handleAddUserLocation();
	}, []);

	useEffect(() => {
		if (userPosition) {
			fetchDirections();
		}
	}, [userPosition]);

	useEffect(() => {
		fetchDirectionsForLandmarks();
	}, [landmarks]);

	const fetchDirectionsForLandmarks = () => {
		// GOOGLE MAP DIRECTION SERVICE NEEDS TO BE CLICKED BECAUSE REFERENCE ERROR WHEN PAGE LOADS

        const directionsService = new google.maps.DirectionsService();
        landmarks.forEach((landmark) => {
            directionsService.route(
                {
                    origin: propertyLoc,
                    destination: { lat: landmark.latitude, lng: landmark.longitude },
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK && result?.routes[0]?.legs[0]) {
                        //ADJUST HERE
						setLandmarkDirections((prevState) => [...prevState, result]);
                    } else {
                        console.error('Directions request failed:', status);
                    }
                }
            );
        });
		console.log(landmarkDirections)
    };

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
				if (status === google.maps.DirectionsStatus.OK && result?.routes[0]?.legs[0]) {
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
		if (averageScore > 0) return 'Bad';
		return 'No Reviews';
	};

	const ratingDescription = mapScoreToRating(locationAverage);

	return (
		<div>
			<Card className='bg-white dark:bg-secondary border border-gray-300'>
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

						<p className='text-lg mb-0 pb-0 font-bold mt-2 dark:text-gray-100'>
							{locationAverage.toFixed(1)} {ratingDescription}
						</p>
						<p className='text-sm pt-0 mt-0 dark:text-gray-300'>
							Location Rating Score
						</p>
						<span className='text-sm pt-0 mt-0 dark:text-gray-300'>
						Distance from the center:            
						{directions?.routes[0]?.legs[0] ? <Distance leg={directions.routes[0].legs[0]} /> : 'N/A'}
						</span>
						

						<div className='border-t border-gray-300 my-2' />
						<div>
							<p className='text-sm font-semibold dark:text-gray-100'>
								Nearby landmarks
							</p>
							{landmarks.slice(0, 4).map((landmark, index) => (
								<div
									key={index}
									className='flex justify-between items-center mt-1 dark:text-gray-300'
								>
									<p className='text-xs'>{landmark.name}</p>
									{landmark.directions
										? `${(landmark.directions.distance?.text || '')} (${landmark.directions.duration?.text || ''})`
										: 'N/A'}
								</div>
							))}
							{landmarks.length > 4 && (
								<Popover>
									<PopoverTrigger asChild>
										<button className='text-xs text-blue-500 mt-2 dark:text-blue-300'>
											See more
										</button>
									</PopoverTrigger>
									<PopoverContent
										align='end'
										side='top'
										className='p-4 bg-white shadow-xl border-gray-200'
									>
										<p className='text-sm font-semibold dark:text-neutral-800'>
											Nearby landmarks
										</p>
										{landmarks.map((landmark, index) => (
											<div
												key={index}
												className='flex justify-between items-center dark:text-neutral-700'
											>
												<p className='text-xs'>{landmark.name}</p>
												<p className='text-xs text-right'>
												{landmark.directions
                                                        ? `${(landmark.directions.distance?.text || '')} (${landmark.directions.duration?.text || ''})`
                                                        : 'N/A'}
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
