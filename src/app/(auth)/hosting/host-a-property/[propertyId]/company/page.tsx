import Link from 'next/link';
import React from 'react'

function ComanyForm({params}: {params: {propertyId: string}}) {
  return (
      <div>
          <h1>{params.propertyId}</h1>
          <Link href={`/hosting/host-a-property/${params.propertyId}/property-type`}>
              next
          </Link>
      </div>
  );
}

export default ComanyForm