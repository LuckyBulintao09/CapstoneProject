"use server"

import { getAllAmenities } from "@/actions/amenety/getAllAmenities";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import PropertyAmenityForm from "@/modules/hosting/add-listing/PropertyAmenityForm";

export type Amenities = {
    id: string;
    amenity_name: string;
}[]
async function Amenities({ params }: { params: { propertyId: string } }) {
    const amenities: Amenities = await getAllAmenities();
    return (
        <ResponsiveLayout className="h-screen flex items-center justify-center border relative">
            <PropertyAmenityForm propertyId={params.propertyId} amenities={amenities}/>
        </ResponsiveLayout>
    );
}

export default Amenities;
