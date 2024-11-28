import { useEffect, useState } from 'react';
import getAllReviewsUnderCompany from '@/actions/reviews/getAllReviewsUnderCompany';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ReportModal from './ReportReview';
import { reportReview } from '@/actions/reviews/reportReview';
import { toast } from 'sonner';

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
			<div className='grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4'>
				{loading ? (
					<div className='col-span-3 flex justify-center items-center h-32'>
						<Loader className='h-10 w-10 animate-spin text-sky-500' />
					</div>
				) : reviews.length > 0 ? (
					reviews.map((review) => (
						<Card
							key={review.id}
							className='relative shadow-lg rounded-lg border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700'
						>
							<div className='absolute top-2 right-4'>
								<Dropdown unitId={review.property.property_id} reviewId={review.id} />
							</div>
							<CardHeader className='flex items-start border-b border-gray-200 dark:border-gray-700 py-3'>
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
										<p className='text-sm font-semibold text-foreground pb-0 mb-0'>
											{`${review.account.firstname} ${review.account.lastname}`}
										</p>
										<div className='flex items-center text-xs text-gray-500 dark:text-gray-400'>
											<p className='mr-1'>
												{new Date(review.created_at).toLocaleDateString()}
											</p>

											<span className='mx-1'>|</span>

											<div className='flex space-x-1 ml-1'>
												{/* {[...Array(5)].map((_, index) => (
													<Star
														key={index}
														className={`h-3 w-3 ${
															index < review.ratings
																? 'text-yellow-400'
																: 'text-gray-300'
														}`}
														fill={index < review.ratings ? '#eab308' : 'none'}
													/>
												))} */}
												{review.ratings ? (
													<>
														<Star
															className='h-4 w-4 text-yellow-500'
															fill='#eab308'
														/>
														<span className='ml-1 text-sm xs:text-xs'>
															{review.ratings.toFixed(1)}
														</span>
													</>
												) : // nilagay ko lang para sa mga hindi na-review na listing
												null}
											</div>
										</div>
									</div>
								</div>
							</CardHeader>
							<CardContent className='pt-4 text-gray-700 dark:text-gray-300'>
								<p className='text-sm'>{review.comment}</p>
							</CardContent>
						</Card>
					))
				) : (
					<div className='col-span-3 items-center justify-center text-center mt-20'>
						<p className='text-md font-semibold'>
							No reviews available for this company.
						</p>
						<p className='text-sm text-gray-500'>
							No reviews yet, but you can be the first to share your thoughts!
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

const Dropdown: React.FC<{ unitId: number; reviewId: number }> = ({
	unitId,
	reviewId,
}) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => setIsModalOpen(false);

	const handleReportSubmit = async (reportData: { reason: string }) => {
		let reportStatus = false;
		await reportReview(reviewId, reportData.reason).then((result) => {
			reportStatus = result;
		});

		if (reportStatus) {
			setIsOpen(false);
			setIsModalOpen(false);
			toast.success('Review reported successfully!');
		} else {
			toast.error('Failed to report review. Please try again.');
		}
	};

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
							onClick={handleOpenModal}
							className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
						>
							Report Review
						</a>
						<Link
							href={`/property/${unitId}`}
							className='block px-4 py-2 text-sm text-sky-600 hover:text-sky-800 transition-colors duration-200'
						>
							View Property
						</Link>
					</div>

					<ReportModal
						isOpen={isModalOpen}
						onClose={handleCloseModal}
						onSubmit={handleReportSubmit}
					/>
				</div>
			)}
		</div>
	);
};

export default ReviewsUnderCompany;
