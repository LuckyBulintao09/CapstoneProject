import React from "react";

type PropertyContextType = {
    property: any;
    units: any[];
};

const PropertyContext = React.createContext<PropertyContextType | undefined>(undefined);

function PropertyProvider({
    property,
    units,
    children,
}: {
    property: any; // Replace with the correct type
    units: any[]; // Replace with the correct type
    children: React.ReactNode;
}) {
    return <PropertyContext.Provider value={{ property, units }}>{children}</PropertyContext.Provider>;
}

export const useProperty = () => {
    const context = React.useContext(PropertyContext);
    if (!context) {
        throw new Error("useProperty must be used within a PropertyProvider");
    }
    return context;
};

export default PropertyProvider;
