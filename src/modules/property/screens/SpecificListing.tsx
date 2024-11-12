'use client';
import React, { useState, useEffect } from 'react';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import {
	ArrowUpRight,
	Axis3D,
	Bed,
	Check,
	Glasses,
	MapPin,
	User,
	User2,
	UserCheck,
	UserCheck2,
	Users2,
} from 'lucide-react';
import BusinessReviews from '../components/BusinessReviews';
import MainPreview from '../components/MainPreview';
import PropertyDetails from '../components/PropertyDetails';
import Banner from '../components/Banner';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { NavbarModalLogin } from '@/components/navbar/NavbarModalLogin';
import {
	fetchUser,
	fetchProperty,
	toggleFavourite,
	fetchFavorite,
	fetchPropertyLocation,
	fetchPropertyReviews,
} from '@/actions/listings/specific-listing';
import ErrorPage from '@/components/ui/ErrorPage';
import {
	Marker,
	GoogleMap,
	DirectionsService,
	DirectionsRenderer,
} from '@react-google-maps/api';
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
import UnitGalleryModal from '../components/UnitGalleryModal';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { BookingCardModal } from '../components/BookingCardModal';

interface SpecificListingProps {
	id: number;
}

export function SpecificListing({ id }: SpecificListingProps) {
	const [isFavourite, setIsFavourite] = useState(false);
	const [property, setProperty] = useState<any | null>(null);
	const [propertyReviews, setPropertyReviews] = useState<any>(null);
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
	const [isUnitGalleryModalOpen, setIsUnitGalleryModalOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

	useEffect(() => {
		const loadUserAndProperty = async () => {
			try {
				const fetchedUserId = await fetchUser();
				setUserId(fetchedUserId);

				const { property } = await fetchProperty(id, fetchedUserId);
				if (!property) {
					setError(true); // error if property's not found
					setLoading(false);
					return;
				}

				setProperty(property);
				setPropertyReviews(await fetchPropertyReviews(id));
				setIsFavourite(await fetchFavorite(userId, id));
				setAmenitiesList(await get_unitAmenities(property?.id));
				setPosition({
					lat: (await fetchPropertyLocation(id))[0].latitude,
					lng: (await fetchPropertyLocation(id))[0].longitude,
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

	const handleOpenBookingModal = () => {
		setIsBookingModalOpen(true);
	};

	const handleCloseBookingModal = () => {
		setIsBookingModalOpen(false);
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
		address,
		thumbnail_url,
		privacy_type,
		structure,
		description,
		company_id,
		company: {
			logo,
			about,
			owner_id,
			company_name,
			account: { firstname, lastname, profile_url },
		},
	} = property;

	return (
		<ResponsiveLayout>
			{/* paki fix breadcrumbs */}
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

			{/* OVERVIEW */}
			<div
				className='grid lg:grid-cols-3 grid-cols-1 lg:gap-4 md:gap-0'
				id='overview'
			>
				<div className='col-span-2 space-y-5'>
					<PropertyDetails
						privacyType={privacy_type}
						structure={structure}
						bedrooms={1}
						beds={1}
						occupants={5}
						description={description}
						amenitiesList={amenitiesList}
					/>
					<Banner
						ownerName={property.company.account.firstname}
						ownerLastname={property.company.account.lastname}
						ownerId={property.company.owner_id}
						companyId={property.company_id}
						companyName={property.company.company_name}
						propertyId={id}
						profileUrl={property.company.account.profile_url}
						session={userId}
					/>
				</div>

				<div className='col-span-1 lg:mt-0 md:mt-4 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto'>
					<div>
						<SideReviews
							propertyId={property.id}
							propertyReviews={propertyReviews}
						/>
					</div>
					<div className='mt-4'>
						<SideMap
							propertyId={property.id}
							propertyLoc={position}
							propertyReviews={propertyReviews}
						/>
					</div>
				</div>
			</div>

			{/* ROOMS */}
			<div className='flex flex-col border-t border-gray-300 py-8' id='rooms'>
				<h4 className='text-2xl font-semibold tracking-tight pb-4'>
					Available Rooms
				</h4>
				<Card className='bg-white dark:bg-secondary border border-gray-300'>
					<CardHeader>
						<CardTitle className='text-lg'>
							{/* Magreredirect dapat to sa modal ng 'View all photos -> rooms tab -> specific room target highlight or outline */}
							<Button
								onClick={() => setIsUnitGalleryModalOpen(true)}
								className='text-primary dark:text-blue-300 underline text-md font-semibold pl-0'
								variant='link'
							>
								{title}
							</Button>
						</CardTitle>

						<CardDescription className=''>
							<table className='w-full table-auto'>
								<thead>
									<tr className='border-b dark:text-gray-100'>
										<th className='px-4 py-2 text-center'>Details</th>
										<th className='px-4 py-2 text-center'>
											Current Number of Occupants
										</th>
										<th className='px-4 py-2 text-center'>Price</th>
										<th className='px-4 py-2 text-center'>Action</th>
									</tr>
								</thead>
								<tbody>
									<tr className='border-b'>
										<td className='pl-4 py-2 border-r border-gray-300 w-[480px] dark:text-gray-200'>
											<div className='flex items-center'>
												<Bed className='mr-2' size={16} />
												<span>4 beds</span>
											</div>
											<div className='flex items-center'>
												<Users2 className='mr-2' size={16} />
												<span>For: 4 guests</span>
											</div>
											<div className='flex items-center'>
												<Axis3D className='mr-2' size={16} />
												<span>Room size: 18 m²/194 ft²</span>
											</div>
											<div className='flex items-center'>
												<Glasses className='mr-2' size={16} />
												<span>With Outdoor View</span>
											</div>
											<div className='border-t border-gray-300 my-3' />
											<div className='grid lg:grid-cols-2 sm:grid-cols-1'>
												{[
													'Amenity 1',
													'Amenity 2',
													'Amenity 3',
													'Amenity 4',
													'Amenity 5',
												].map((item, index) => (
													<div key={index} className='flex items-center'>
														<Check className='mr-2 text-green-600' size={12} />
														<span>{item}</span>
													</div>
												))}
											</div>
										</td>

										<td className='pl-4 py-2 border-r border-gray-300 max-w-[10px] text-center'>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<div className='flex justify-center items-center space-x-1 cursor-pointer'>
															{Array.from({ length: 4 }, (_, i) =>
																i < 2 ? (
																	<UserCheck2
																		key={i}
																		className='text-primary dark:text-blue-300'
																	/>
																) : (
																	<User2
																		key={i}
																		className='text-gray-500 dark:text-gray-200'
																	/>
																)
															)}
														</div>
													</TooltipTrigger>
													<TooltipContent>
														<p>2 occupants — 2 spots available</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</td>

										<td className='pl-4 py-2 border-r border-gray-300 text-center dark:text-gray-200'>
											P10,500/month
										</td>
										<td className='py-2 flex justify-center items-center my-16'>
											<Button
												className='text-white px-4 py-2 rounded'
												onClick={handleOpenBookingModal}
											>
												Book Now
											</Button>
										</td>
									</tr>
								</tbody>
							</table>
						</CardDescription>
					</CardHeader>
				</Card>
			</div>

			<UnitGalleryModal
				isOpen={isUnitGalleryModalOpen}
				onClose={() => setIsUnitGalleryModalOpen(false)}
				images={property.images || []}
				reviews={propertyReviews || []}
				locationPercentage={85}
				cleanlinessPercentage={90}
				valueForMoneyPercentage={80}
				setSelectedImage={(url) => console.log('Image selected:', url)}
			/>

			<BookingCardModal
				isOpen={isBookingModalOpen}
				onClose={handleCloseBookingModal}
			/>

			{/* REVIEWS */}
			<div
				className='flex flex-col border-t border-gray-300 py-8 mr-4'
				id='reviews'
			>
				<h4 className='text-2xl font-semibold tracking-tight pb-4'>
					Customer Reviews
				</h4>
				<BusinessReviews
					unitId={property?.id}
					propertyReviews={propertyReviews}
				/>
			</div>

			{/* LOCATION */}
			<div
				className='flex flex-col border-t border-gray-300 py-8 mr-4'
				id='location'
			>
				<div className='flex items-center justify-between pb-4'>
					<h4 className='text-2xl font-semibold tracking-tight'>Location</h4>
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
		</ResponsiveLayout>
	);
}
