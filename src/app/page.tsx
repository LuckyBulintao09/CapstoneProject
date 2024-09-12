import NavBar from '@/components/navbar/Navbar';
import HomeScreen from '@/modules/home/screens/HomeScreen';

export default function Home() {
	return (
		<div className='bg-white'>
			<NavBar />
			<HomeScreen />
		</div>
	);
}
