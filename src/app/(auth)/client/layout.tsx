import React from 'react'
import NavBar from '@/components/navbar/Navbar';
import Footer from "@/modules/home/components/Footer";

function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
                <div>{children}</div>
        </div>
    );
}

export default ClientLayout
