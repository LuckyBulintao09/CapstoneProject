import Link from 'next/link';
import React from 'react'

function SecurityDetails({params}: {params: {propertyId: string}}) {
  return (
      <div>
          <h1>{params.propertyId}</h1>
          <Link
              href={`/hosting/host-a-property/${params.propertyId}/name-your-property`}
          >
              next
          </Link>
          <Link
              href={`/hosting/host-a-property/${params.propertyId}/`}
          >
              back
          </Link>
      </div>
  );
}

export default SecurityDetails