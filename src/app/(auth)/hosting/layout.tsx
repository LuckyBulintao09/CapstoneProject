import NavBar from "@/components/navbar/Navbar";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import Footer from "@/modules/home/components/Footer";
import { Toaster } from "sonner";

function LessorLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <NavBar />
            <ResponsiveLayout>{children}</ResponsiveLayout>
            <Footer />
            <Toaster position="top-center" />
        </div>
    );
}

export default LessorLayout;
