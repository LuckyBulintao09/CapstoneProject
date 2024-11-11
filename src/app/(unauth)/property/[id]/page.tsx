// src/app/client/property/[id]/inbox.tsx

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
        <div>
            <SpecificListing id={id} />
        </div>
    );
}
