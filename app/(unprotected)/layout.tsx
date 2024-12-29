import Footer from "@/components/navbar/Footer";
import NavBar from "@/components/navbar/Navbar";

function UnprotectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default UnprotectedLayout;
