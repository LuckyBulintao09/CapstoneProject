"use client"
import { AdminDashboardScreen } from "@/modules/admin-dashboard/screen/AdminDashboardScreen";
import { logout } from "@/app/auth/login/actions";
import { Button } from "@/components/ui/button";
const AdminDashboard = () => {
  return (
    <>
    <div>
				<Button 
					onClick={async () => {
						await logout();
						window.location.href = '/' 
					}}
				>
					Logout, redesign mo nalang pre nilagay ko lang HAHAHA -lucky
				</Button>
       {/* YUNG gussiongossen09@gmail.com gamitin mo na account sa admin */}
       {/* test1234 password niya */}
			</div>
      <section
        className="h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/2.png')" }}
      >
        <AdminDashboardScreen />
      </section>
     
    </>
  );
};

export default AdminDashboard;
