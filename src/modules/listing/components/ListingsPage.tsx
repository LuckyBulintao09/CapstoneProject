'use client';

import { useState, createContext } from 'react';
import ListingHero from './ListingHero';
import Listings from './Listings';

export const MapContext = createContext<any>(null);

export default function ListingsPage() {
	const [searchGlobalTerm, setSearchGlobalTerm] = useState('');
	const [deviceLocation, setDeviceLocation] = useState(null);

	return (
		<MapContext.Provider
			value={{
				deviceLocation,
				setDeviceLocation,
				searchGlobalTerm,
				setSearchGlobalTerm,
			}}
		>
			<div className="dark:bg-secondary min-h-screen flex flex-col">
				<div className="row-span-1 bg-gradient-to-r from-blue-900 via-blue-950 to-blue-900 shadow-xl">
					<div className="h-[205px] justify-center">
						<ListingHero />
					</div>
				</div>
				<div className="flex-grow p-8">
					<Listings />
				</div>
			</div>
		</MapContext.Provider>
	);
}
