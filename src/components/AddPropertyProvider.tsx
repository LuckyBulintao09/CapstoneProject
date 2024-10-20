'use client';

import { defaultPropertyAddFormData, PropertyAddFormProvider } from "@/modules/hosting/add-listing/PropertyAddFormProvider";

export function AddPropertyProvider({ children, ...props}: {children: React.ReactNode}) {
	return <PropertyAddFormProvider {...props} formData={defaultPropertyAddFormData}>{children}</PropertyAddFormProvider>;
}
