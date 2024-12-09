"use client";

import { Spinner } from "@/components/ui/spinner";
import React from "react";

type ViewModeContextType = {
    viewMode: string | null;
    setViewMode: (viewMode: string) => void;
};

const PropertyViewModeContext = React.createContext<ViewModeContextType>({
    viewMode: "table",
    setViewMode: () => {},
});

function PropertyViewModeProvider({ children }: { children: React.ReactNode }) {
    const [viewMode, setViewMode] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    // Load view mode from localStorage on initial render in the browser
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const savedViewMode = localStorage.getItem("viewMode");
            setViewMode(savedViewMode || "table");
            setIsLoading(false); // Mark loading as complete
        }
    }, []);

    // Save view mode to localStorage whenever it changes
    React.useEffect(() => {
        if (typeof window !== "undefined" && viewMode !== null) { // Only save if viewMode is set
            localStorage.setItem("viewMode", viewMode);
        }
    }, [viewMode]);

    if (isLoading) return (
        <div className="flex items-center justify-center h-[calc(100vh-70px)]">
            <Spinner size="lg" className="w-32 h-32 bg-primary" />
        </div>
    );


    return <PropertyViewModeContext.Provider value={{ viewMode, setViewMode }}>{children}</PropertyViewModeContext.Provider>;
}

export { PropertyViewModeProvider, PropertyViewModeContext };
