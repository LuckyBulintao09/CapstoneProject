'use client';

import tempValues from '@/lib/constants/tempValues';
import { useState, createContext } from 'react';
import ListingHero from './ListingHero';
import Listings from './Listings';
import { map } from 'zod';
import { useLoadScript } from '@react-google-maps/api';

interface Amenity {
	amenity_name: string;
	value: boolean;
}

export const MapContext = createContext<any>(null);

export default function ListingsPage() {
	const [searchTerm, setSearchTerm] = useState('');
	const [deviceLocation, setDeviceLocation] = useState<any>(null);

	return (
		<MapContext.Provider value={[deviceLocation, setDeviceLocation]}>
			<div className='dark:bg-secondary min-h-screen flex flex-col'>
				<div className='row-span-1 bg-gradient-to-r from-blue-900 via-blue-950 to-blue-900 shadow-xl'>
					<div className='h-[205px] justify-center'>
						<ListingHero
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
						/>
					</div>
				</div>

				<div className='flex-grow p-8'>
					<Listings />
				</div>
			</div>
		</MapContext.Provider>
	);
}
