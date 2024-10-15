import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewLessorsTab } from '../components/NewLessorsTab';
import { ReviewsTab } from '../components/ReviewsTab';

export function AdminDashboardScreen() {
	return (
		<div className='dark:bg-secondary h-screen'>
			<div className='mx-4 py-10 lg:pt-5'>
				<Tabs defaultValue='newLessors' className='w-full'>
					<TabsList className='grid w-full lg:w-[30%] grid-cols-2'>
						<TabsTrigger value='newLessors'>New Lessors</TabsTrigger>
						<TabsTrigger value='reportedReviews'>Reported Reviews</TabsTrigger>
					</TabsList>
					<TabsContent value='newLessors'>
						<NewLessorsTab />
					</TabsContent>
					<TabsContent value='reportedReviews'>
						<ReviewsTab />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
