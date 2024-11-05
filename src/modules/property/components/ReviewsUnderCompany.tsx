import { useEffect, useState } from 'react';
import getAllReviewsUnderCompany from '@/actions/reviews/getAllReviewsUnderCompany';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Review {
	id: number;
	comment: string;
	created_at: string;
	ratings: number;
	unit_id: number;
	firstname: string;
	lastname: string;
	profile_url: string | null;
}

interface ReviewsUnderCompanyProps {
	companyId: number;
}

const ReviewsUnderCompany: React.FC<ReviewsUnderCompanyProps> = ({
	companyId,
}) => {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchReviews = async () => {
			setLoading(true);
			try {
				const reviews = await getAllReviewsUnderCompany(companyId);
				setReviews(reviews);
			} catch (error) {
				console.error('Error fetching reviews:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchReviews();
	}, [companyId]);

	return (
		<div>
			<div className='grid grid-cols-3 gap-4'>
				{loading ? (
					<div className='flex justify-center items-center h-32'>
						<Loader className='h-10 w-10 animate-spin text-sky-500' />
					</div>
				) : reviews.length > 0 ? (
					reviews.map((review) => (
						<Card
							key={review.id}
							className='relative shadow-lg rounded-lg border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'
						>
							<div className='absolute top-4 right-4'>
								<Dropdown unitId={review.unit_id} />
							</div>
							<CardHeader className='flex items-start border-b border-gray-200 dark:border-gray-700'>
								<div className='flex items-center space-x-3'>
									<Avatar className='h-10 w-10'>
										<AvatarImage
											src={review.profile_url || ''}
											alt={`${review.firstname} ${review.lastname}`}
										/>
										<AvatarFallback>
											{`${review.account.firstname.charAt(
												0
											)}${review.account.lastname.charAt(0)}`.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className='font-semibold text-gray-800 dark:text-gray-200 pb-0 mb-0'>
											{`${review.account.firstname} ${review.account.lastname}`}
										</p>
										<small className='text-gray-500 dark:text-gray-400'>
											{new Date(review.created_at).toLocaleDateString()}
										</small>
										<div className='flex space-x-1'>
											{[...Array(5)].map((_, index) => (
												<Star
													key={index}
													className={`h-3 w-3 ${
														index < review.ratings
															? 'text-yellow-400'
															: 'text-gray-300'
													}`}
													fill={index < review.ratings ? '#eab308' : 'none'}
												/>
											))}
										</div>
									</div>
								</div>
							</CardHeader>
							<CardContent className='pt-4 text-gray-700 dark:text-gray-300'>
								<p className='text-base'>{review.comment}</p>
							</CardContent>
						</Card>
					))
				) : (
					<p className='text-center text-gray-500 dark:text-gray-400'>
						No reviews available for this company.
					</p>
				)}
			</div>
		</div>
	);
};

const Dropdown: React.FC<{ unitId: number }> = ({ unitId }) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<div className='relative inline-block text-left'>
			<button
				onClick={() => setIsOpen((prev) => !prev)}
				className='inline-flex justify-center p-2 text-gray-500 hover:text-gray-700 focus:outline-none'
				aria-haspopup='true'
				aria-expanded={isOpen}
			>
				&#x22EE;
			</button>

			{isOpen && (
				<div className='absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg'>
					<div className='py-1'>
						<a
							href='#'
							className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
						>
							Report Review
						</a>
						<Link
							href={`/property/room/${unitId}`}
							className='block px-4 py-2 text-sm text-sky-600 hover:text-sky-800 transition-colors duration-200'
						>
							View Unit
						</Link>
					</div>
				</div>
			)}
		</div>
	);
};

export default ReviewsUnderCompany;
