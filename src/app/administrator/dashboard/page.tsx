'use client';
import { AdminDashboardScreen } from '@/modules/admin-dashboard/screen/AdminDashboardScreen';
import AdminNavbar from '@/components/navbar/AdminNavbar';
import AdminTopNav from '@/components/navbar/AdminTopNav';

const AdminDashboard = () => {
	return (
		<>
			<div>
				{/* <AdminNavbar /> */}
        <AdminTopNav />
			</div>

			<AdminDashboardScreen />
		</>
	);
};

export default AdminDashboard;
