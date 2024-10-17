import Link from "next/link";
import React from "react";

function HostAProperty({ params }: { params: { propertyId: string } }) {
    return (
        <div>
            <h1>{params.propertyId}</h1>
            <Link href={`/hosting/host-a-property/${params.propertyId}/company`}>next</Link>
        </div>
    );
}
// company, 

export default HostAProperty;
