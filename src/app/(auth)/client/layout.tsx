import React from 'react'
import NavBar from '@/components/navbar/Navbar';
import Footer from "@/modules/home/components/Footer";

function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <NavBar />
                <div>{children}</div>
            <Footer />
        </div>
    );
}

export default ClientLayout
