import React from 'react'

import { AddPropertyProvider } from "@/components/AddPropertyProvider";

function AddUnitLayout({children}: {children: React.ReactNode}) {
  return (
    <AddPropertyProvider>{children}</AddPropertyProvider>
  )
}

export default AddUnitLayout