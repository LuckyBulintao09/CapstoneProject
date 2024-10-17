import Link from 'next/link'
import React from 'react'

function PropertyName({params}: {params: {propertyId: string}}) {
  return (
    <div>
      <h1>{params.propertyId}</h1>
          <Link
              href={`/hosting/host-a-property/${params.propertyId}/additional-description`}
          >
              next
          </Link>
    </div>
  )
}

export default PropertyName