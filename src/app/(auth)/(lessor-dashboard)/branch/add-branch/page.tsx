import AddBranchForm from '@/modules/add-branch-form/add-branch-form'
import React from 'react'

const AddBranch = () => {
  return (
    <div className='col-span-full'>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Add Branch</h4>
        <AddBranchForm />
    </div>
  )
}

export default AddBranch