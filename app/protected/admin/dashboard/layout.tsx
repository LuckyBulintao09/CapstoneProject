import AdminNavbar from "@/components/admin/AdminNavbar";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      {/* Make AdminNavbar fixed to the top */}
      <AdminNavbar />
      <div> 
        {children}
      </div>
    </section>
  );
}

export default AdminLayout;
