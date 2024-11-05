"use client";

import React, { useEffect, useState } from "react";
import { CreateUnitType } from "@/lib/schemas/propertySchema";

interface UnitAddFormProviderProps {
    formData: CreateUnitType;
    setFormData?: (data: CreateUnitType | ((prevData: CreateUnitType) => CreateUnitType)) => void;
}

interface ChildrenProps {
    children: React.ReactNode;
}

export const defaultUnitAddFormData: CreateUnitType = {
    property_id: "",
    unit_structure: "dormitory",
    unit_type: "room",
    unit_occupants: 1,
    unit_bedrooms: 1,
    unit_beds: 1,
    amenities: [],
    additional_amenities: [],
    unit_title: "",
    unit_description: "",
};

const UnitAddFormContext = React.createContext<UnitAddFormProviderProps & { progress: number } | undefined>(undefined);

export const useUnitAddFormContext = () => {
    const context = React.useContext(UnitAddFormContext);
    if (!context) { 
        throw new Error('useUnitAddFormContext must be used within a UnitAddFormProvider');
    }
    return context;
}

export const UnitAddFormProvider = ({ children, formData, setFormData }: UnitAddFormProviderProps & ChildrenProps) => {
    const [unitFormData, setUnitFormData] = useState<CreateUnitType>(formData);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const calculateProgress = () => {
            const totalFields = Object.keys(defaultUnitAddFormData).length;
            const filledFields = Object.keys(unitFormData).filter(key => {
                const value = unitFormData[key as keyof CreateUnitType];
                return Array.isArray(value) ? value.length > 0 : value !== "";
            }).length;
            setProgress((filledFields / totalFields) * 100);
        };

        calculateProgress();
    }, [unitFormData]);

    return (
        <UnitAddFormContext.Provider value={{ formData: unitFormData, setFormData: setUnitFormData, progress }}>
            {children}
        </UnitAddFormContext.Provider>
    );
};
