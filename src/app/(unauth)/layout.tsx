import NavigationBar from '@/components/navbar/topNav';
import Footer from '@/modules/home/components/Footer';
export default function unauthLayout({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<section>
			<NavigationBar />
			{children}
			<Footer />
		</section>
	);
}
