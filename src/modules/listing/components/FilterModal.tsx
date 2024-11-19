'use client';
import { useEffect, useRef } from 'react';
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
	StandaloneSearchBox
} from '@react-google-maps/api';
import { Slider as RadiusSlider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Slider as PriceSlider } from '@nextui-org/slider';
import { MdOutlineMyLocation } from 'react-icons/md';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';
import { set } from 'date-fns';

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
	{ value: 1, label: '1+ star' },
	{ value: 2, label: '2+ stars' },
	{ value: 3, label: '3+ stars' },
	{ value: 4, label: '4+ stars' },
	{ value: 5, label: '5+ stars' },
];

const reviewScore = [
	{ value: 9, label: 'Wonderful: 9+' },
	{ value: 8, label: 'Very Good: 8+' },
	{ value: 7, label: 'Good: 7+' },
	{ value: 6, label: 'Pleasant: 6+' },
];


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
	starFilter,
	setStarFilter,
	scoreFilter,
	setScoreFilter,
	setDistanceFilter,
	listings,
	selectedLocation,
	setSelectedLocation,
	position,
	setPosition,
	deviceLocation,
	setDeviceLocation,
	radius,
	setRadius,
}) {
	const [isOpen, setIsOpen] = useState(false);

	const increment = (value, setter) => setter(value + 1);
	const decrement = (value, setter) => setter(value > 0 ? value - 1 : 0);


	// Map and Location Filter
	const [mapKey, setMapKey] = useState(0);
	const [selectedListing, setSelectedListing] = useState(null);
	const [searchTerm, setSearchTerm] = useState<any>(null);
	const [mapRadius, setMapRadius] = useState([250]);
	const mapRef = useRef(null); 
	const [circleLoc, setCircleLoc] = useState({
		lat: 0.2342,
		lng: 0.2342
	}); 

	//Filters
	const [popUpAmenities, setPopUpAmenities] = useState(JSON.parse(JSON.stringify(selectedFilter)));
	const [popUpPrivacyType, setPopUpPrivacyType] = useState(JSON.parse(JSON.stringify(selectedPrivacyType)));
	const [popUpStructure, setPopUpStructure] = useState(JSON.parse(JSON.stringify(selectedStructure)));
	const [popUpMinPrice, setPopUpMinPrice] = useState(minPrice);
	const [popUpMaxPrice, setPopUpMaxPrice] = useState(maxPrice);
	const [popUpRooms, setPopUpRooms] = useState(rooms);
	const [popUpBeds, setPopUpBeds] = useState(beds);
	const [popUpStarFilter, setPopUpStarFilter] = useState<any>(JSON.parse(JSON.stringify(starFilter)));
	const [popUpScoreFilter, setPopUpScoreFilter] = useState<any>(JSON.parse(JSON.stringify(scoreFilter)));
	

	const handleCurrentLocationClick = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				if (position.coords.accuracy > 100) {
					toast.error(
						'Location accuracy is too low. Manually search location or use a mobile device instead.'
					);
				} else {
					toast.success('Device Location Retrieved!');
					setDeviceLocation({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					});
					setSearchTerm('Current Location');
				}
			});
		}
	};


	useEffect(() => {
		setPopUpAmenities(JSON.parse(JSON.stringify(selectedFilter)));
		setPopUpPrivacyType(JSON.parse(JSON.stringify(selectedPrivacyType)));
		setPopUpStructure(JSON.parse(JSON.stringify(selectedStructure)));
		setPopUpMinPrice(minPrice);
		setPopUpMaxPrice(maxPrice);
		setPopUpRooms(rooms);
		setPopUpBeds(beds);
		setPopUpStarFilter(JSON.parse(JSON.stringify(starFilter)));
		setPopUpScoreFilter(JSON.parse(JSON.stringify(scoreFilter)));
	}, [isOpen]);

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
		fillOpacity: 0.2,
		strokeColor: '#4567b7',
		fillColor: '#4567b7',
	};

	const handleMapClick = async (event) => {
		if (event.latLng) {
		  const { lat, lng } = event.latLng.toJSON();
		  setSelectedLocation({ lat, lng });
		  setCircleLoc({ lat, lng });
	
		}
	  };


	const handleMarkerClick = (listing) => {
		setSelectedListing(listing);
	};

	//RADIUS BUG: NOT INSTANTLY UPDATING WHEN CHANGING VALUE
	const handleRadiusCommit = (value) => {
		setDistanceFilter(null)
		setRadius(value);
		setMapKey((prevKey) => prevKey + 1);
	};

	const handleApplyFilter = () => {
		setSelectedFilter(popUpAmenities);
		setSelectedPrivacyType(popUpPrivacyType);
		setSelectedStructure(popUpStructure);
		setMinPrice(popUpMinPrice);
		setMaxPrice(popUpMaxPrice);
		setRooms(popUpRooms);
		setBeds(popUpBeds);	
		setStarFilter(popUpStarFilter);
		setScoreFilter(popUpScoreFilter);

		setIsOpen(false);
	};

	const clearFilters = () => {
		setPopUpAmenities([]);
		setPopUpPrivacyType([]);
		setPopUpStructure([]);
		setPopUpMinPrice(0);
		setPopUpMaxPrice(30000);
		setPopUpRooms(0);
		setPopUpBeds(0);
		setPopUpStarFilter(null);
		setPopUpScoreFilter(null);
		setDistanceFilter(null);
	};

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
									<SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black dark:text-muted-foreground' />
									<input
										// ref={inputRef}
										type='search'
										name='search'
										id='search'
										className='block w-full rounded-lg border-0 bg-white px-10 py-2 text-black dark:text-muted-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent'
										placeholder='Search'
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
									/>
									<button
										type='button'
										className='absolute inset-y-0 right-0 pr-3 flex items-center p-1 bg-transparent border-0 focus:outline-none'
										aria-label='Use my location'
										onClick={handleCurrentLocationClick}
									>
										<MdOutlineMyLocation className='h-5 w-5 text-black dark:text-muted-foreground' />
									</button>
								</div>
							</div>
							<GoogleMap
								ref={mapRef}
								onClick={handleMapClick}
								center={position}
								zoom={15}
								mapContainerClassName="w-full h-[300px] lg:h-full min-h-[340px]"
								options={{ disableDefaultUI: true }}
								>
								{selectedLocation && (
									<>
									<Marker position={selectedLocation} />
									
									</>
								)}
								<Circle
										options={closeOptions}
										center={circleLoc}
										radius={mapRadius[0]}
								/>
								<MarkerClusterer>
									{(clusterer) => (
									<>
										{listings.map((listing) => (
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
												defaultValue={mapRadius}
												max={1000}
												step={1}
												onValueChange={setMapRadius}
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
									value={popUpStructure}
									className='flex gap-2 w-full text-xs'
								>
									{propertyStructureOptions.map((type) => (
										<ToggleGroupItem
											key={type.value}
											value={type.value}
											onClick={() => {
												if (popUpStructure.includes(type.value)) {
													setPopUpStructure(
														popUpStructure.filter(
															(item) => item !== type.value
														)
													);
												} else {
													setPopUpStructure([
														...popUpStructure,
														type.value,
													]);
												}
											}}
											style={{
												backgroundColor: popUpStructure.includes(type.value)
													? 'rgb(15, 72, 159)'
													: 'white',
												color: popUpStructure.includes(type.value)
													? 'white'
													: 'rgb(55, 48, 63)',
												transition: 'all 0.2s ease',
												fontWeight: popUpStructure.includes(type.value)
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
									value={popUpPrivacyType}
									className='flex gap-2 w-full rounded-lg text-xs'
								>
									{householdPrivacyTypes.map((type) => (
										<ToggleGroupItem
											key={type.value}
											value={type.value}
											onClick={() => {
												if (popUpPrivacyType.includes(type.value)) {
													setPopUpPrivacyType(
														popUpPrivacyType.filter(
															(item) => item !== type.value
														)
													);
												} else {
													setPopUpPrivacyType([
														...popUpPrivacyType,
														type.value,
													]);
												}
											}}
											style={{
												backgroundColor: popUpPrivacyType.includes(
													type.value
												)
													? 'rgb(15, 72, 159)'
													: 'white',
												color: popUpPrivacyType.includes(type.value)
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
									value={[popUpMinPrice, popUpMaxPrice]}
									onChange={(value) => {
										setPopUpMinPrice(value[0]);
										setPopUpMaxPrice(value[1]);
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
												value={popUpMinPrice}
												onChange={(e) => setPopUpMinPrice(Number(e.target.value))}
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
												value={popUpMaxPrice}
												onChange={(e) => setPopUpMaxPrice(Number(e.target.value))}
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
												onClick={() => decrement(popUpRooms, setPopUpRooms)}
												className='px-2 py-1 rounded-full  transition-all cursor-pointer'
											>
												<MinusCircle className='text-sm' />{' '}
											</div>

											<span className='text-sm font-medium flex items-center justify-center w-[40px]'>
												{popUpRooms === 0 ? 'Any' : popUpRooms}
											</span>

											<div
												onClick={() => increment(popUpRooms, setPopUpRooms)}
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
												onClick={() => decrement(popUpBeds, setPopUpBeds)}
												className='px-2 py-1 rounded-full  transition-all cursor-pointer'
											>
												<MinusCircle className='text-sm' />{' '}
											</div>

											<span className='text-sm font-medium flex items-center justify-center w-[40px]'>
												{popUpBeds === 0 ? 'Any' : popUpBeds}
											</span>

											<div
												onClick={() => increment(popUpBeds, setPopUpBeds)}
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
									value={popUpAmenities}
									className='grid gap-2 grid-cols-3 md:grid-cols-3 text-xs'
								>
									{householdAmenities.map((type) => (
										<ToggleGroupItem
											key={type.id}
											value={type.value}
											onClick={() => {
												if (popUpAmenities.includes(type.value)) {
													setPopUpAmenities(
														popUpAmenities.filter((item) => item !== type.value)
													);
												} else {
													setPopUpAmenities([...popUpAmenities, type.value]);
												}
											}}
											style={{
												backgroundColor: popUpAmenities.includes(type.value)
													? 'rgb(15, 72, 159)'
													: 'white',
												color: popUpAmenities.includes(type.value)
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
										<RadioGroup onValueChange={setPopUpStarFilter} value={popUpStarFilter}>
											{propertyRating.map((item) => (
												<div key={item.value} className="flex items-center space-x-2">
													<RadioGroupItem 
														value={item.value} 
														id={item.label} 
														checked={popUpStarFilter === item.value}
														/>
													<Label htmlFor={item.label} className="text-sm font-normal">
														{item.label}
													</Label>
												</div>
											))}
										</RadioGroup>
									</div>
								</div>
								{/* Review Score Filter Section */}
								<div className='mt-3'>
									<Label htmlFor='review_score' className='font-semibold'>
										Review Score
									</Label>

									<div className='space-y-2 mt-2'>
										<RadioGroup onValueChange={setPopUpScoreFilter} value={popUpScoreFilter}>
											{reviewScore.map((item) => (
												<div key={item.value} className="flex items-center space-x-2">
													<RadioGroupItem 
														value={item.value} 
														id={item.label}
														checked={popUpScoreFilter === item.value}
														/>
													<Label htmlFor={item.label} className="text-sm font-normal">
														{item.label}
													</Label>
												</div>
											))}
										</RadioGroup>
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
									onClick={handleApplyFilter}
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

