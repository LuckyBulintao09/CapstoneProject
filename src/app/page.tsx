import NavBar from '@/components/navbar/Navbar';
import { Footer } from '@/modules/lessor-dashboard/components/Footer';
import LessorBusinessProfileScreen from '@/modules/property/screens/LessorBusinessProfileScreen';
import { SpecificListing } from '@/modules/property/screens/SpecificListing';

export default async function Home() {
	return (
		<div className='h-screen overflow-auto'>
			<div className='sticky top-0 z-50'>
				<NavBar />
			</div>
			<div className='mt-16 sm:mt-16 md:mt-12 lg:mt-0 '>
				{/* <AdminDashboardScreen /> */}
				<LessorBusinessProfileScreen />
				<SpecificListing />
			</div>
			<Footer />
		</div>
	);
}
