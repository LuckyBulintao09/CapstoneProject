import AddUnitFinalForm from '@/modules/hosting/unit/AddUnitFinalForm'
import React from 'react'

function FinalizeYourUnitPage({ params }: { params: { unitId: string } }) {
  return (
    <div className="container mx-auto py-7 w-full flex items-center justify-center h-[calc(100vh-5rem-5px)]">
          <AddUnitFinalForm unitId={params.unitId} />
      </div>
  )
}

export default FinalizeYourUnitPage