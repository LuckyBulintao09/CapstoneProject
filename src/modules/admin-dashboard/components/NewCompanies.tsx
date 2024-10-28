import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import React, { useState } from 'react';
import NewCompaniesDashboard from '../newCompanies-components/page';

const NewCompanies = () => {
	const [newCompaniesCount, setNewCompaniesCount] = useState(0);

	const handleCountUpdate = (count: number) => {
		setNewCompaniesCount(count);
	};
	return (
		<Card className='h-full bg-white dark:bg-secondary'>
			<CardHeader>
				<CardTitle>New Companies</CardTitle>
				<CardDescription>
					Upcoming {newCompaniesCount} companies waiting for approval
				</CardDescription>
			</CardHeader>
			<CardContent className='flex flex-col h-[500px]'>
				<div className='overflow-y-auto'>
					<NewCompaniesDashboard onCountUpdate={handleCountUpdate} />
				</div>
			</CardContent>
		</Card>
	);
};

export default NewCompanies;
