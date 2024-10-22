
import NavBar from '@/components/navbar/Navbar';
import Footer from "@/modules/home/components/Footer";
import { Toaster } from 'sonner';

function LessorLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <NavBar />
            <div>{children}</div>
            <Footer />
            <Toaster />
        </div>
    );
}

export default LessorLayout;
