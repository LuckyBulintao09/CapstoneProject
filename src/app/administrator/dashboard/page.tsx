import { AdminDashboardScreen } from "@/modules/admin-dashboard/screen/AdminDashboardScreen";
const AdminDashboard = () => {
  return (
    <>
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
