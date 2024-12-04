'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
	Chart as ChartJS,
	RadialLinearScale,
	ArcElement,
	Tooltip,
	Legend,
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';
import { LucideStar, MessageSquare } from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import Reviews from './reviews';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const ReviewsAnalytics = () => {
	// const [reviews, setReviews] = useState([]);
	// const [loading, setLoading] = useState(true);
	const [selectedProperty, setSelectedProperty] = useState('default');

	// useEffect(() => {
	// 	const fetchReviews = async () => {
	// 		setLoading(true);
	// 		try {
	// 			const reviews = await getAllReviewsUnderCompany(companyId);
	// 			setReviews(reviews);
	// 		} catch (error) {
	// 			console.error('Error fetching reviews:', error);
	// 		} finally {
	// 			setLoading(false);
	// 		}
	// 	};

	// 	fetchReviews();
	// }, [companyId]);

	const data = {
		labels: ['Cleanliness', 'Location', 'Value for Money'],
		datasets: [
			{
				label: 'Review Ratings',
				data: [10, 7, 6],
				backgroundColor: [
					'rgba(54, 162, 235, 0.5)',
					'rgba(75, 192, 192, 0.5)',
					'rgba(255, 206, 86, 0.5)',
				],
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		aspectRatio: 1,
		plugins: {
			legend: {
				position: 'top',
			},
		},
	};

	const averageRating = 4.2;

	const renderStars = (rating) => {
		let stars = [];
		for (let i = 1; i <= 5; i++) {
			if (i <= Math.floor(rating)) {
				stars.push(<FaStar key={i} color='#FFD700' />);
			} else if (i === Math.ceil(rating) && rating % 1 !== 0) {
				stars.push(<FaStar key={i} color='#FFD700' opacity='0.5' />);
			} else {
				stars.push(<FaRegStar key={i} color='#FFD700' />);
			}
		}
		return stars;
	};

	return (
		<>
			<div className='mb-4 flex items-center space-x-4'>
				<Select value={selectedProperty} onValueChange={setSelectedProperty}>
					<SelectTrigger
						id='property-selector'
						className='border-gray-300 bg-transparent w-48 rounded-md text-sm text-gray-700 focus:ring-offset-0 focus:ring-0 hover:font-semibold transition-all duration-300'
					>
						<SelectValue placeholder='Select Property' />
					</SelectTrigger>
					<SelectContent
						position='popper'
						className='text-sm bg-white border-gray-300'
					>
						<SelectItem value='default' className='text-sm'>
							Property 1
						</SelectItem>
						<SelectItem value='property2' className='text-sm'>
							Property 2
						</SelectItem>
					</SelectContent>
				</Select>

				{/* Simple Date Dropdown */}
				<Select value={selectedProperty} onValueChange={setSelectedProperty}>
					<SelectTrigger
						id='property-selector'
						className='border-gray-300 bg-transparent w-48 rounded-md text-sm text-gray-700 focus:ring-offset-0 focus:ring-0 hover:font-semibold transition-all duration-300'
					>
						<SelectValue placeholder='Select Property' />
					</SelectTrigger>
					<SelectContent
						position='popper'
						className='text-sm bg-white border-gray-300'
					>
						<SelectItem value='default' className='text-sm'>
							All Time
						</SelectItem>
						<SelectItem value='last24hrs' className='text-sm'>
							Last 24 hours
						</SelectItem>
						<SelectItem value='last7days' className='text-sm'>
							Last 7 days
						</SelectItem>
						<SelectItem value='last4weeks' className='text-sm'>
							Last 4 weeks
						</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className='grid grid-cols-1 xl:grid-cols-2 gap-4 pb-14'>
				<Card className='bg-white rounded-lg border-gray-300'>
					<p className='p-4 text-xs text-gray-500'>Overall Review Ratings</p>
					<CardContent className='flex justify-center items-center'>
						<div style={{ width: '400px', height: '400px' }}>
							<PolarArea data={data} />
						</div>
					</CardContent>
				</Card>

				<div className='grid grid-rows-3 gap-4'>
					<Card className='bg-white rounded-lg border-gray-300'>
						<p className='p-4 text-xs text-gray-500'>
							Overall Rating and Reviews
						</p>
						<CardContent className='grid grid-cols-2 pt-3'>
							<div className='flex flex-col items-center justify-center text-center border-r border-gray-300 pr-4'>
								<div className='flex items-center'>
									<LucideStar className='h-6 w-6 text-yellow-500 mr-2' />

									<span className='font-bold text-2xl'>4.2</span>
								</div>
								<span className='text-xs text-green-600 mt-1'>
									Total Property Rating
								</span>
							</div>
							<div className='flex flex-col items-center justify-center text-center pl-4'>
								<div className='flex items-center'>
									<MessageSquare className='h-6 w-6 text-yellow-500 mr-2' />

									<span className='font-bold text-2xl'>32</span>
								</div>
								<span className='text-xs text-green-600 mt-1'>
									Total Reviews
								</span>
							</div>
						</CardContent>
					</Card>

					{/* Reviews List */}
					<Card className='row-span-2 bg-white rounded-lg border-gray-300'>
						<p className='p-4 text-xs text-gray-500'>Overall Unit Reviews</p>
						<CardContent className='overflow-y-auto max-h-[250px]'>
							<Reviews />
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
};

export default ReviewsAnalytics;
