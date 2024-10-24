import NavBar from '@/components/navbar/Navbar';
import Footer from '@/modules/home/components/Footer';
export default function authLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <section>
        <NavBar />
        {children}
        <Footer />
      </section>
    )
  }