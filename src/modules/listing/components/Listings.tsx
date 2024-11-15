import React, { useContext, useEffect, useState } from 'react';
import BranchListings from '@/components/cardListings/BranchListings';
import { Button } from '@/components/ui/button';
import { ArrowDownUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Marker, Circle, GoogleMap, MarkerClusterer } from '@react-google-maps/api';
import { MapContext } from './ListingsPage';
import { getAllAmenities } from '@/actions/listings/amenities';
import LoadingPage from '@/components/LoadingPage';
import { get_allProperties } from '@/actions/listings/filtering-complete';
import { Slider } from '@/components/ui/slider';
import FilterModal from './FilterModal';

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
// Function to estimate travel time in minutes based on average speed (e.g., 4 km/h)
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

    //Map and Location Filter
    const [deviceLocation, setDeviceLocation] = useContext(MapContext);
    const [position, setPosition] = useState({ lat: 16.42, lng: 120.599 });
    const [selectedLocation, setSelectedLocation] = useState(deviceLocation);
    const [selectedListing, setSelectedListing] = useState(null);
    const [radius, setRadius] = useState([250]);
    const [mapKey, setMapKey] = useState(0);
    const [isMapOpen, setIsMapOpen] = useState(false);

    //Filters
    const [householdAmenities, setHouseholdAmenities] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState([]);
    const [selectedPrivacyType, setSelectedPrivacyType] = useState([]);
    const [selectedStructure, setSelectedStructure] = useState([]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(30000);
    const [rooms, setRooms] = useState(1)
    const [beds, setBeds] = useState(1)
    const [isApplyFilter, setIsApplyFilter] = useState(false);

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
        setDeviceLocation(null);
        if (event.latLng) {
            const { lat, lng } = event.latLng.toJSON();
            setPosition({ lat, lng });
            setSelectedLocation({ lat, lng });
            setMapKey((prevKey) => prevKey + 1);
        }
    };

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

    const handleRadiusCommit = (value) => {
        setRadius(value);
        fetchFilteredListings();
        setMapKey((prevKey) => prevKey + 1);
    };

    const handleMarkerClick = (listing) => {
        setSelectedListing(listing);
    };

    const sortedListings = [...listings].sort((a, b) => {
        if (a.ispropertyboosted && !b.ispropertyboosted) return -1;
        if (!a.ispropertyboosted && b.ispropertyboosted) return 1;
        return sortOrder === 'asc' ? a.minimum_price - b.minimum_price : b.minimum_price - a.minimum_price;
    });

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    if (loading) return <LoadingPage />;

    if (error) return <div className='text-red-500'>{error}</div>;

    return (
        <div className='h-full relative'>
            <div className='flex justify-between items-center mb-4 flex-wrap gap-4'>
                    {/* <Button
                        variant={'outline'}
                        className='mb-2'
                        onClick={() => setIsFilterModalOpen((prev) => !prev)}
                    >
                        <div className='flex items-center'>
                            <span>Filter</span>
                            <Filter className='w-4 h-auto ml-1' />
                        </div>
                    </Button> */}
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
				<div className='flex items-center space-x-4'>
					<Button variant={'outline'} className='mb-2' onClick={toggleSortOrder}>
					<div className='flex items-center'>
						<span>
						Sort by price: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
						</span>
						<ArrowDownUp className='w-4 h-auto ml-1' />
					</div>
					</Button>
					<Button variant={'outline'} className='mb-2' onClick={() => setIsMapOpen(!isMapOpen)}>
					{isMapOpen ? 'Hide Map' : 'Show Map'}
					</Button>
				</div>
			</div>

            <div className={`grid grid-cols-1 gap-4 transition-all duration-300 ${isMapOpen ? 'lg:grid-cols-3' : 'lg:grid-cols-5'}`}>
            {isMapOpen && (
                    <div
                        className={`lg:relative transform transition-transform duration-300 lg:top-0 top-16 left-0 lg:translate-x-0 ${isMapOpen ? 'translate-x-0' : '-translate-x-full'} w-auto h-auto`}
                    >
                        <Card className='w-full bg-white dark:bg-secondary shadow-md'>
                            <CardHeader>
                                <Card className='h-[370px] border-none'>
                                    <div className='rounded-md w-full h-full border-none'>
                                        <GoogleMap
                                            key={mapKey}
                                            onClick={handleMapClick}
                                            center={position}
                                            zoom={15}
                                            mapContainerClassName='w-full h-full'
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
                                                {(clusterer) =>
                                                    sortedListings.map((listing) => (
                                                        <Marker
                                                            key={listing.id}
                                                            position={{
                                                                lat: listing.latitude,
                                                                lng: listing.longitude,
                                                            }}
                                                            clusterer={clusterer}
                                                            onClick={() => handleMarkerClick(listing)}
                                                        />
                                                    ))
                                                }
                                            </MarkerClusterer>
                                        </GoogleMap>
                                    </div>
                                </Card>
                            </CardHeader>
                            <CardContent>
                                <form>
                                    <div className='flex items-center'>
                                        <Label htmlFor='radius' className='font-semibold'>Search Radius</Label>
                                        <span className='ml-2'>{radius[0]}m</span>
                                    </div>
                                    <Slider
                                        className='my-2'
                                        defaultValue={radius}
                                        max={750}
                                        step={1}
                                        onValueChange={setRadius}
                                        onValueCommit={handleRadiusCommit}
                                    />
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
                
                <div className={`grid grid-cols-1 ${isMapOpen ? 'col-span-2  md:grid-cols-2 lg:grid-cols-3 gap-4' : 'col-span-5  md:grid-cols-3 lg:grid-cols-4 gap-4'}`}>
                    {sortedListings.map((item) => (
                        <BranchListings key={item.id} {...item} />
                    ))}
                </div>

                
            </div>
        </div>
    );
}
