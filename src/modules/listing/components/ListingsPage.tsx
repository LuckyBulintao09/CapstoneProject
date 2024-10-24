"use client";


import tempValues from '@/lib/constants/tempValues';
import { useState, createContext } from 'react';
import ListingHero from './ListingHero';
import Listings from './Listings';
import { map } from 'zod';


interface Amenity {
  amenity_name: string;
  value: boolean;
}



export const MapContext = createContext<any>(null);


export default function ListingsPage() {
	const [searchTerm, setSearchTerm] = useState('');
	const [deviceLocation, setDeviceLocation] = useState<any>(null);

	return (
		<MapContext.Provider value={[deviceLocation,
									setDeviceLocation]}>
        <div className="dark:bg-secondary min-h-screen flex flex-col">
            <div className="row-span-1 bg-dot lg:mt-0 md:mt-8 sm:mt-3 xs:mt-2">
                <div className="h-[250px] flex justify-center rounded-b-3xl">
                    <ListingHero
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                </div>
            </div>

            <div className="flex-grow p-8">
                <Listings/>
            </div>
        </div>
		</MapContext.Provider>
    );
}
