import React from 'react';
import NavBar from '@/components/navbar/Navbar';
import Footer from '@/modules/home/components/Footer';
import NavigationBar from '@/components/navbar/topNav';

function ClientLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<NavigationBar />
			<div>{children}</div>
			<Footer />
		</div>
	);
}

export default ClientLayout;
