import NavBar from '@/components/navbar/Navbar';
import Footer  from "@/modules/home/components/Footer";
import { MessagesScreen } from '@/modules/messages/screens/MessagesScreen';
export const metadata = {
	title: 'Inbox | Unihomes',
	description: 'Web Platform',
  }
export default async function inbox() {
	return (
		<div className='h-screen overflow-auto'>
			<div className='sticky top-0 z-50'>
				<NavBar/>
			</div>
			<div className='mt-16 sm:mt-16 md:mt-12 lg:mt-0 '>
				<MessagesScreen />
			</div>
			<Footer />
		</div>
	);
}
