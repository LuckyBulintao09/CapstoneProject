"use client"

import React from "react";

import { CreatePropertyType } from "@/lib/schemas/createPropertySchema";

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
    // price: 0,
};

const PropertyAddFormContext = React.createContext<PropertyAddFormProviderProps | undefined>(undefined);

export const usePropertyAddFormContext = () => {
    const context = React.useContext(PropertyAddFormContext);
    if (!context) { 
        throw new Error('usePropertyAddFormContext must be used within a PropertyAddFormProvider');
    }
    return context;
}

export const PropertyAddFormProvider = ({ children, formData, setFormData }: PropertyAddFormProviderProps & ChildrenProps) => {
    const [propertyFormData, setPropertyFormData] = React.useState<CreatePropertyType>(formData);
    return (
        <PropertyAddFormContext.Provider value={{ formData: propertyFormData, setFormData: setPropertyFormData }}>
            {children}
        </PropertyAddFormContext.Provider>
    );
};