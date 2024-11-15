'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Map, MinusCircle, PlusCircle, Search, SearchIcon } from 'lucide-react';
import { useState, useContext } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Circle,
	GoogleMap,
	Marker,
	MarkerClusterer,
} from '@react-google-maps/api';
import { MapContext } from './ListingsPage';
import { get_allProperties } from '@/actions/listings/filtering-complete';
import { Slider as RadiusSlider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Slider as PriceSlider } from '@nextui-org/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { MdOutlineMyLocation } from 'react-icons/md';

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

// Function to estimate travel time in minutes based on average speed (e.g., 4 km/h)
const estimateTravelTime = (distance, averageSpeed = 4) => {
	const timeInSeconds = (distance / averageSpeed) * 60 * 60; // time in seconds
	const minutes = Math.floor(timeInSeconds / 60);
	const seconds = Math.floor(timeInSeconds % 60);
	return { minutes, seconds };
};

export default function FilterModal({
	householdAmenities = [],
	selectedFilter,
	setSelectedFilter,
	selectedPrivacyType,
	setSelectedPrivacyType,
	selectedStructure,
	setSelectedStructure,
	minPrice,
	setMinPrice,
	maxPrice,
	setMaxPrice,
	rooms,
	setRooms,
	beds,
	setBeds,
	setIsApplyFilter,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	const increment = (value, setter) => setter(value + 1);
	const decrement = (value, setter) => setter(value > 0 ? value - 1 : 0);

	const clearFilters = () => {
		setSelectedFilter([]);
		setSelectedPrivacyType([]);
		setSelectedStructure([]);
		setMinPrice(0);
		setMaxPrice(30000);
		setRooms(1);
		setBeds(1);
	};

	const [listings, setListings] = useState([]);
	const [sortOrder, setSortOrder] = useState('asc');

	// Map and Location Filter
	const [mapKey, setMapKey] = useState(0);
	const [deviceLocation, setDeviceLocation] = useContext(MapContext);
	const [position, setPosition] = useState({ lat: 16.42, lng: 120.599 });
	const [selectedLocation, setSelectedLocation] = useState(deviceLocation);
	const [selectedListing, setSelectedListing] = useState(null);
	const [radius, setRadius] = useState([250]);

	const defaultOptions = {
		strokeOpacity: 0.5,
		strokeWeight: 1,
		clickable: false,
		draggable: false,
		editable: false,
		visible: true,
	};

	const closeOptions = {
		...defaultOptions,
		zIndex: 3,
		fillOpacity: 0.05,
		strokeColor: '#4567b7',
		fillColor: '#4567b7',
	};

	const handleMapClick = async (event) => {
		if (event.latLng) {
			const { lat, lng } = event.latLng.toJSON();
			setPosition({ lat, lng });
			setSelectedLocation({ lat, lng });
			setMapKey((prevKey) => prevKey + 1);
		}
	};

	const fetchFilteredListings = async () => {
		try {
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

	const handleMarkerClick = (listing) => {
		setSelectedListing(listing);
	};

	const handleRadiusCommit = (value) => {
		setRadius(value);
		fetchFilteredListings();
		setMapKey((prevKey) => prevKey + 1);
	};

	const sortedListings = [...listings].sort((a, b) => {
		if (a.ispropertyboosted && !b.ispropertyboosted) return -1;
		if (!a.ispropertyboosted && b.ispropertyboosted) return 1;
		return sortOrder === 'asc'
			? a.minimum_price - b.minimum_price
			: b.minimum_price - a.minimum_price;
	});

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant='outline'
					className='mb-2 px-4 py-2 rounded-lg transition-all'
					onClick={() => setIsOpen(true)}
				>
					<div className='flex items-center space-x-2'>
						<Map className='w-4 h-auto ' />
						<span className='font-semibold'>Check Map</span>
					</div>
				</Button>
			</DialogTrigger>

			<DialogContent className='max-w-[90%] xs:h-[450px] md:h-[500px] lg:h-[710px] bg-white dark:bg-secondary rounded-lg shadow-lg'>
				<DialogHeader className=''>
					<DialogTitle>Filter</DialogTitle>
					<DialogDescription className='border-b border-gray-300 dark:text-gray-200 pb-2'>
						Adjust filters below
					</DialogDescription>
				</DialogHeader>

				{/* BODY */}
				<ScrollArea className='h-full overflow-y-auto overflow-hidden pr-4'>
					<div className='grid grid-cols-2 lg:grid-cols-5 lg:gap-4 md:gap-0'>
						<div className='col-span-3 relative'>
							<div className='absolute top-4 left-1/2 transform -translate-x-1/2 w-11/12 z-10'>
								<div className='relative flex lg:w-full shadow-lg'>
									<SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black dark:text-foreground' />
									<input
										// ref={inputRef}
										type='search'
										name='search'
										id='search'
										className='block w-full rounded-lg border-1 bg-white dark:bg-secondary px-10 py-2 text-black dark:text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent'
										placeholder='Search'
										// value={searchTerm}
										// onChange={(e) => setSearchTerm(e.target.value)}
										// onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
									/>
									<button
										type='button'
										className='absolute inset-y-0 right-0 pr-3 flex items-center p-1 bg-transparent border-0 focus:outline-none'
										aria-label='Use my location'
										// onClick={handleCurrentLocationClick}
									>
										<MdOutlineMyLocation className='h-5 w-5 text-black dark:text-foreground' />
									</button>
								</div>
							</div>
							<GoogleMap
								key={mapKey}
								onClick={handleMapClick}
								center={position}
								zoom={15}
								mapContainerClassName='w-full h-[300px] lg:h-full min-h-[340px]'
								options={{ disableDefaultUI: true }}
							>
								{selectedLocation && (
									<>
										<Marker position={selectedLocation} />
										<Circle
											center={selectedLocation}
											radius={radius[0]}
											options={closeOptions}
										/>
									</>
								)}
								<MarkerClusterer>
									{(clusterer) => (
										<>
											{sortedListings.map((listing) => (
												<Marker
													key={listing.id}
													position={{
														lat: listing.latitude,
														lng: listing.longitude,
													}}
													clusterer={clusterer}
													onClick={() => handleMarkerClick(listing)}
												/>
											))}
										</>
									)}
								</MarkerClusterer>
							</GoogleMap>

							<div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 w-11/12'>
								<Card className='rounded-lg justify-center items-center bg-white dark:bg-secondary shadow-xl border border-gray-400'>
									<CardContent className='p-4 py-2'>
										<form>
											<div className='flex items-center'>
												<Label
													htmlFor='radius'
													className='font-semibold dark:text-foreground'
												>
													Search Radius
												</Label>
												<span className='ml-2 text-xs'>{radius[0]}m</span>
											</div>
											<RadiusSlider
												className='my-2'
												defaultValue={radius}
												max={1000}
												step={1}
												onValueChange={setRadius}
												onValueCommit={handleRadiusCommit}
											/>
										</form>
									</CardContent>
								</Card>
							</div>
						</div>

						<div className='col-span-2'>
							{/* Structure Filter Section */}
							<div className='flex flex-col space-y-1.5 mt-0 md:mt-3'>
								<Label htmlFor='typeOfPlace' className='font-semibold'>
									Property Structure
								</Label>
								<ToggleGroup
									type='multiple'
									value={selectedStructure}
									className='flex gap-2 w-full text-xs'
								>
									{propertyStructureOptions.map((type) => (
										<ToggleGroupItem
											key={type.value}
											value={type.value}
											onClick={() => {
												if (selectedStructure.includes(type.value)) {
													setSelectedStructure(
														selectedStructure.filter(
															(item) => item !== type.value
														)
													);
												} else {
													setSelectedStructure([
														...selectedStructure,
														type.value,
													]);
												}
											}}
											style={{
												backgroundColor: selectedStructure.includes(type.value)
													? 'rgb(15, 72, 159)'
													: 'white',
												color: selectedStructure.includes(type.value)
													? 'white'
													: 'rgb(55, 48, 63)',
												transition: 'all 0.2s ease',
												fontWeight: selectedStructure.includes(type.value)
													? '600'
													: 'normal',
											}}
											className='flex-1 px-4 py-2 rounded-lg hover:bg-gray-200  border border-gray-300 transition-all text-xs'
										>
											{type.label}
										</ToggleGroupItem>
									))}
								</ToggleGroup>
							</div>

							<hr className='my-2 border-none' />

							{/* Privacy Filter Section */}
							<div className='flex flex-col space-y-1.5'>
								<Label htmlFor='typeOfPlace' className='font-semibold'>
									Type of Place
								</Label>
								<ToggleGroup
									type='multiple'
									value={selectedPrivacyType}
									className='flex gap-2 w-full rounded-lg text-xs'
								>
									{householdPrivacyTypes.map((type) => (
										<ToggleGroupItem
											key={type.value}
											value={type.value}
											onClick={() => {
												if (selectedPrivacyType.includes(type.value)) {
													setSelectedPrivacyType(
														selectedPrivacyType.filter(
															(item) => item !== type.value
														)
													);
												} else {
													setSelectedPrivacyType([
														...selectedPrivacyType,
														type.value,
													]);
												}
											}}
											style={{
												backgroundColor: selectedPrivacyType.includes(
													type.value
												)
													? 'rgb(15, 72, 159)'
													: 'white',
												color: selectedPrivacyType.includes(type.value)
													? 'white'
													: 'rgb(55, 48, 63)',
												transition: 'all 0.2s ease',
											}}
											className='flex-1 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all text-xs border border-gray-300'
										>
											{type.label}
										</ToggleGroupItem>
									))}
								</ToggleGroup>
							</div>

							<hr className='my-2 border-none' />

							{/* Price Range Filter Section */}
							<div className='flex flex-col space-y-1.5'>
								<Label htmlFor='priceRange' className='font-semibold'>
									Price Range
								</Label>
								<PriceSlider
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
												onChange={(e) => setMinPrice(Number(e.target.value))}
											/>
										</div>
									</div>

									{/* Divider */}
									<span className='px-20'></span>

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
												onChange={(e) => setMaxPrice(Number(e.target.value))}
											/>
										</div>
									</div>
								</div>
							</div>

							<hr className='my-2 border-none' />

							{/* Rooms and Beds Filter Section */}
							<div className='flex flex-col space-y-1.5'>
								<Label htmlFor='roomsAndBeds' className='font-semibold'>
									Rooms and Beds
								</Label>
								<div className='flex flex-col items-start space-y-2'>
									{/* Number of Rooms Filter Section */}
									<div className='flex items-center justify-between w-full'>
										<Label className='text-sm font-normal dark:foreground'>
											Bedrooms
										</Label>
										<div className='flex items-center space-x-4'>
											<div
												onClick={() => decrement(rooms, setRooms)}
												className='px-2 py-1 rounded-full  transition-all cursor-pointer'
											>
												<MinusCircle className='text-sm' />{' '}
											</div>

											<span className='text-sm font-medium flex items-center justify-center w-[40px]'>
												{rooms === 0 ? 'Any' : rooms}
											</span>

											<div
												onClick={() => increment(rooms, setRooms)}
												className='px-2 py-1 rounded-full transition-all cursor-pointer'
											>
												<PlusCircle className='text-sm' />{' '}
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
												<MinusCircle className='text-sm' />{' '}
											</div>

											<span className='text-sm font-medium flex items-center justify-center w-[40px]'>
												{beds === 0 ? 'Any' : beds}
											</span>

											<div
												onClick={() => increment(beds, setBeds)}
												className='px-2 py-1 rounded-full transition-all cursor-pointer'
											>
												<PlusCircle className='text-sm' />{' '}
											</div>
										</div>
									</div>
								</div>
							</div>

							<hr className='my-2 border-none' />

							{/* Amenities Filter Section */}
							<div className='flex flex-col space-y-1.5'>
								<Label htmlFor='amenities' className='font-semibold'>
									Amenities
								</Label>
								<ToggleGroup
									type='multiple'
									value={selectedFilter}
									className='grid gap-2 grid-cols-3 md:grid-cols-3 text-xs'
								>
									{householdAmenities.map((type) => (
										<ToggleGroupItem
											key={type.id}
											value={type.value}
											onClick={() => {
												if (selectedFilter.includes(type.value)) {
													setSelectedFilter(
														selectedFilter.filter((item) => item !== type.value)
													);
												} else {
													setSelectedFilter([...selectedFilter, type.value]);
												}
											}}
											style={{
												backgroundColor: selectedFilter.includes(type.value)
													? 'rgb(15, 72, 159)'
													: 'white',
												color: selectedFilter.includes(type.value)
													? 'white'
													: 'rgb(55, 48, 63)',
												transition: 'all 0.2s ease',
											}}
											className='px-6 py-2 hover:border-gray-500 rounded-lg border border-gray-300 transition-all text-xs'
										>
											{type.label}
										</ToggleGroupItem>
									))}
								</ToggleGroup>
							</div>

							<hr className='my-2 border-none' />

							<div className='grid grid-cols-2'>
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
							</div>

							{/* Clear Filter Button */}
							<div className='flex justify-end gap-4 mt-auto lg:mt-14'>
								<Button
									variant='outline'
									className='py-2 rounded-lg border-gray-300 hover:bg-gray-100 transition-all'
									onClick={clearFilters}
								>
									Clear Filters
								</Button>
								<Button
									variant='default'
									className='py-2 rounded-lg bg-primary text-white transition-all'
									onClick={() => {
										setIsApplyFilter(true);
										setIsOpen(false);
									}}
								>
									Apply Filters
								</Button>
							</div>
						</div>
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
