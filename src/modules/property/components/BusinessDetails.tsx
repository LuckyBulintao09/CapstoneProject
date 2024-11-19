'use client';

import { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SpecificBranchListings from '../../lessor-dashboard/components/SpecificBranchListings';
import ReviewsUnderCompany from './ReviewsUnderCompany';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAllPropertyUnderSpecificCompanyRPC } from '@/actions/property/getAllPropertyUnderSpecificCompany';
import BranchListings from '@/components/cardListings/BranchListings';

interface Unit {
	id: number;
	title: string;
	capacity: number;
	price: number;
	availability: boolean;
}

interface Property {
	id: number;
	title: string;
	address: string;
}

interface BusinessDetailsProps {
	companyName: string;
	about: string;
	created_at: string;
	companyId: number;
	firstname: string;
	lastname: string;
	email: string;
	cp_number: string;
}

export function BusinessDetails({
	companyName,
	about,
	created_at,
	companyId,
	firstname,
	lastname,
	email,
	cp_number,
}: BusinessDetailsProps) {
	const [loading, setLoading] = useState<boolean>(true);
	const [properties, setProperties] = useState<any>(null);

	useEffect(() => {
		const fetchPropertys = async () => {
			try {
				setProperties(await getAllPropertyUnderSpecificCompanyRPC(companyId));
			} catch (error) {
				console.error('Error fetching propertys:', error);
			}

			setLoading(false);
		};

		fetchPropertys();
	}, [companyId]);

	return (
		<Tabs defaultValue='about' className=''>
			<TabsList className='grid grid-cols-3 dark:text-white dark:bg-opacity-15'>
				<TabsTrigger value='about'>About</TabsTrigger>
				<TabsTrigger value='branchesAndRooms'>Properties</TabsTrigger>
				<TabsTrigger value='reviews'>Company Reviews</TabsTrigger>
			</TabsList>

			{/* ABOUT SECTION */}
			<TabsContent value='about'>
				<Card className='dark:bg-transparent bg-transparent'>
					<CardHeader>
						<CardTitle>About {companyName}</CardTitle>
						<CardDescription>
							On UniHomes since{' '}
							{new Date(created_at).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-2 dark:text-white'>
						<div className='space-y-1'>{about}</div>
					</CardContent>
				</Card>
			</TabsContent>

			{/* PROPERTIES SECTION */}
			<TabsContent value='branchesAndRooms'>
				<Card className='dark:bg-transparent bg-transparent'>
					<CardHeader>
						<CardTitle>Properties</CardTitle>
						<CardDescription>Explore our different properties</CardDescription>
					</CardHeader>
					<CardContent className='space-y-1'>
						<ScrollArea className='h-[300px] w-full rounded-md'>
							{/* {loading ? (
                  <div>Loading units...</div>
                ) : units.length > 0 ? (
                  <div className="space-y-1 pt-1 pl-2 pb-3">
                    <SpecificBranchListings listings={units} />
                  </div>
                ) : (
                  <p>No units available.</p>
                )} */}
							{loading ? (
								<div className='text-center'>Loading properties...</div>
							) : (
								<div className='grid grid-cols-1 gap-4 m-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
									{properties.slice(0, 4).map((item) => (
										<div key={item.id}>
											<BranchListings key={item.id} {...item} />
										</div>
									))}
								</div>
							)}
						</ScrollArea>
					</CardContent>
				</Card>
			</TabsContent>

			{/* REVIEWS SECTION */}
			<TabsContent value='reviews'>
				<Card className='dark:bg-transparent bg-transparent'>
					<CardHeader>
						<CardTitle>Customer Reviews</CardTitle>
						<CardDescription>Read what people have to say</CardDescription>
					</CardHeader>
					<CardContent>
						<ScrollArea className='h-[300px] w-full rounded-md p-4'>
							<ReviewsUnderCompany companyId={companyId} />
						</ScrollArea>
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
