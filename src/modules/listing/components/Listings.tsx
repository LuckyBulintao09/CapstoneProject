import React, { useContext, useEffect, useState } from 'react';
import BranchListings from '@/components/cardListings/BranchListings';
import { Button } from '@/components/ui/button';
import { ArrowDownUp, Filter, MinusCircle, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { GoogleMap } from '@react-google-maps/api';
import { MapContext } from './ListingsPage';
import { getAllAmenities } from '@/actions/listings/amenities';
import LoadingPage from '@/components/LoadingPage';
import { get_allProperties } from '@/actions/listings/filtering-complete';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Slider } from '@nextui-org/slider';
import FilterModal from './FilterModal';

const householdPrivacyTypes = [
	{ value: 'Private Room', label: 'Private Room' },
	{ value: 'Shared Room', label: 'Shared Room' },
	{ value: 'Whole Place', label: 'Whole Place' },
];

const propertyStructureOptions = [
	{ value: 'Dormitory', label: 'Dormitory' },
	{ value: 'Apartment', label: 'Apartment' },
	{ value: 'Condominium', label: 'Condominium' },
];

const propertyRating = [
	{ value: 1, label: '1 star' },
	{ value: 2, label: '2 stars' },
	{ value: 3, label: '3 stars' },
	{ value: 4, label: '4 stars' },
	{ value: 5, label: '5 stars' },
];

const reviewScore = [
	{ value: 1, label: 'Wonderful: 9+' },
	{ value: 2, label: 'Very Good: 8+' },
	{ value: 3, label: 'Good: 7+' },
	{ value: 4, label: 'Pleasant: 6+' },
];

const distanceFromLocation = [
	{ value: '>250m', label: 'Less than 250 m (0.2 km) ' },
	{ value: '>500m', label: 'Less than 500 m (0.5 km)' },
	{ value: '>750m', label: 'Less than 750 m (0.75 km)' },
	{ value: '>1000m', label: 'Less than 1000 m (1 km)' },
];
// Helper function to calculate Haversine distance in km
const haversineDistance = (location1, location2) => {
	const toRadians = (degrees) => degrees * (Math.PI / 180);
	const R = 6371;
	const dLat = toRadians(location2.lat - location1.lat);
	const dLng = toRadians(location2.lng - location1.lng);
	const lat1 = toRadians(location1.lat);
	const lat2 = toRadians(location2.lat);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return Math.round((R * c + Number.EPSILON) * 100) / 100;
};

// Function to estimate travel time based on average speed (e.g., 40 km/h)
const estimateTravelTime = (distance, averageSpeed = 4) => {
	const timeInSeconds = (distance / averageSpeed) * 60 * 60; // time in seconds
	const minutes = Math.floor(timeInSeconds / 60);
	const seconds = Math.floor(timeInSeconds % 60);
	return { minutes, seconds };
};

