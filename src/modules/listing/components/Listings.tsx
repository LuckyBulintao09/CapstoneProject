import BranchListings from '@/components/cardListings/BranchListings';
import { FilterCard } from './FilterCard';
import { Button } from '@/components/ui/button';
import { ArrowDownUp } from 'lucide-react';
import tempValues from '@/lib/constants/tempValues';

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

interface FavoriteListingsProps {
	listings: Favorites[];
}

export default function Listings({ listings }: FavoriteListingsProps) {
	return (
		<div className='h-full'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='font-bold text-xl'>
					{tempValues.LISTINGS.length} rooms found
				</h1>
				<Button variant={'outline'} className='mb-2'>
					<div className='flex items-center'>
						<span>Sort by price</span>
						<ArrowDownUp className='w-4 h-auto ml-1' />
					</div>
				</Button>
			</div>

			<div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5 sm:grid-cols-3 xs:grid-cols-2'>
				<div className='col-span-3 grid grid-cols-2 lg:grid-cols-3 md:grid-cols-3 gap-4'>
					{listings.map((item) => (
						<BranchListings key={item.title} {...item} />
					))}
				</div>

				<div className='flex lg:justify-end lg:items-start lg:col-span-2 col-span-3'>
					<div className='sticky top-20 w-full'>
						<FilterCard />
					</div>
				</div>
			</div>
		</div>
	);
}
