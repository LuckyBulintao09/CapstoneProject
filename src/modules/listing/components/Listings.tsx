import React, { useContext, useEffect, useState } from 'react';
import BranchListings from '@/components/cardListings/BranchListings';
import { Button } from '@/components/ui/button';
import { ArrowDownUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/multi-select';
import {
	APIProvider,
	Map,
	AdvancedMarker,
} from '@vis.gl/react-google-maps';
import {
	get_nearbyInfo,
	get_nearbyListings,
	getFilteredListings,
} from '@/actions/listings/listing-filter';
import { MapContext } from './ListingsPage';
import { getAllAmenities } from '@/actions/listings/amenities';
import LoadingPage from '@/components/LoadingPage';

const householdPrivacyTypes = [
	{ value: 'Shared Room', label: 'Shared Room' },
	{ value: 'Whole Place', label: 'Whole Place' },
	{ value: 'Private Room', label: 'Private Room' },
];

export default function Listings() {
	const [householdAmenities, setHouseholdAmenities] = useState([]);
	const [listings, setListings] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>(null);
	const [sortOrder, setSortOrder] = useState('asc');
	const [deviceLocation, setDeviceLocation] = useContext(MapContext);
	const [propertyLocation, setPropertyLocation] = useState([]);
	const [position, setPosition] = useState({ lat: 16.4200, lng: 120.5990 });
	const [selectedLocation, setSelectedLocation] = useState(deviceLocation);
	const [currentID, setCurrentID] = useState(null);
	const [selectedFilter, setSelectedFilter] = useState([]);
	const [selectedPrivacyType, setSelectedPrivacyType] = useState([]);

	const handleMapClick = async (event) => {
		try {
			if (event.detail.latLng) {
				setSelectedLocation(event.detail.latLng);
				const nearbyID = await get_nearbyListings(event.detail.latLng.lat, event.detail.latLng.lng);
				setCurrentID(nearbyID);
				setPosition(event.detail.latLng);
			}
		} catch (err) {
			setError('Failed to fetch nearby listings.');
		}
		
		setPosition(deviceLocation);
	};

	const handleDeviceLocation = async () => {
		if (deviceLocation) {
			setSelectedLocation(deviceLocation);
			try {
				const nearbyID = await get_nearbyListings(deviceLocation.lat, deviceLocation.lng);
				setCurrentID(nearbyID);
				setPosition(deviceLocation);
			} catch (err) {
				setError('Failed to fetch device location listings.');
			} finally {
				setDeviceLocation(null);
			}
		}
	};

	const fetchFilteredListings = async () => {
		try {
			const amenities = await getAllAmenities();
			setHouseholdAmenities(amenities);
			const filteredListings = await getFilteredListings(currentID, selectedFilter, selectedPrivacyType);
			setListings(filteredListings || []);
			const locationData = await get_nearbyInfo(filteredListings?.map((listing) => listing.property_id));
			setPropertyLocation(locationData);
		} catch (err) {
			setError('Failed to fetch listings.');
		}
		setLoading(false);
	};

	useEffect(() => {
		handleDeviceLocation();
		fetchFilteredListings();
	}, [currentID, selectedFilter, selectedPrivacyType]);

	const sortedListings = [...listings].sort((a, b) => {
		return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
	});

	const toggleSortOrder = () => {
		setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
	};

	if (loading) return <LoadingPage />;

	if (error) return <div className='text-red-500'>{error}</div>;

	return (
		<div className='h-full'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='font-bold text-xl'>
					{listings.length} properties found
				</h1>
				<Button variant={'outline'} className='mb-2' onClick={toggleSortOrder}>
					<div className='flex items-center'>
						<span>Sort by price: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}</span>
						<ArrowDownUp className='w-4 h-auto ml-1' />
					</div>
				</Button>
			</div>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5 sm:grid-cols-3 xs:grid-cols-2'>
				<div className='col-span-3 grid grid-cols-2 lg:grid-cols-3 md:grid-cols-3 gap-4'>
					{sortedListings.map((item) => (
						<BranchListings key={item.id} {...item} />
					))}
				</div>
				<div className='flex lg:justify-end lg:items-start lg:col-span-2 col-span-3'>
					<div className='sticky top-20 w-full'>
						<Card className='w-full bg-white dark:bg-secondary shadow-md lg:mt-0 md:mt-4 sm:mt-4 xs:mt-4'>
							<CardHeader>
								<Card className='h-[370px] border-none'>
									<div className='rounded-md w-full h-full border-none'>
										<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
											<Map defaultZoom={15} defaultCenter={position} mapId={process.env.NEXT_PUBLIC_MAP_ID} onClick={handleMapClick}>
												{selectedLocation && <AdvancedMarker position={selectedLocation} />}
												{propertyLocation?.map((location, index) => (
												<AdvancedMarker
													key={index}
													position={{ lat: location.latitude, lng: location.longitude }}
												>
													<span style={{ fontSize: '.75rem' }}>🔵</span>
												</AdvancedMarker>
											))}
											</Map>
										</APIProvider>
									</div>
								</Card>
							</CardHeader>
							<CardContent>
								<form>
									<div>
										<Label htmlFor='amenities' className='font-semibold'>Filter Amenities</Label>
										<MultiSelect options={householdAmenities} onValueChange={setSelectedFilter} defaultValue={selectedFilter} placeholder='Select amenities' variant='inverted' maxCount={2} />
									</div>
									<div className='pt-2'>
										<Label htmlFor='privacy' className='font-semibold'>Privacy Type</Label>
										<MultiSelect options={householdPrivacyTypes} onValueChange={setSelectedPrivacyType} defaultValue={selectedPrivacyType} placeholder='Select privacy type' variant='inverted' maxCount={2} />
									</div>
								</form>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
