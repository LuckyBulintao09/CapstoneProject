import React, { useEffect, useState } from 'react';
import BranchListings from '@/components/cardListings/BranchListings';
import { FilterCard } from './FilterCard';
import { Button } from '@/components/ui/button';
import { ArrowDownUp } from 'lucide-react';
import { createClient } from '../../../utils/supabase/client'; 

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

export default function Listings() {
    const [listings, setListings] = useState<Favorites[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); 
    const supabase = createClient(); 

    useEffect(() => {
        const fetchListings = async () => {
            const { data, error } = await supabase
                .from('property')
                .select('*'); 

            if (error) {
                console.error('Error fetching listings:', error);
                setError('Failed to fetch listings');
            } else {
                setListings(data || []); 
                console.log('Listings fetched successfully:', data);
            }
            setLoading(false); 
        };

        fetchListings();
    }, [supabase]);

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
                        <FilterCard />
                    </div>
                </div>
            </div>
        </div>
    );
}
