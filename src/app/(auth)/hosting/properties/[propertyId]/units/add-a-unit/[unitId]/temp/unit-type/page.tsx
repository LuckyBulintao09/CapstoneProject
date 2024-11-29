import AddUnitTypeForm from '@/modules/hosting/unit/AddUnitTypeForm';
import React from 'react'

function UnitTypePage({ params }: { params: { unitId: string } }) { 
  return (
      <div className="container mx-auto py-7 w-full flex items-center justify-center h-[calc(100vh-5rem-5px)]">
          <AddUnitTypeForm unitId={params.unitId} />
      </div>
  );
}

export default UnitTypePage