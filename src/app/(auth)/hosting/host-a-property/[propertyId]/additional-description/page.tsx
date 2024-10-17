import Link from 'next/link';
import React from 'react'

function AdditionalDescriptionForm({params}: {params: {propertyId: string}}) {
  return (
      <div>
          <h1>{params.propertyId}</h1>
          <Link
              href={`/hosting/host-a-property/${params.propertyId}/security-details`}
          >
              next
          </Link>
      </div>
  );
}

export default AdditionalDescriptionForm