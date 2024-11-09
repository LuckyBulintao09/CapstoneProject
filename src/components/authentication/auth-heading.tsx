import React from "react";

function AuthHeading({ title, subtitle }: { title: string; subtitle: string | React.ReactNode }) {
    return (
        <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <span className="text-sm text-muted-foreground inline-flex items-center justify-center">
                {subtitle}
            </span>
        </div>
    );
}

export default AuthHeading;
