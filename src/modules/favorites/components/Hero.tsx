'use client';

import { Button } from '@/components/ui/button';
import spiels from '@/lib/constants/spiels';
import { SearchIcon } from 'lucide-react';
import React from 'react';

interface HeroSectionProps {
	searchTerm: string;
	setSearchTerm: (term: string) => void;
}

export default function HeroSection({
	searchTerm,
	setSearchTerm,
}: HeroSectionProps) {
	return (
		<div className='flex items-center justify-center h-screen w-screen'>
			<div className='w-full px-4 lg:py-8'>
				<div className='flex flex-col items-center text-center'>
					<p className='my-2 text-pretty text-lg text-gray-200'>
						{spiels.FAVORITES_SUBHEADER}
					</p>
					<h1 className='text-pretty text-4xl font-bold lg:text-6xl md:text-5xl text-white'>
						Favorites
					</h1>
					<form className='flex mt-5 w-full max-w-md justify-center'>
						<label htmlFor='search' className='sr-only'>
							{spiels.BUTTON_SEARCH}
						</label>
						<div className='relative flex w-full'>
							<SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black dark:text-muted-foreground' />
							<input
								type='search'
								name='search'
								id='search'
								className='block w-full rounded-lg border-0 bg-white px-10 py-2 text-black dark:text-muted-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-accent'
								placeholder='Search'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
