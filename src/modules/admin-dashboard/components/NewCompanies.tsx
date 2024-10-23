import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import React from 'react';
import NewCompaniesDashboard from './newCompanies-components/page';
import { new_companies } from '@/lib/constants/new_companies';

const NewCompanies = () => {
	return (
		<Card className='h-full bg-white dark:bg-secondary'>
			<CardHeader>
				<CardTitle>New Companies</CardTitle>
				<CardDescription>
					Upcoming {new_companies.length} companies waiting for approval
				</CardDescription>
			</CardHeader>
			<CardContent className='flex flex-col h-[500px]'>
				<div className='overflow-y-auto'>
					<NewCompaniesDashboard />
				</div>
			</CardContent>
		</Card>
	);
};

export default NewCompanies;
