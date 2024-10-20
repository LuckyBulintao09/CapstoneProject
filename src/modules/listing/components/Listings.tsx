import React, { useContext, useEffect, useState } from 'react';
import BranchListings from '@/components/cardListings/BranchListings';
import { Button } from '@/components/ui/button';
import { ArrowDownUp } from 'lucide-react';
import { createClient } from '../../../../utils/supabase/client'; 
import { dataFocusVisibleClasses } from '@nextui-org/theme';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/multi-select";
import {
    APIProvider,
    Map,
    AdvancedMarker,
    AdvancedMarkerAnchorPoint,
    InfoWindow,
  } from "@vis.gl/react-google-maps";
  import { get_allListings, get_nearbyListings } from "@/actions/listings/listing-filter";
import { set } from 'date-fns';
import { get } from 'http';
import { MapContext } from './ListingsPage';
import { getAllAmenities } from '@/actions/listings/amenities';

interface Amenity {
    amenity_name: string;
    value: boolean;
}

export const metadata = {
    title: 'Listings | Unihomes',
    description: 'Web Platform',
};

interface Favorites {
    id: number;
    title: string;
    description: string;
    price: number;
    featured: boolean;
    amenities: Amenity[];
    lessor_name: string;
}

  
  const householdPrivacyTypes = [
    { value: "Shared Room", label: "Shared Room" },
    { value: "Whole Place", label: "Whole Place" },
    { value: "Private Room", label: "Private Room" }
  ];

export default function Listings() {
    const [householdAmenities, setHouseholdAmenities] = useState<any>([]);
    const [selectedFilter, setSelectedFilter] = useState<string[]>([]);
    const [selectedPrivacyType, setSelectedPrivacyType] = useState<string[]>([]);
    const [listings, setListings] = useState<Favorites[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); 
    const supabase = createClient(); 

    //Map Filtering States
    const [deviceLocation, setDeviceLocation] = useContext(MapContext);
    const position = { lat: 16.420039834357972, lng: 120.59908426196893 };
    const [selectedLocation, setSelectedLocation] = useState(deviceLocation);
    const [currentID, setCurrentID] = useState(null);


    const handleMapClick = async (event) => {
        if (event.detail.latLng) {
        setSelectedLocation(event.detail.latLng);
        setCurrentID(await get_nearbyListings(event.detail.latLng.lat, event.detail.latLng.lng))
        };
        // console.log(selectedFilter);
    }
    const handleDeviceLocation = async () => {
        if(deviceLocation){
            setSelectedLocation(deviceLocation);
            setCurrentID(await get_nearbyListings(deviceLocation.lat, deviceLocation.lng))
            setDeviceLocation(null);
        }
    }


    useEffect(() => {
        console.log("repeated")
        if(deviceLocation){
            handleDeviceLocation();
        }
        if(currentID){
            const fetchFilteredListings = async () => {
                const { data, error } = await supabase
                    .from('property')
                    .select('*')
                    .in('company_id', currentID); 
    
                if (error) {
                    console.error('Error fetching listings:', error);
                    setError('Failed to fetch listings');
                } else {
                    setListings(data || []); 
                    // console.log('Listings fetched successfully:', data);
                }
                // console.log(selectedLocation)
                setLoading(false); 
            };
            fetchFilteredListings();
        }
        if(currentID===null){
            const fetchAllListings = async () => {
                setListings(await get_allListings());
                setHouseholdAmenities(await getAllAmenities());
                setLoading(false); 
            };
            fetchAllListings();
        }
    },[currentID,  deviceLocation]);

    

    const sortedListings = [...listings].sort((a, b) => {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    });


    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    if (loading) {
        return <div className='flex justify-center items-center h-full'>Loading...</div>; 
    }

    if (error) {
        return <div className='text-red-500'>{error}</div>; 
    }

    return (
        <div className='h-full'>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='font-bold text-xl'>{listings.length} properties found</h1>
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
                                    <Map
                                    defaultZoom={15}
                                    defaultCenter={position}
                                    mapId={process.env.NEXT_PUBLIC_MAP_ID}
                                    onClick={handleMapClick}
                                    >
                                    {selectedLocation && (
                                        <AdvancedMarker
                                        position={selectedLocation}
                                        >
                                        </AdvancedMarker>
                                    )}
                                    </Map>
                                </APIProvider>
                                </div>
                            </Card>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div>
                                    <Label htmlFor='amenities' className='font-semibold'>
                                        Filter Amenities
                                    </Label>
                                    <MultiSelect
                                        options={householdAmenities}
                                        onValueChange={setSelectedFilter}
                                        defaultValue={selectedFilter}
                                        placeholder='Select amenities'
                                        variant='inverted'
                                        maxCount={6}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor='amenities' className='font-semibold'>
                                        Privacy Type
                                    </Label>
                                    <MultiSelect
                                        options={householdPrivacyTypes}
                                        onValueChange={setSelectedPrivacyType}
                                        defaultValue={selectedPrivacyType}
                                        placeholder='Select privacy type'
                                        variant='inverted'
                                        maxCount={3}
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
