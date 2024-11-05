'use client';

import { defaultUnitAddFormData, UnitAddFormProvider } from "@/modules/hosting/unit/UnitAddFormProvider";

export function AddUnitProvider({ children, ...props}: {children: React.ReactNode}) {
	return <UnitAddFormProvider {...props} formData={defaultUnitAddFormData}>{children}</UnitAddFormProvider>;
}
