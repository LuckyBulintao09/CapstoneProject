import NavBar from '@/components/navbar/Navbar';
import Footer from '@/modules/home/components/Footer';
import TransactionHistoryScreen from '@/modules/transaction-history/screens/TransactionHistoryScreen';

export default async function transaction_history() {
	return (
		<div className='h-screen overflow-auto'>
			<div className='sticky top-0 z-50'>
				<NavBar />
			</div>
			<div className='mt-16 sm:mt-16 md:mt-12 lg:mt-0 '>
				<TransactionHistoryScreen />
			</div>
			<Footer />
		</div>
	);
}
