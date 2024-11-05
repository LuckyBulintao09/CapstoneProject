"use client";

import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

type ViewModeContextType = {
    viewMode: string | null;
    setViewMode: (viewMode: string) => void;
};

const UnitViewModeContext = React.createContext<ViewModeContextType>({
    viewMode: "table",
    setViewMode: () => {},
});

function UnitViewModeProvider({ children }: { children: React.ReactNode }) {
    const [viewMode, setViewMode] = React.useState<string | null>(null); // Initialize as null
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

    if (isLoading) return <Skeleton className="h-screen w-screen" />; // Render nothing while loading


    return <UnitViewModeContext.Provider value={{ viewMode, setViewMode }}>{children}</UnitViewModeContext.Provider>;
}

export { UnitViewModeProvider, UnitViewModeContext };
