'use client';
import React, { useState, useEffect } from 'react';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { ArrowUpRight, MapPin } from 'lucide-react';
import BusinessReviews from '../components/BusinessReviews';
import MainPreview from '../components/MainPreview';
import PropertyDetails from '../components/PropertyDetails';
import Banner from '../components/Banner';
import { BookingCard } from '../components/BookingCard';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { Card } from '@/components/ui/card';
import { NavbarModalLogin } from '@/components/navbar/NavbarModalLogin';
import {
	fetchUser,
	fetchProperty,
	toggleFavourite,
} from '@/actions/listings/specific-listing';
import ErrorPage from '@/components/ui/ErrorPage';
import {
	Marker,
	GoogleMap,
	DirectionsService,
	DirectionsRenderer,
} from '@react-google-maps/api';
import { getSpecificLocation } from '@/actions/listings/listing-filter';
import { get_unitAmenities } from '@/actions/listings/amenities';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import LoadingPage from '@/components/LoadingPage';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface SpecificListingProps {
	id: number;
}

export function SpecificListing({ id }: SpecificListingProps) {
	const [isFavourite, setIsFavourite] = useState(false);
	const [property, setProperty] = useState<any | null>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [amenitiesList, setAmenitiesList] = useState<any[]>([]);
	const [position, setPosition] = useState({
		lat: 16.420039834357972,
		lng: 120.59908426196893,
	});
	const [userPosition, setUserPosition] = useState<{
		lat: number;
		lng: number;
	} | null>(null);
	const [directions, setDirections] = useState(null);

	useEffect(() => {
		const loadUserAndProperty = async () => {
			try {
				const fetchedUserId = await fetchUser();
				setUserId(fetchedUserId);

				const { unit, favorite } = await fetchProperty(id, fetchedUserId);
				if (!unit) {
					setError(true); // error if property's not found
					setLoading(false);
					return;
				}

				setProperty(unit);
				setIsFavourite(favorite);
				setAmenitiesList(await get_unitAmenities(unit?.id));
				setPosition({
					lat: (await getSpecificLocation(unit?.id))?.lat,
					lng: (await getSpecificLocation(unit?.id))?.lng,
				});
				setLoading(false);
			} catch (err) {
				setError(true);
				setLoading(false);
			}
		};

		loadUserAndProperty();
	}, [id]);

	const handleToggleFavourite = async () => {
		if (!userId) {
			setIsLoginModalOpen(true);
			return;
		}

		const success = await toggleFavourite(isFavourite, userId, property?.id);
		if (success) {
			setIsFavourite(!isFavourite);
		}
	};

	const handleLoginSuccess = async () => {
		setIsLoginModalOpen(false);
		const fetchedUserId = await fetchUser();
		setUserId(fetchedUserId);
	};

	const handleAddUserLocation = () => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				if (position.coords.accuracy > 100) {
					toast.error(
						'Location accuracy is too low. Manually search location or use a mobile device instead.'
					);
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

	if (loading)
		return (
			<div>
				<LoadingPage />
			</div>
		);
	if (error) {
		return <ErrorPage />;
	}
	if (!property) return <div>No property found.</div>;

	const {
		title,
		price,
		property: { address, company },
		thumbnail_url,
		profile_url,
		privacy_type,
		structure,
		bedrooms,
		beds,
		occupants,
		description,
	} = property;

	return (
		<ResponsiveLayout>
			<div className='grid grid-cols-5 gap-2 mt-4'>
				<MainPreview propertyId={property.id} />
			</div>

			<div className='grid lg:grid-cols-3 grid-cols-1 gap-4 my-6'>
				<div className='col-span-2 space-y-5'>
					<div className='flex justify-between items-center'>
						<div>
							<h1 className='font-semibold text-3xl dark:text-white'>
								{title}
							</h1>

							<p className='flex items-center text-muted-foreground'>
								<MapPin className='mr-1' height={18} width={18} />
								{address}
							</p>
						</div>
						<div className='relative flex items-center mr-3'>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<div
											onClick={handleToggleFavourite}
											className='cursor-pointer'
										>
											{isFavourite ? (
												<HeartSolid className='h-8 w-8 text-red-500 ' />
											) : (
												<HeartOutline className='h-8 w-8 text-gray-500 dark:text-gray-300' />
											)}
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>
											{isFavourite
												? 'Remove from favorites'
												: 'Add to favorites'}
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>

					{/* <div className='flex items-center border-y border-gray-300 py-4'>
						<Avatar className='mr-4'>
							<AvatarImage src={company?.owner_id?.profile_url} />
							<AvatarFallback>
								{company?.owner_id?.firstname[0]}
								{company?.owner_id?.lastname[0]}
							</AvatarFallback>
						</Avatar>
						<div className='flex flex-col'>
							<h3 className='font-bold text-base'>
								{company?.owner_id?.firstname} {company?.owner_id?.lastname}
							</h3>
							<p className='text-sm text-gray-700'>Property Owner</p>
						</div>
					</div> */}

					<Banner
						ownerName={company?.owner_id?.firstname}
						ownerLastname={company?.owner_id?.lastname}
						ownerId={company?.owner_id?.id}
						companyId={company.id}
						companyName={company?.company_name}
						propertyId={property?.id}
						profileUrl={company?.owner_id?.profile_url}
						session={userId}
					/>

					<PropertyDetails
						privacyType={privacy_type}
						structure={structure}
						bedrooms={bedrooms}
						beds={beds}
						occupants={occupants}
						description={description}
						amenitiesList={amenitiesList}
					/>
				</div>

				<div className='flex lg:justify-end lg:items-start col-span-full lg:col-span-1'>
					<div className='w-max h-max sticky top-20'>
						<BookingCard price={price} unitId={property?.id} />
					</div>
				</div>
			</div>

			<div className='flex flex-col border-t border-gray-300 py-8 mr-4'>
				<h4 className='text-2xl font-semibold tracking-tight pb-4'>
					Customer Reviews
				</h4>
				<BusinessReviews unitId={property?.id} />
			</div>

			<div className='flex flex-col border-t border-gray-300 py-8 mr-4'>
				<div className='flex items-center justify-between pb-4'>
					<h4 className='text-2xl font-semibold tracking-tight'>
						Where you&apos;ll be
					</h4>
					<Button
						className='flex items-center w-40 border border-blue-500 text-blue-500 py-2 px-4 rounded hover:bg-blue-50 dark:hover:bg-blue-900 dark:text-white bg-foreground'
						onClick={handleAddUserLocation}
					>
						<ArrowUpRight className='mr-2' /> Show Directions
					</Button>
				</div>
				<Card className='lg:h-[550px] xs:h-[365px] border-none'>
					<GoogleMap
						mapContainerClassName='w-full h-full'
						zoom={14}
						center={userPosition || position}
					>
						{userPosition && <Marker position={userPosition} />}
						<Marker position={position} />
						{directions && <DirectionsRenderer directions={directions} />}
					</GoogleMap>
				</Card>
			</div>

			{isLoginModalOpen && (
				<NavbarModalLogin
					isOpen={isLoginModalOpen}
					onClose={() => setIsLoginModalOpen(false)}
					openModal={() => setIsLoginModalOpen(true)}
					onLoginSuccess={handleLoginSuccess}
				/>
			)}
		</ResponsiveLayout>
	);
}
