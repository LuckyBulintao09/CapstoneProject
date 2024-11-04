'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import spiels from '@/lib/constants/spiels';
import NewLessorsDashboard from '../newProprietors-components/page';
import { useState } from 'react';

export function NewProprietorsTab() {
	const [newProprietorsCount, setNewProprietorsCount] = useState(0);

	const handleCountUpdate = (count: number) => {
		setNewProprietorsCount(count);
	};
	return (
		<Card className='h-full bg-white dark:bg-secondary'>
			<CardHeader>
				<CardTitle>{spiels.ADMIN_CARD_HEADER}</CardTitle>
				<CardDescription>
					Upcoming {newProprietorsCount} proprietors waiting for approval
				</CardDescription>
			</CardHeader>
			<CardContent className='flex flex-col h-[500px]'>
				<div className='overflow-y-auto'>
					<NewLessorsDashboard onCountUpdate={handleCountUpdate} />
				</div>
			</CardContent>
		</Card>
	);
}