export default function Listings() {
	const [listings, setListings] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [sortOrder, setSortOrder] = useState('asc');

	const increment = (value, setter) => setter(value + 1);
	const decrement = (value, setter) => setter(value > 0 ? value - 1 : 0);

	//Map and Location Filter
	const [deviceLocation, setDeviceLocation] = useContext(MapContext);
	const [position, setPosition] = useState({ lat: 16.42, lng: 120.599 });
	const [selectedLocation, setSelectedLocation] = useState(deviceLocation);
	const [radius, setRadius] = useState([250]);
	const [mapKey, setMapKey] = useState(0);

	//Filters
	const [householdAmenities, setHouseholdAmenities] = useState([]);
	const [selectedFilter, setSelectedFilter] = useState([]);
	const [selectedPrivacyType, setSelectedPrivacyType] = useState([]);
	const [selectedStructure, setSelectedStructure] = useState([]);
	const [minPrice, setMinPrice] = useState(0);
	const [maxPrice, setMaxPrice] = useState(30000);
	const [rooms, setRooms] = useState(1);
	const [beds, setBeds] = useState(1);
	const [isApplyFilter, setIsApplyFilter] = useState(false);

	const handleDeviceLocation = async () => {
		if (deviceLocation) {
			setSelectedLocation(deviceLocation);
			setPosition(deviceLocation);
			setMapKey((prevKey) => prevKey + 1);
		}
	};

	const fetchFilteredListings = async () => {
		try {
			const amenities = await getAllAmenities();
			setHouseholdAmenities(amenities);
			const fetchedListings = await get_allProperties(
				selectedLocation ?? {},
				selectedPrivacyType,
				selectedFilter,
				radius[0],
				minPrice,
				maxPrice,
				beds,
				rooms,
				selectedStructure
			);

			let updatedListings;
			if (selectedLocation) {
				updatedListings = fetchedListings.map((listing) => {
					const distance = haversineDistance(selectedLocation, {
						lat: listing.latitude,
						lng: listing.longitude,
					});
					const travelTime = estimateTravelTime(distance);
					return { ...listing, distance, travelTime };
				});
			} else {
				updatedListings = fetchedListings;
			}

			setListings(updatedListings);
			console.log(listings);
		} catch (err) {
			setError('Failed to fetch listings.');
		}
		setLoading(false);
		setIsApplyFilter(false);
	};

	useEffect(() => {
		handleDeviceLocation();
		fetchFilteredListings();
	}, [isApplyFilter, deviceLocation, selectedLocation]);

	const sortedListings = [...listings].sort((a, b) => {
		if (a.ispropertyboosted && !b.ispropertyboosted) return -1;
		if (!a.ispropertyboosted && b.ispropertyboosted) return 1;
		return sortOrder === 'asc'
			? a.minimum_price - b.minimum_price
			: b.minimum_price - a.minimum_price;
	});

	const toggleSortOrder = () => {
		setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
	};

	if (loading) return <LoadingPage />;

	if (error) return <div className='text-red-500'>{error}</div>;

	return (
		<div className='h-full relative'>
			<div className='grid grid-cols-1 gap-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1'>
				<div className=''>
					<Card className='w-full bg-white dark:bg-secondary drop-shadow-md border border-gray-400'>
						<CardHeader className='p-4 py-2'>
							<CardTitle className='text-md'>Filter by:</CardTitle>
						</CardHeader>

						<CardContent className='border-t border-gray-200 px-4'>
							<form className='mt-3'>
								<div className=''>
									<Label htmlFor='property_structure' className='font-semibold'>
										Property Structure
									</Label>

									<div className='space-y-2 mt-2'>
										{propertyStructureOptions.map((item) => (
											<div key={item.value} className='flex items-center'>
												<Checkbox
													id={item.value}
													className='dark:border-blue-300'
												/>
												<label
													htmlFor={item.value}
													className='text-sm dark:foreground font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2'
												>
													{item.label}
												</label>
											</div>
										))}
									</div>
								</div>

								<div className='mt-3'>
									<Label htmlFor='type_of_place' className='font-semibold'>
										Type of Place
									</Label>

									<div className='space-y-2 mt-2'>
										{householdPrivacyTypes.map((item) => (
											<div key={item.value} className='flex items-center'>
												<Checkbox
													id={item.value}
													className='dark:border-blue-300'
												/>
												<label
													htmlFor={item.value}
													className='text-sm dark:foreground font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2'
												>
													{item.label}
												</label>
											</div>
										))}
									</div>
								</div>

								{/* Price Range Filter Section */}
								<div className='mt-3'>
									<Label htmlFor='price_range' className='font-semibold'>
										Price Range
									</Label>

									<div className='space-y-2 mt-2'>
										<Slider
											step={100}
											minValue={0}
											maxValue={30000}
											value={[minPrice, maxPrice]}
											onChange={(value) => {
												setMinPrice(value[0]);
												setMaxPrice(value[1]);
											}}
											formatOptions={{ style: 'currency', currency: 'PHP' }}
											className='w-full'
										/>
										<div className='flex justify-between items-center w-full'>
											<div className='flex-1 text-center flex flex-col items-center'>
												<Label className='block text-xs'>Minimum</Label>
												<div className='relative flex items-center'>
													<span className='absolute left-3 top-1 text-sm text-gray-600  dark:text-gray-300'>
														₱
													</span>
													<Input
														type='number'
														className='w-[100px] border border-gray-300 p-1 h-7 pl-4 rounded-full justify-center text-center text-xs mb-2'
														value={minPrice}
														onChange={(e) =>
															setMinPrice(Number(e.target.value))
														}
													/>
												</div>
											</div>
											{/* Divider */}
											<span className='px-15'></span>

											<div className='flex-1 text-center flex flex-col items-center'>
												<Label className='block text-xs'>Maximum</Label>
												<div className='relative flex items-center'>
													<span className='absolute left-3 top-1 text-sm text-gray-600 dark:text-gray-300'>
														₱
													</span>
													<Input
														type='number'
														className='w-[100px] border border-gray-300 p-1 h-7 pl-4 rounded-full justify-center text-center text-xs mb-2'
														value={maxPrice}
														onChange={(e) =>
															setMaxPrice(Number(e.target.value))
														}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Rooms and Beds Filter Section */}
								<div className='mt-3'>
									<Label htmlFor='roomsAndBeds' className='font-semibold'>
										Rooms and Beds
									</Label>
									<div className='flex flex-col items-start space-y-2'>
										{/* Number of Rooms Filter Section */}
										<div className='flex items-center justify-between w-full'>
											<Label className='text-sm font-normal dark:foreground '>
												Bedrooms
											</Label>
											<div className='flex items-center space-x-4'>
												<div
													onClick={() => decrement(rooms, setRooms)}
													className='px-2 py-1 rounded-full  transition-all cursor-pointer'
												>
													<MinusCircle className='text-sm text-gray-700 dark:text-gray-300' />{' '}
												</div>

												<span className='text-sm font-normal flex items-center justify-center w-[40px]'>
													{rooms === 0 ? 'Any' : rooms}
												</span>

												<div
													onClick={() => increment(rooms, setRooms)}
													className='px-2 py-1 rounded-full transition-all cursor-pointer'
												>
													<PlusCircle className='text-sm text-gray-700 dark:text-gray-300' />{' '}
												</div>
											</div>
										</div>

										{/* Number of Beds Filter Section */}
										<div className='flex items-center justify-between w-full'>
											<Label className='text-sm font-normal dark:foreground'>
												Beds
											</Label>
											<div className='flex items-center space-x-4'>
												<div
													onClick={() => decrement(beds, setBeds)}
													className='px-2 py-1 rounded-full  transition-all cursor-pointer'
												>
													<MinusCircle className='text-sm text-gray-700 dark:text-gray-300' />{' '}
												</div>

												<span className='text-sm font-normal flex items-center justify-center w-[40px]'>
													{beds === 0 ? 'Any' : beds}
												</span>

												<div
													onClick={() => increment(beds, setBeds)}
													className='px-2 py-1 rounded-full transition-all cursor-pointer'
												>
													<PlusCircle className='text-sm text-gray-700 dark:text-gray-300' />{' '}
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Amenities Filter Section */}
								<div className='mt-3'>
									<Label htmlFor='amenities' className='font-semibold'>
										Amenities
									</Label>

									<div className='space-y-2 mt-2'>
										{householdAmenities.map((item) => (
											<div key={item.value} className='flex items-center'>
												<Checkbox
													id={item.value}
													className='dark:border-blue-300'
												/>
												<label
													htmlFor={item.value}
													className='text-sm dark:foreground font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2'
												>
													{item.label}
												</label>
											</div>
										))}
									</div>
								</div>

								{/* Distance Filter Section */}
								<div className='mt-3'>
									<Label htmlFor='review_score' className='font-semibold'>
										Distance from Location
									</Label>

									<div className='space-y-2 mt-2'>
										{distanceFromLocation.map((item) => (
											<div key={item.value} className='flex items-center'>
												<Checkbox
													id={item.label}
													className='dark:border-blue-300'
												/>
												<label
													htmlFor={item.label}
													className='text-sm dark:foreground font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2'
												>
													{item.label}
												</label>
											</div>
										))}
									</div>
								</div>

								{/* Property Rating Filter Section */}
								<div className='mt-3'>
									<Label htmlFor='property_rating' className='font-semibold'>
										Property Rating
									</Label>

									<div className='space-y-2 mt-2'>
										{propertyRating.map((item) => (
											<div key={item.value} className='flex items-center'>
												<Checkbox
													id={item.label}
													className='dark:border-blue-300'
												/>
												<label
													htmlFor={item.label}
													className='text-sm dark:foreground font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2'
												>
													{item.label}
												</label>
											</div>
										))}
									</div>
								</div>

								{/* Review Score Filter Section */}
								<div className='mt-3'>
									<Label htmlFor='review_score' className='font-semibold'>
										Review Score
									</Label>

									<div className='space-y-2 mt-2'>
										{reviewScore.map((item) => (
											<div key={item.value} className='flex items-center'>
												<Checkbox
													id={item.label}
													className='dark:border-blue-300'
												/>
												<label
													htmlFor={item.label}
													className='text-sm dark:foreground font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2'
												>
													{item.label}
												</label>
											</div>
										))}
									</div>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>

				<div className='col-span-1 lg:col-span-3 md:col-span-2 gap-4'>
					{/* Upper Row: Buttons */}
					<div className='row-span-1'>
						<div className='flex justify-between items-center mb-4 flex-wrap gap-4'>
							<p className='font-bold pl-2 text-xl'>
								{sortedListings.length} Properties found
							</p>
							<div className='flex items-center space-x-2'>
								<Button
									variant={'outline'}
									className='mb-2'
									onClick={toggleSortOrder}
								>
									<div className='flex items-center space-x-2'>
										<ArrowDownUp className='w-4 h-auto' />
										<span>
											Sort by price:{' '}
											{sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
										</span>
									</div>
								</Button>
								<FilterModal
									householdAmenities={householdAmenities}
									selectedFilter={selectedFilter}
									setSelectedFilter={setSelectedFilter}
									selectedPrivacyType={selectedPrivacyType}
									setSelectedPrivacyType={setSelectedPrivacyType}
									selectedStructure={selectedStructure}
									setSelectedStructure={setSelectedStructure}
									minPrice={minPrice}
									setMinPrice={setMinPrice}
									maxPrice={maxPrice}
									setMaxPrice={setMaxPrice}
									rooms={rooms}
									setRooms={setRooms}
									beds={beds}
									setBeds={setBeds}
									setIsApplyFilter={setIsApplyFilter}
								/>
							</div>
						</div>
					</div>

					{/* Lower Row: Listings */}
					<div className='row-span-1 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4'>
						{sortedListings.map((item) => (
							<BranchListings key={item.id} {...item} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
