import NavBar from '@/components/navbar/Navbar';
import Footer from '@/modules/home/components/Footer';
import ListingsScreen from '@/modules/listing/screens/ListingsScreen';

export const metadata = {
	title: 'Listings | Unihomes',
	description: 'Web Platform',
};
export default async function searchListing() {
	return (
		<div className='h-screen overflow-auto'>
			<div className='sticky top-0 z-50'>
				<NavBar />
			</div>
			<div className='mt-16 sm:mt-16 md:mt-12 lg:mt-0'>
				<ListingsScreen />
			</div>
			<Footer />
		</div>
	);
}
