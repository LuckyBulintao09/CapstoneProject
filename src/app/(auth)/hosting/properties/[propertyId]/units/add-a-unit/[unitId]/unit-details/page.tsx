import CustomBreadcrumbs from "@/modules/hosting/components/CustomBreadcrumbs";
import AddUnitsForm from "./_components/AddUnitsForm";
import { getAllAmenities } from "@/actions/amenety/getAllAmenities";

async function UnitDetailsPage({params}: {params: {propertyId: string, unitId: string}}) {
    const amenities = await getAllAmenities();
    return (
        <div className="bg-background h-full py-11 ">
            <div className="w-full flex flex-col items-start justify-center max-w-6xl mx-auto">
                <CustomBreadcrumbs />
                <div className="mb-8 max-w-[623px]">
                    <h1 className="text-[2rem] leading-9 font-normal break-words">Create units</h1>
                </div>
            </div>
            <AddUnitsForm amenities={amenities} unitId={params.unitId} propertyId={params.propertyId} />
        </div>
    );
}

export default UnitDetailsPage;
