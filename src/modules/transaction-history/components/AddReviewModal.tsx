'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';

interface AddReviewModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const AddReviewModal = ({ isOpen, onClose }: AddReviewModalProps) => {
	const [rating, setRating] = useState<number>(0);
	const [hoverRating, setHoverRating] = useState<number>(0);

	const handleStarClick = (index: number) => {
		setRating(index + 1);
	};

	const handleStarHover = (index: number) => {
		setHoverRating(index + 1);
	};

	const resetHover = () => {
		setHoverRating(0);
	};

	const stars = Array(5).fill(null);

	const handleSubmit = () => {
		onClose();
	};

	return (
		<div className=' px-4 mx-4'>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className='bg-white dark:bg-secondary'>
					<p className='flex items-center text-center justify-center text-2xl font-bold'>
						How was your experience?
					</p>
					<div className='flex justify-center'>
						{stars.map((_, index) => (
							<Star
								key={index}
								onClick={() => handleStarClick(index)}
								onMouseEnter={() => handleStarHover(index)}
								onMouseLeave={resetHover}
								className={`h-8 w-8 cursor-pointer ${
									(hoverRating || rating) > index
										? 'text-amber-500'
										: 'text-gray-400'
								}`}
							/>
						))}
					</div>

					<div className='py-4'>
						<Textarea
							placeholder='Write your review here'
							className='min-h-[150px] dark:bg-tertiary dark:text-white'
						/>
					</div>
					<DialogFooter>
						<Button variant='outline' onClick={onClose}>
							Cancel
						</Button>
						<Button onClick={handleSubmit}>Submit Review</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AddReviewModal;
