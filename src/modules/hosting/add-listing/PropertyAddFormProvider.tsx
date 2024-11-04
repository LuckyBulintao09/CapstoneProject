"use client";

import React, { useEffect, useState } from "react";
import { CreatePropertyType } from "@/lib/schemas/propertySchema";

interface PropertyAddFormProviderProps {
    formData: CreatePropertyType;
    setFormData?: (data: CreatePropertyType | ((prevData: CreatePropertyType) => CreatePropertyType)) => void;
}

interface ChildrenProps {
    children: React.ReactNode;
}

export const defaultPropertyAddFormData: CreatePropertyType = {
    company_id: "",
    structure: "dormitory",
    privacy_type: "room",
    unit_number: "",
    occupants: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: [],
    additional_amenities: [],
    title: "",
    description: "",
};

const PropertyAddFormContext = React.createContext<PropertyAddFormProviderProps & { progress: number } | undefined>(undefined);

export const usePropertyAddFormContext = () => {
    const context = React.useContext(PropertyAddFormContext);
    if (!context) { 
        throw new Error('usePropertyAddFormContext must be used within a PropertyAddFormProvider');
    }
    return context;
}

export const PropertyAddFormProvider = ({ children, formData, setFormData }: PropertyAddFormProviderProps & ChildrenProps) => {
    const [propertyFormData, setPropertyFormData] = useState<CreatePropertyType>(formData);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const calculateProgress = () => {
            const totalFields = Object.keys(defaultPropertyAddFormData).length;
            const filledFields = Object.keys(propertyFormData).filter(key => {
                const value = propertyFormData[key as keyof CreatePropertyType];
                return Array.isArray(value) ? value.length > 0 : value !== "";
            }).length;
            setProgress((filledFields / totalFields) * 100);
        };

        calculateProgress();
    }, [propertyFormData]);

    return (
        <PropertyAddFormContext.Provider value={{ formData: propertyFormData, setFormData: setPropertyFormData, progress }}>
            {children}
        </PropertyAddFormContext.Provider>
    );
};
