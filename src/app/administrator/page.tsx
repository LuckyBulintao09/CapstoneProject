import NavBar from '@/components/navbar/Navbar';
import { AdminDashboardScreen } from '@/modules/admin-dashboard/screen/AdminDashboardScreen';
import HomeScreen from '@/modules/home/screens/HomeScreen';
import { Footer } from '@/modules/lessor-dashboard/components/Footer';

export default async function admin() {
	return (
		<div className='h-screen overflow-auto'>
			<div className='sticky top-0 z-50'>
				<NavBar />
			</div>
			<div className='mt-16 sm:mt-16 md:mt-12 lg:mt-0 '>
				<AdminDashboardScreen/>
			</div>
			<Footer />
		</div>
	);
}
