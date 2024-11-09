'use client';
import React, { useState, useEffect } from 'react';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { ArrowUpRight, MapPin } from 'lucide-react';
import BusinessReviews from '../components/BusinessReviews';
import MainPreview from '../components/MainPreview';
import PropertyDetails from '../components/PropertyDetails';
import Banner from '../components/Banner';
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
import { BreadcrumbSection } from '@/components/breadcrumb/BreadrumbSection';
import SpecificListingTabs from '../components/SpecificListingTabs';
import RightReviews from '../components/SideReviews';
import SideReviews from '../components/SideReviews';
import SideMap from '../components/SideMap';

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
			<BreadcrumbSection />
			<div className='flex justify-between items-center mt-4'>
				<div>
					<h1 className='font-semibold text-3xl dark:text-white'>{title}</h1>
					<p className='flex items-center text-muted-foreground'>
						<MapPin className='mr-1' height={18} width={18} />
						{address}
					</p>
				</div>
				<div className='relative flex items-center'>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<Button
									onClick={handleToggleFavourite}
									className='cursor-pointer flex items-center space-x-1 bg-transparent hover:bg-gray-200'
									size='sm'
								>
									{isFavourite ? (
										<HeartSolid className='h-6 w-6 text-red-500 ' />
									) : (
										<HeartOutline className='h-6 w-6 text-gray-500 dark:text-gray-300' />
									)}
									<span className='text-gray-500 dark:text-gray-300 underline'>
										{isFavourite ? 'Saved' : 'Save'}
									</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>
									{isFavourite ? 'Remove from favorites' : 'Save to favorites'}
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>

			<div className='grid grid-cols-5 gap-2 mt-4'>
				<MainPreview propertyId={property.id} />
			</div>

			<div className='sticky top-[80px] z-10 shadow-lg rounded-lg'>
				<SpecificListingTabs />
			</div>

			<div className='grid lg:grid-cols-3 grid-cols-1 lg:gap-4 md:gap-0'>
				<div className='col-span-2 space-y-5'>
					<PropertyDetails
						privacyType={privacy_type}
						structure={structure}
						bedrooms={bedrooms}
						beds={beds}
						occupants={occupants}
						description={description}
						amenitiesList={amenitiesList}
					/>
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
				</div>

				<div className='col-span-1 lg:mt-0 md:mt-4'>
					<div className=''>
						{/* <BookingCard price={price} unitId={property?.id} /> */}
						<SideReviews propertyId={property.id} />
					</div>
					<div className='mt-4'>
						<SideMap propertyId={property.id} />
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
