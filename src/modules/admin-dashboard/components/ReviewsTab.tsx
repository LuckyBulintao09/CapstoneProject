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

export function ReviewsTab() {
	return (
		<>
			<Card className='h-full bg-white dark:bg-secondary'>
				<CardHeader>
					<CardTitle>Reported Reviews</CardTitle>
					<CardDescription>
						Upcoming {reported_reviews.length} reported reviews needed to be
						resolved
					</CardDescription>
				</CardHeader>
				<CardContent className='flex flex-col h-[500px]'>
					<div className='overflow-y-auto'>
						<ReviewReportsDashboard />
					</div>
				</CardContent>
			</Card>
		</>
	);
}
