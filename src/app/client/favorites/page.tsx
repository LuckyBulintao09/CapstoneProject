import NavBar from '@/components/navbar/Navbar';
import FavoritesScreen from '@/modules/favorites/screens/FavoritesScreen';
import Footer  from "@/modules/home/components/Footer";
export const metadata = {
	title: 'Favorites | Unihomes',
	description: 'Web Platform',
  }
export default async function favorites() {
	return (
		<div className='h-screen overflow-auto'>
			<div className='sticky top-0 z-50'>
				<NavBar />
			</div>
			<div className='mt-16 sm:mt-16 md:mt-12 lg:mt-0 '>
				<FavoritesScreen />
			</div>
			<Footer />
		</div>
	);
}
