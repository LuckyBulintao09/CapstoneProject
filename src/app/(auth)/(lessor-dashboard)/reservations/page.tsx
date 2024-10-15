import Link from "next/link";

import { ContentLayout } from "@/modules/lessor-dashboard/components/ContentLayout"
import PageContent from "@/modules/lessor-dashboard/components/PageContent";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { columns, Reservation } from "./columns";
import { reservations } from "@/lib/constants/reservations";
import { DataTable } from "./data-table";

function getData(): Reservation[] {
    return reservations;
}

const Dashboard = () => {

    const data = getData()

    return (
        <ContentLayout title="Reservations">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Reservations</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* content here */}
            <PageContent>
                <div className="col-span-full">
                    <DataTable columns={columns} data={data} />
                </div>
            </PageContent>
        </ContentLayout>
    );
}

export default Dashboard