import AddUnitDetailsForm from '@/modules/hosting/unit/AddUnitDetailsForm'
import React from 'react'

function UnitDetailsPage({ params }: { params: { unitId: string } }) { 
  return (
      <div className="container mx-auto py-7 w-full flex items-center justify-center h-[calc(100vh-5rem-5px)]">
          <AddUnitDetailsForm unitId={params.unitId} />
      </div>
  );
}

export default UnitDetailsPage