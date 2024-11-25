import NavBar from '@/components/navbar/Navbar';
import NavigationBar from '@/components/navbar/topNav';
import Footer from '@/modules/home/components/Footer';

function RecoverAccountLayout({ children }: { children: React.ReactNode }) {
	return (
		<section>
			<NavigationBar />
			<div>{children}</div>
			<Footer />
		</section>
	);
}
export default RecoverAccountLayout;
