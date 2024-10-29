import ResponsiveLayout from '@/components/ResponsiveLayout';
import PropertyDetailForm from '@/modules/hosting/add-listing/PropertyDetailForm';
import Link from 'next/link';

function PropertyDetails({params}: {params: {propertyId: string}}) {
  return (
      <ResponsiveLayout className="h-screen flex items-center justify-center border relative">
          <PropertyDetailForm
              propertyId={params.propertyId}
          />
      </ResponsiveLayout>
  );
}

export default PropertyDetails