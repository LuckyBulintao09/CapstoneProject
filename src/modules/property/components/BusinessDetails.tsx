'use client';

import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import tempValues from '@/lib/constants/tempValues';
import SpecificBranchListings from '../../lessor-dashboard/components/SpecificBranchListings';
import BusinessReviews from './BusinessReviews';

interface BranchListings {
	id: number;
	branch: string;
	available_rooms: {
		room_id: number;
		room_title: string;
		room_capacity: number;
		lifestyle: string;
		description: string;
		price: number;
		availability: boolean;
	}[];
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
	const [specificBranchList] = useState<BranchListings[]>(
		tempValues.BRANCHES_AND_ROOMS
	);
	const [selectedBranch, setSelectedBranch] = useState<BranchListings | null>(
		null
	);

	const handleBranchClick = (branch: BranchListings) => {
		setSelectedBranch(branch);
	};

	return (
		<div className='xl:flex xl:justify-center'>
			<Tabs
				defaultValue='about'
				className='w-[606px] sm:w-[750px] md:w-[1006px] lg:w-[1246px] xl:w-[1300px] px-8 py-4'
			>
				<TabsList className='grid grid-cols-3 dark:text-white dark:bg-opacity-15 dark:bg-transparent'>
					<TabsTrigger value='about'>About</TabsTrigger>
					<TabsTrigger value='branchesAndRooms'>
						Properties 
					</TabsTrigger>
					<TabsTrigger value='reviews'>Customer Reviews</TabsTrigger>
				</TabsList>

				{/* ABOUT SECTION */}
				<TabsContent value='about'>
					<Card className='dark:bg-transparent dark:border-none'>
						<CardHeader className='dark:border-t-2 dark:border-sky-900'>
							<CardTitle>About {companyName}</CardTitle>
							<CardDescription>On UniHomes since {new Date(created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</CardDescription>
						</CardHeader>
						<CardContent className='space-y-2 dark:text-white'>
							<div className='space-y-1'>{about}</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* BRANCHES SECTION */}
				<TabsContent value='branchesAndRooms'>
					<Card className='dark:bg-transparent dark:border-none'>
						<CardHeader className='dark:border-t-2 dark:border-sky-900'>
							<CardTitle>Properties</CardTitle>
							<CardDescription>Explore our different properties</CardDescription>
						</CardHeader>
						<CardContent className='space-y-1'>
							<Carousel>
								<CarouselContent>
									{specificBranchList.map((branch) => (
										<CarouselItem
											key={branch.id}
											className='lg:basis-1/4 md:basis-1/3 sm:basis-1/2 xs:basis-1/2'
											onClick={() => handleBranchClick(branch)}
										>
											<Card
												className={`border-slate-400 ${
													selectedBranch?.id === branch.id
														? 'bg-sky-800 text-white'
														: 'bg-none'
												}`}
											>
												<CardContent className='flex h-16 items-center justify-center p-0'>
													{branch.branch}
												</CardContent>
											</Card>
										</CarouselItem>
									))}
								</CarouselContent>
							</Carousel>

							{/* Display available rooms for selected branch */}
							{selectedBranch ? (
								<div className='space-y-1 pt-1 pl-2' onClick={() => { window.location.href = "/property/room"; }}>
									<SpecificBranchListings
										// companyId={companyId}
										listings={selectedBranch.available_rooms}
									/>
								</div>
							) : (
								<p>Please select a branch to see available rooms.</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* REVIEWS SECTION */}
				<TabsContent value='reviews'>
					<Card className='dark:bg-transparent dark:border-none'>
						<CardHeader className='dark:border-t-2 dark:border-sky-900'>
							<CardTitle>Customer Reviews</CardTitle>
							<CardDescription>Read what people have to say</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-1'>
								<BusinessReviews />
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
