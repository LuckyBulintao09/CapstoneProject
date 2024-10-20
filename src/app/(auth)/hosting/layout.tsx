import React from "react";

import { AddPropertyProvider } from "@/components/AddPropertyProvider";

function LessorLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <AddPropertyProvider>{children}</AddPropertyProvider>
        </div>
    );
}

export default LessorLayout;
