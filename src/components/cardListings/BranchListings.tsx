import React from 'react';
import { BentoGrid, BentoGridItem } from '../ui/bento-grid';
import { Badge } from '../ui/badge';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns'; 
import { redirect } from 'next/navigation';

interface Amenity {
    amenity_name: string;
    value: boolean;
}

interface BranchlistingsProps {
    id: number;
    title: string;
    description: string;
    price: number;
    featured: boolean;
    amenities: Amenity[];
    address: string;
    created_at: string;
    details: string;
    thumbnail_url: string; 
}

export const metadata = {
    title: 'Listings | Unihomes',
    description: 'Web Platform',
};

export default function BranchListings({
    id,
    title,
    description,
    featured,
    price,
    address,
    created_at,
    details,
    thumbnail_url,
}: BranchlistingsProps) {
    const formattedPrice = new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);

    const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true });

    const handleClick = () => {
        window.location.href = `/property/room/${id}`;
    };
    

    return (
        <div>
            <BentoGrid className='max-w-screen mx-auto'>
                <BentoGridItem
                    onClick={() => {handleClick()}} 
                    title={
                        <div className='flex items-center justify-between'>
                            <span className='sm:text-sm xs:text-xs line-clamp-1'>
                                {title}
                            </span>
                            <div className='flex items-center'>
                                <Star className='h-4 w-4 text-yellow-500' fill='#eab308' />
                                <span className='ml-1 text-sm xs:text-xs'>4.5</span>
                            </div>
                        </div>
                    }
                    description={
                        <div>
                            <p className='line-clamp-1'><strong>{description}</strong> </p>
                            <strong><p className='line-clamp-1'> {details}</p></strong>
                            <p className='line-clamp-1'> {address}</p>
                            <p className='line-clamp-1'>Listed {timeAgo}</p>
                            <div className='flex flex-row mt-2'>
                                <span className='font-bold mr-1'>{formattedPrice}</span> month
                            </div>
                        </div>
                    }
                    header={
                        <div className='relative'>
                            <div className='bg-gray-200 w-full h-[170px] rounded-lg overflow-hidden flex items-center justify-center'>
                                {thumbnail_url && thumbnail_url.trim() !== '' ? (
                                    <img
                                        src={thumbnail_url}
                                        alt='Thumbnail'
                                        className='w-full h-full object-cover cursor-pointer' 
                                        onClick={handleClick} 
                                    />
                                ) : (
                                    <p className='text-center text-gray-500'>Image not found</p> 
                                )}
                                {featured && (
                                    <Badge
                                        className='absolute right-2 top-2 bg-primary text-white'
                                        variant='secondary'
                                    >
                                        Featured
                                    </Badge>
                                )}
                            </div>
                        </div>
                    }
                    className='shadow-sm h-auto flex flex-col justify-between p-4 cursor-pointer' 
                />
            </BentoGrid>
        </div>
    );
}
