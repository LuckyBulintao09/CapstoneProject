'use client';

import FavoriteListings from '@/modules/favorites/components/FavoriteListings';
import tempValues from '@/lib/constants/tempValues';
import React, { useState } from 'react';
import { FavoritesBreadcrumbSection } from '@/components/breadcrumb/FavoritesBreadcrumbSection';
import { Search } from 'lucide-react';

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
		<div className='px-32 md:px-24 sm:px-20 xs:px-10 h-full relative mb-8 bg-background flex flex-col min-h-screen'>
			<FavoritesBreadcrumbSection />
			<div className='flex justify-between items-center mt-4'>
				<div>
					<h1 className='font-semibold text-3xl dark:text-white'>Favorites</h1>
				</div>
				<div className='relative hidden xs:block sm:block'>
					<div className='search-container relative'>
						<Search className='absolute left-2 top-2 text-gray-400' size={20} />
						<input
							type='search'
							className='transition-all text-sm duration-500 ease-in-out px-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700'
							placeholder='Search for a property...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
			</div>
			<div className='mt-4'>
				<FavoriteListings
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
				/>
			</div>
		</div>
	);
}
