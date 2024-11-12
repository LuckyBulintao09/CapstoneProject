import { AddUnitProvider } from '@/components/AddPropertyProvider'
import React from 'react'

function AddUnitLayout({children}: {children: React.ReactNode}) {
  return (
    <AddUnitProvider>{children}</AddUnitProvider>
  )
}

export default AddUnitLayout