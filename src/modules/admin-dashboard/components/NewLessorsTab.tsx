'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import spiels from '@/lib/constants/spiels';
import NewLessorsDashboard from '../newLessors-components/page';
import { new_lessors } from '@/lib/constants/new_lessors';

export function NewLessorsTab() {
	return (
		<Card className='h-full bg-white dark:bg-secondary'>
			<CardHeader>
				<CardTitle>{spiels.ADMIN_CARD_HEADER}</CardTitle>
				<CardDescription>
					Upcoming {new_lessors.length} lessors waiting for approval
				</CardDescription>
			</CardHeader>
			<CardContent className='flex flex-col h-[500px]'>
				<div className='overflow-y-auto'>
					<NewLessorsDashboard />
				</div>
			</CardContent>
		</Card>
	);
}
