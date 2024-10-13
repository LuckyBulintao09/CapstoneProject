// src/app/client/property/[id]/inbox.tsx
import NavBar from '@/components/navbar/Navbar';
import Footer from "@/modules/home/components/Footer";
import { SpecificListing } from '@/modules/property/screens/SpecificListing';

interface Props {
    params: { id: number }; 
}
export const metadata = {
    title: 'View Property | Unihomes',
    description: 'Web Platform',
};

export default function Inbox({ params }: Props) {
    const { id } = params; 

    return (
        <div className='h-screen overflow-auto'>
            <div className='sticky top-0 z-50'>
                <NavBar />
            </div>
            <div className='mt-16 sm:mt-16 md:mt-12 lg:mt-0'>
                <SpecificListing id={id} />
            </div>
            <Footer />
        </div>
    );
}
