'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import ReviewReportsDashboard from '../review-components/page';
import { reported_reviews } from '@/lib/constants/reported_reviews';
import { useState } from 'react';

export function ReviewsTab() {
	const [newReportedReviewsCount, setNewReportedReviewsCount] = useState(0);

	const handleCountUpdate = (count: number) => {
		setNewReportedReviewsCount(count);
	};
	return (
		<>
			<Card className='h-full bg-white dark:bg-secondary'>
				<CardHeader>
					<CardTitle>Reported Reviews</CardTitle>
					<CardDescription>
						Upcoming {newReportedReviewsCount} reported reviews needed to be
						resolved
					</CardDescription>
				</CardHeader>
				<CardContent className='flex flex-col h-[500px]'>
					<div className='overflow-y-auto'>
						<ReviewReportsDashboard onCountUpdate={handleCountUpdate} />
					</div>
				</CardContent>
			</Card>
		</>
	);
}
