'use client';

import FavoriteListings from '@/modules/favorites/components/FavoriteListings';
import HeroSection from '../components/Hero';
import tempValues from '@/lib/constants/tempValues';
import React, { useState } from 'react';

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

export default function FavoritesScreen() {

	const [favoriteLists] = useState<Favorites[]>(tempValues.LISTINGS);
	const [searchTerm, setSearchTerm] = useState('');

	const filteredList = favoriteLists.filter((favoriteList) =>
		favoriteList.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className='dark:bg-secondary '>
			<div className='grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 xs:grid-cols-1'>
				<div className='min-h-screen flex justify-center rounded-r-3xl bg-dot'>
					<HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
				</div>
				<div className='p-8 '>
					<FavoriteListings searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
				</div>
			</div>
		</div>
	);
}
