'use client';

import tempValues from '@/lib/constants/tempValues';
import { useState } from 'react';
import ListingHero from './ListingHero';
import Listings from './Listings';

interface Amenity {
	amenity_name: string;
	value: boolean;
}

interface Favorites {
	id: number;
	title: string;
	description: string;
	price: number;
	featured: boolean;
	amenities: Amenity[];
	lessor_name: string;
}

export default function ListingsPage() {
	const [favoriteLists] = useState<Favorites[]>(tempValues.LISTINGS);
	const [searchTerm, setSearchTerm] = useState('');

	const filteredList = favoriteLists.filter((favoriteList) =>
		favoriteList.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
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
                <Listings />
            </div>
        </div>
    );
}
