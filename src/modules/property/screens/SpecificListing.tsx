/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import {
	Axis3D,
	Bed,
	Check,
	Glasses,
	MapPin,
	User2,
	UserCheck2,
	Users2,
	House,
	Shield,
} from 'lucide-react';
import BusinessReviews from '../components/BusinessReviews';
import MainPreview from '../components/MainPreview';
import PropertyDetails from '../components/PropertyDetails';
import Banner from '../components/Banner';
import {
	ChevronDoubleUpIcon,
	HeartIcon as HeartOutline,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { addAnalytics } from '@/actions/analytics/propertyAnalytics';
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
	fetchPropertyFacilities,
	fetchPropertyUnits,
} from '@/actions/listings/specific-listing';
import ErrorPage from '@/components/ui/ErrorPage';
import { Marker, GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
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
import SideReviews from '../components/SideReviews';
import SideMap from '../components/SideMap';
import UnitGalleryModal from '../components/UnitGalleryModal';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { BookingCardModal } from '../components/BookingCardModal';
import { useSearchParams } from 'next/navigation';
import { fetchLandmarks } from '@/actions/landmarks/landmark';

interface SpecificListingProps {
	id: number;
}

type SearchParams = {
	amenities?: string | string[];
	privacy?: string;
	minPrice?: string;
	maxPrice?: string;
	room?: string;
	bed?: string;
};

export function SpecificListing({ id }: SpecificListingProps) {
	const [isFavourite, setIsFavourite] = useState(false);
	const [property, setProperty] = useState<any | null>(null);
	const [propertyReviews, setPropertyReviews] = useState<any>(null);
	const [units, setUnits] = useState<any>(null);
	const [commonFacilities, setCommonFacilities] = useState<any>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
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
	const [selectedUnit, setSelectedUnit] = useState<any>(null);
	const [selectedUnitTitle, setSelectedUnitTitle] = useState<any>(null);
	const [selectedUnitPrice, setSelectedUnitPrice] = useState(0);
	const [unitImage, setUnitImage] = useState<any>(null);
	const [unitCount, setUnitCount] = useState(0);
	const [totalOccupants, setTotalOccupants] = useState(0);
	const [landmarks, setLandmarks] = useState([]);
	const [availableSpots, setAvailableSpots] = useState<number | null>(null);

	//Parameter Filters
	const searchParams = useSearchParams();

	const getSearchParam = (
		param: keyof SearchParams
	): string | string[] | null => {
		if (param === 'amenities') {
			const amenities = searchParams.getAll('amenities');
			return amenities.length > 0 ? amenities : null;
		}
		const value = searchParams.get(param);
		return value ?? null;
	};

	const amenities = getSearchParam('amenities');
	const privacy = getSearchParam('privacy');
	const minPrice = getSearchParam('minPrice');
	const maxPrice = getSearchParam('maxPrice');
	const room = getSearchParam('room');
	const bed = getSearchParam('bed');

	useEffect(() => {
		const loadUserAndProperty = async () => {
			try {
				const fetchedLandmark = await fetchLandmarks();
				setLandmarks(fetchedLandmark);

				const fetchedUserId = await fetchUser();
				setUserId(fetchedUserId);

				setIsFavourite(await fetchFavorite(userId, id));

				const { property } = await fetchProperty(id, fetchedUserId);
				if (!property) {
					setError(true);
					setLoading(false);
					return;
				}

				setProperty(property);
				setPropertyReviews(await fetchPropertyReviews(id));
				setCommonFacilities(await fetchPropertyFacilities(id));
				setPosition({
					lat: (await fetchPropertyLocation(id))[0].latitude,
					lng: (await fetchPropertyLocation(id))[0].longitude,
				});
				const fetchedUnits = await fetchPropertyUnits(id);
				setUnits(fetchedUnits);
				setUnitCount(fetchedUnits.length || 0);

				const occupantsCount = fetchedUnits.reduce(
					(total, unit) => total + unit.current_occupants,
					0
				);
				setTotalOccupants(occupantsCount);
				await addAnalytics(property?.id, property?.company_id);
				setLoading(false);
			} catch (err) {
				setError(true);
			}
		};
		loadUserAndProperty();
		console.log(property);
	}, [id, isFavourite]);

	const sortedUnits = useMemo(() => {
		if (!Array.isArray(units) || units.length === 0) {
			return [];
		}

		return [...units].sort((a, b) => {
			let scoreA = 0;
			let scoreB = 0;

			// Price range scoring (Highest priority)
			if (minPrice && maxPrice) {
				const minP = parseInt(minPrice as string);
				const maxP = parseInt(maxPrice as string);
				const aDistance = Math.min(
					Math.abs(a.price - minP),
					Math.abs(a.price - maxP)
				);
				const bDistance = Math.min(
					Math.abs(b.price - minP),
					Math.abs(b.price - maxP)
				);
				if (aDistance < bDistance) scoreA += 100;
				if (bDistance < aDistance) scoreB += 100;
			}

			// Rooms and beds scoring (Second priority)
			if (room) {
				const targetRoom = parseInt(room as string);
				if (a.bedrooms === targetRoom) scoreA += 50;
				if (b.bedrooms === targetRoom) scoreB += 50;
			}

			if (bed) {
				const targetBed = parseInt(bed as string);
				if (a.beds === targetBed) scoreA += 50;
				if (b.beds === targetBed) scoreB += 50;
			}

			// Amenity matching score (Third priority)
			if (amenities && Array.isArray(amenities)) {
				const aAmenities = new Set(a.amenities);
				const bAmenities = new Set(b.amenities);
				const aMatches = amenities.filter((am) => aAmenities.has(am)).length;
				const bMatches = amenities.filter((am) => bAmenities.has(am)).length;

				scoreA += aMatches * 10; // Weight for each matching amenity
				scoreB += bMatches * 10;
			}

			// Privacy type scoring (Lowest priority)
			if (privacy) {
				if (a.privacy_type === privacy) scoreA += 5;
				if (b.privacy_type === privacy) scoreB += 5;
			}

			// Sort by descending score
			return scoreB - scoreA;
		});
	}, [units]);

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

	useEffect(() => {
		if (userPosition) {
			fetchDirections();
		}
	}, [userPosition]);

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
				travelMode: google.maps.TravelMode.WALKING,
			},
			(result, status) => {
				if (
					status === google.maps.DirectionsStatus.OK &&
					result?.routes[0]?.legs[0]
				) {
					setDirections(result);
				} else {
					console.error('Directions request failed:', status);
				}
			}
		);
	};

	const handleOpenBookingModal = (
		unit_id: number,
		availableSpots: number,
		unitPrice: number,
		unitTitle: string
	) => {
		setIsBookingModalOpen(true);
		setSelectedUnit(unit_id);
		setAvailableSpots(availableSpots);
		setSelectedUnitPrice(unitPrice);
		setSelectedUnitTitle(unitTitle);
		// const unit = units.find((u) => u.id === unit_id);
		// setSelectedUnitOccupants(unit ? unit.occupants : 0);
	};

	const handleCloseBookingModal = () => {
		setIsBookingModalOpen(false);
		setSelectedUnit(null);
	};

	const handleOpenUnitGallery = (unit_image: any) => {
		setUnitImage(unit_image);
		setIsUnitGalleryModalOpen(true);
	};

	const handleCloseUnitGallery = () => {
		setUnitImage(null);
		setIsUnitGalleryModalOpen(false);
	};
	const [showBackToTop, setShowBackToTop] = useState(false);

	// For back to top
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 100) {
				setShowBackToTop(true);
			} else {
				setShowBackToTop(false);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
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
		address,
		structure,
		description,
		company: {
			account: { id: accountId },
		},
	} = property;

	return (
		<div className='px-32 md:px-24 sm:px-20 xs:px-10 dark:bg-secondary'>
			{/* paki fix breadcrumbs */}
			<div className='pb-1' />
			<BreadcrumbSection propertyName={title}/>
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
				<MainPreview
					propertyId={property.id}
					propertyReviews={propertyReviews}
				/>
			</div>

			<div className='rounded-lg'>
				<SpecificListingTabs />
			</div>

			{/* OVERVIEW */}
			<div
				className='grid lg:grid-cols-3 grid-cols-1 lg:gap-4 md:gap-0'
				id='overview'
			>
				<div className='col-span-2 space-y-5'>
					<PropertyDetails
						structure={structure}
						occupants={totalOccupants}
						description={description}
						facilities={commonFacilities}
						address={address}
						unitCount={unitCount}
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

				<div className='col-span-1 lg:mt-0 md:mt-4 sticky top-20 h-[calc(100vh-90px)] overflow-y-auto'>
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
							landmarks={landmarks}
						/>
					</div>
				</div>
			</div>

			{/* UNITS */}
			<div className='flex flex-col border-t border-gray-300 py-8' id='units'>
				<h4 className='text-2xl font-semibold tracking-tight pb-4'>
					Available Units
				</h4>

				<div className='flex flex-col gap-4 overflow-x-auto'>
					{/* MAP UNITS HERE */}
					{sortedUnits.map((unit) => (
						<Card
							key={unit.id}
							className='bg-white overflow-x-auto min-w-auto dark:bg-secondary border border-gray-300 shadow-md
							'
						>
							<CardHeader>
								<CardTitle className='text-lg'>
									{/* Redirect to the modal for this specific unit */}
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													onClick={() => handleOpenUnitGallery(unit.unit_image)}
													className='text-primary dark:text-blue-300 underline text-md font-semibold pl-0'
													variant='link'
												>
													{unit.title}
												</Button>
											</TooltipTrigger>
											<TooltipContent side='top'>
												<p className='font-normal'>
													Click to view the unit gallery
												</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
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
														<Shield className='mr-2' size={16} />
														<span>Privacy Type: {unit.privacy_type}</span>
													</div>
													<div className='flex items-center'>
														<House className='mr-2' size={16} />
														<span>
															{unit.bedrooms}{' '}
															{unit.bedrooms === 1 ? 'room' : 'rooms'}
														</span>
													</div>
													<div className='flex items-center'>
														<Bed className='mr-2' size={16} />
														<span>
															{unit.beds} {unit.beds === 1 ? 'bed' : 'beds'}
														</span>
													</div>
													<div className='flex items-center'>
														<Users2 className='mr-2' size={16} />
														<span>
															For: {unit.occupants}{' '}
															{unit.occupants === 1 ? 'guest' : 'guests'}
														</span>
													</div>
													<div className='flex items-center'>
														<Axis3D className='mr-2' size={16} />
														<span>
															Room size:{' '}
															{unit.room_size > 0
																? `${unit.room_size} m²`
																: 'N/A'}
														</span>
													</div>
													<div className='flex items-center'>
														<Glasses className='mr-2' size={16} />
														<span>
															{unit.outside_view
																? 'With Outdoor View'
																: 'No Outdoor View'}
														</span>
													</div>
													<div className='border-t border-gray-300 my-3' />
													<div className='grid lg:grid-cols-2 sm:grid-cols-1'>
														{unit.amenities && unit.amenities.length > 0 && (
															<div className='grid lg:grid-cols-2 sm:grid-cols-1'>
																{unit.amenities.map((amenity, index) => (
																	<div
																		key={index}
																		className='flex items-center'
																	>
																		<Check
																			className='mr-2 text-green-600'
																			size={12}
																		/>
																		<span>{amenity}</span>
																	</div>
																))}
															</div>
														)}
													</div>
												</td>

												<td className='px-4 py-2 border-r border-gray-300 max-w-[10px] text-center'>
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger asChild>
																<div className='flex justify-center items-center space-x-1 cursor-pointer'>
																	{Array.from(
																		{ length: unit.occupants },
																		(_, i) =>
																			i < unit.current_occupants ? (
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
																<p>
																	{unit.current_occupants} occupant
																	{unit.current_occupants !== 1
																		? 's'
																		: ''} —{' '}
																	{unit.occupants - unit.current_occupants} spot
																	{unit.occupants - unit.current_occupants !== 1
																		? 's'
																		: ''}{' '}
																	available
																</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</td>

												<td className='px-4 py-2 border-r border-gray-300 text-center dark:text-gray-200'>
													P{unit.price}/month
												</td>

												<td className='py-2 border-r border-gray-300 text-center dark:text-gray-200 px-4'>
													<Button
														className='text-white px-4 py-2 rounded'
														onClick={() =>
															handleOpenBookingModal(
																unit.id,
																unit.occupants - unit.current_occupants,
																unit.price,
																unit.title
															)
														}
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
					))}
				</div>
			</div>

			<UnitGalleryModal
				isOpen={isUnitGalleryModalOpen}
				onClose={() => handleCloseUnitGallery()}
				images={unitImage}
			/>

			<BookingCardModal
				isOpen={isBookingModalOpen}
				onClose={handleCloseBookingModal}
				unitID={selectedUnit}
				availableSpots={availableSpots}
				unitPrice={selectedUnitPrice}
				accountID={accountId}
				propertyTitle={title}
				unitTitle={selectedUnitTitle}
			/>

			{/* REVIEWS */}
			<div className='flex flex-col border-t border-gray-300 py-8' id='reviews'>
				<h4 className='text-2xl font-semibold tracking-tight pb-4'>
					Customer Reviews
				</h4>
				<BusinessReviews propertyId={id} propertyReviews={propertyReviews} />
			</div>

			{/* LOCATION */}
			<div
				className='flex flex-col border-t border-gray-300 py-8'
				id='location'
			>
				<div className='flex items-center justify-between pb-4'>
					<h4 className='text-2xl font-semibold tracking-tight'>Location</h4>
					<Button
						className='text-primary hover:bg-background dark:text-foreground dark:bg-primary border-primary gap-2 items-center justify-center'
						variant='outline'
						onClick={handleAddUserLocation}
					>
						<MapPin className='h-5 w-5' />
						Show Direction
					</Button>
				</div>
				<Card className='lg:h-[550px] xs:h-[365px] border-none'>
					<GoogleMap
						mapContainerClassName='w-full h-full rounded-md'
						zoom={14}
						center={userPosition || position}
					>
						{userPosition && <Marker position={userPosition} />}
						<Marker position={position} />
						{directions && <DirectionsRenderer directions={directions} />}
					</GoogleMap>
				</Card>
			</div>

			{/* HOUSE RULES */}
			<div
				className='flex flex-col border-t border-gray-300 pt-8 pb-16'
				id='houserules'
			>
				<div className='flex items-center justify-between pb-4'>
					<h4 className='text-2xl font-semibold tracking-tight'>House Rules</h4>
				</div>

				{/* Dummy House Rules Content */}
				<ul className='list-disc pl-5 space-y-3'>
					<li>
						<span className='font-medium'>No Smoking: </span> Smoking is
						strictly prohibited inside the property.
					</li>
					<li>
						<span className='font-medium'>No Pets: </span> Pets are not allowed
						without prior permission.
					</li>
					<li>
						<span className='font-medium'>Quiet Hours: </span>Quiet hours are
						from 10 PM to 7 AM to respect neighbors.
					</li>
				</ul>
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
			{showBackToTop && (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								onClick={scrollToTop}
								className='fixed bottom-16 right-1 lg:right-5 md:right-5 sm:right-5 bg-primary text-white p-2 mb-10 rounded-full shadow-lg'
							>
								<ChevronDoubleUpIcon className='lg:h-8 lg:w-8 md:h-5 md:w-5 xs:h-4 xs:w-4' />
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Back to Top</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}
		</div>
	);
}
