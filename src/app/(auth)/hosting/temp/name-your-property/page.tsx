import ResponsiveLayout from '@/components/ResponsiveLayout';
import PropertyTitleForm from '@/modules/hosting/add-listing/PropertyTitleForm';
import Link from 'next/link'
import React from 'react'

function PropertyName({params}: {params: {propertyId: string}}) {
  return (
      <div>
          <ResponsiveLayout className="h-screen flex items-center justify-center border relative">
              <PropertyTitleForm propertyId={params.propertyId} />
          </ResponsiveLayout>
      </div>
  );
}

export default PropertyName