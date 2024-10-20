import ResponsiveLayout from '@/components/ResponsiveLayout';
import PropertyTypeForm from '@/modules/hosting/add-listing/PropertyTypeForm';

function PropertyType({params}: {params: {propertyId: string}}) {
  return (
      <div>
          <ResponsiveLayout className="h-screen flex items-center justify-center border relative">
            <PropertyTypeForm propertyId={params.propertyId}/>
        </ResponsiveLayout>
      </div>
  );
}

export default PropertyType