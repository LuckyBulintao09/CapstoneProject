import React from 'react';
import CustomBreadcrumbs from '@/modules/hosting/components/CustomBreadcrumbs';
import ReviewsAnalytics from './screens/ReviewsAnalytics';
import ReservationsAnalytics from './screens/ReservationsAnalytics';
function Page() {
	return (
		// <div className='flex flex-col space-y-6 p-8 m-1'>
		// 	<div className='flex space-x-6'>
		// 		<div className='flex flex-col space-y-6 border flex-shrink-0 w-1/8'>
		// 			<AnalyticsPage />
		// 			<PropertyAnalytics />
		// 		</div>

		// 		<div className='flex-1 border p-4'>
		// 			<PropertyVSProperty />
		// 		</div>
		// 	</div>
		// 	<p className='text-xl font-semibold'>Reviews under your company.</p>
		// 	<div className='flex-1 border p-8'>
		// 		<Reviews />
		// 	</div>
		// </div>
		<div className='px-32 md:px-24 sm:px-20 xs:px-10 h-full p-5 bg-background dark:bg-secondary flex flex-col min-h-screen'>
			<CustomBreadcrumbs />
			<div className='mt-1 mb-4'>
				<h1 className='font-semibold xs:text-xl sm:text-2xl md:text-3xl text-left dark:text-white'>
					Reservation Analytics
				</h1>
			</div>
			<ReservationsAnalytics />

			<div className='mt-8 mb-4'>
				<h1 className='font-semibold xs:text-xl sm:text-2xl md:text-3xl text-left dark:text-white'>
					Review Analytics
				</h1>
			</div>
			<ReviewsAnalytics />
		</div>
	);
}

export default Page;
