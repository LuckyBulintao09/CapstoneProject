"use client";
import { AdminDashboardScreen } from "@/modules/admin-dashboard/screen/AdminDashboardScreen";
import AdminNavbar from "@/components/navbar/AdminNavbar";

const AdminDashboard = () => {
  return (
    <>
      <div>
        <AdminNavbar />
      </div>
      <section className="h-screen bg-cover bg-center relative overflow-hidden">
        <div className="absolute inset-0 flex flex-col justify-between">
          <div className="h-1/3 bg-gradient-to-b from-[#040e27]/60 to-[#040e27]/10"></div>

          <div className="h-1/3 bg-gradient-to-t from-[#040e27]/60 o-[#040e27]/10"></div>
        </div>

        <div className="relative z-10">
          <AdminDashboardScreen />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
