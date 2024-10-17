import Link from 'next/link';
import React from 'react'

function PropertyDetailsForm({params}: {params: {propertyId: string}}) {
  return (
      <div>
          <h1>{params.propertyId}</h1>
          <Link
              href={`/hosting/host-a-property/${params.propertyId}/name-your-property`}
          >
              next
          </Link>
      </div>
  );
}

export default PropertyDetailsForm