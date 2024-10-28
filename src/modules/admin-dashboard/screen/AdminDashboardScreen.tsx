import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ReviewsTab } from '../components/ReviewsTab';
import NewCompanies from '../components/NewCompanies';
import { NewProprietorsTab } from '../components/NewProprietorsTab';

export function AdminDashboardScreen() {
	return (
		<div className='dark:bg-secondary h-screen'>
			<div className='mx-4 py-10 lg:pt-5'>
				<Tabs defaultValue='newCompanies' className='w-full'>
					<TabsList className='grid w-full lg:w-[30%] grid-cols-3'>
						<TabsTrigger value='newCompanies'>New Companies</TabsTrigger>
						<TabsTrigger value='newProprietors'>New Proprietors</TabsTrigger>
						<TabsTrigger value='reportedReviews'>Reported Reviews</TabsTrigger>
					</TabsList>
					<TabsContent value='newCompanies'>
						<NewCompanies />
					</TabsContent>
					<TabsContent value='newProprietors'>
						<NewProprietorsTab />
					</TabsContent>
					<TabsContent value='reportedReviews'>
						<ReviewsTab />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
