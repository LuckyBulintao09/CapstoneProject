import React, { useContext, useEffect, useState, useRef } from 'react';
import BranchListings from '@/components/cardListings/BranchListings';
import { Button } from '@/components/ui/button';
import { ArrowDownUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/multi-select';
import { 
    Marker,
    Circle,
    GoogleMap,
	InfoWindow,
} from '@react-google-maps/api';
import {
    get_allListings,
    get_nearbyInfo,
    get_nearbyListings,
    getFilteredListings,
} from '@/actions/listings/listing-filter';
import { MapContext } from './ListingsPage';
import { getAllAmenities } from '@/actions/listings/amenities';
import LoadingPage from '@/components/LoadingPage';
import { get_allUnits } from '@/actions/listings/filtering-complete';
import { Slider } from "@/components/ui/slider";

const householdPrivacyTypes = [
    { value: 'Shared Room', label: 'Shared Room' },
    { value: 'Whole Place', label: 'Whole Place' },
    { value: 'Private Room', label: 'Private Room' },
];

export default function Listings() {
    const mapRef = useRef(null);

    const [householdAmenities, setHouseholdAmenities] = useState([]);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [deviceLocation, setDeviceLocation] = useContext(MapContext);
    const [position, setPosition] = useState({ lat: 16.4200, lng: 120.5990 });
    const [selectedLocation, setSelectedLocation] = useState(deviceLocation);
    const [selectedFilter, setSelectedFilter] = useState([]);
    const [selectedPrivacyType, setSelectedPrivacyType] = useState([]);
    const [radius, setRadius] = useState([250]);
	const [selectedListing, setSelectedListing] = useState(null);
    const [mapKey, setMapKey] = useState(0);

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
        strokeColor: "#4567b7",
        fillColor: "#4567b7",
    };

    const handleMapClick = async (event) => {
        if (event.latLng) {
            const { lat, lng } = event.latLng.toJSON();
            setPosition({ lat, lng });
            setSelectedLocation({ lat, lng });
            setMapKey(prevKey => prevKey + 1);
        }
    };

    const handleDeviceLocation = async () => {
        if (deviceLocation) {
            setSelectedLocation(deviceLocation);
            setPosition(deviceLocation);
            setMapKey(prevKey => prevKey + 1);
        }
    };

    const fetchFilteredListings = async () => {
        try {
            const amenities = await getAllAmenities();
            setHouseholdAmenities(amenities);
            const fetchedListings = await get_allUnits(selectedLocation ?? {}, selectedPrivacyType, selectedFilter, radius[0]);
            setListings(fetchedListings);
        } catch (err) {
            setError('Failed to fetch listings.');
        }
        setLoading(false);
    };

    useEffect(() => {
        handleDeviceLocation();
        fetchFilteredListings();
		console.log(listings)
    }, [selectedLocation, deviceLocation, selectedFilter, selectedPrivacyType]);

    const handleRadiusCommit = (value) => {
        setRadius(value);
        fetchFilteredListings();
		setMapKey(prevKey => prevKey + 1);
    };

	const handleMarkerClick = (listing) => {
        setSelectedListing(listing);
    };

    const sortedListings = [...listings].sort((a, b) => {
        if (a.ispropertyboosted && !b.ispropertyboosted) return -1;
        if (!a.ispropertyboosted && b.ispropertyboosted) return 1;
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    });

    const toggleSortOrder = () => {
        setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
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
									<GoogleMap
                                            key={mapKey}
                                            onClick={handleMapClick}
                                            center={position}
                                            zoom={15}
                                            mapContainerClassName='w-full h-full'
                                            options={{
                                                disableDefaultUI: true,
                                            }}
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
                                            {sortedListings.map((listing) => (
                                                <Marker
                                                    key={listing.id}
                                                    position={{
                                                        lat: listing.latitude,
                                                        lng: listing.longitude,
                                                    }}
                                                    onClick={() => handleMarkerClick(listing)}
                                                />
                                            ))}
                                            {selectedListing && (
                                                <InfoWindow
                                                    position={{
                                                        lat: selectedListing.latitude,
                                                        lng: selectedListing.longitude,
                                                    }}
                                                    onCloseClick={() => setSelectedListing(null)}
                                                >
                                                    <div>
                                                        <img className="w-full h-auto object-cover pb-4" src={selectedListing.thumbnail_url} alt={selectedListing.name} />
                                                        <h3 className="font-semibold pb-4">{selectedListing.title}</h3>
														<p><b>Price: ${selectedListing.price}</b></p>
                                                        <p>{selectedListing.description}</p>
                                                    </div>
                                                </InfoWindow>
                                            )}
                                        </GoogleMap>
                                    </div>
                                </Card>
                            </CardHeader>
                            <CardContent>
                                <form>
                                    <div>
                                        <Label htmlFor='radius' className='font-semibold'>Radius</Label>
                                        <Slider
                                            className='my-2'
                                            defaultValue={radius}
                                            max={750}
                                            step={1}
                                            onValueChange={setRadius}
                                            onValueCommit={handleRadiusCommit} // Trigger fetch on slider commit
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor='amenities' className='font-semibold'>Filter Amenities</Label>
                                        <MultiSelect
                                            options={householdAmenities}
                                            onValueChange={setSelectedFilter}
                                            defaultValue={selectedFilter}
                                            placeholder='Select amenities'
                                            variant='inverted'
                                            maxCount={2}
                                        />
                                    </div>
                                    <div className='pt-2'>
                                        <Label htmlFor='privacy' className='font-semibold'>Privacy Type</Label>
                                        <MultiSelect
                                            options={householdPrivacyTypes}
                                            onValueChange={setSelectedPrivacyType}
                                            defaultValue={selectedPrivacyType}
                                            placeholder='Select privacy type'
                                            variant='inverted'
                                            maxCount={2}
                                        />
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
