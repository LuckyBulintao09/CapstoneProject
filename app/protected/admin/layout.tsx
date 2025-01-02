import AdminNavbar from "@/components/admin/AdminNavbar";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex h-screen">
      {/* Sidebar */}
      <AdminNavbar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </section>
  );
}

export default AdminLayout;
