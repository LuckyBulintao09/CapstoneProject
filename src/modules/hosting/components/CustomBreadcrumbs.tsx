"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { usePathname } from "next/navigation";
import React from "react";

function CustomBreadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);
    return (
        <Breadcrumb>
            <BreadcrumbList className="text-sm font-[500]">
                <GenerateBreadcrumbs segments={segments} />
            </BreadcrumbList>
        </Breadcrumb>
    );
}

function GenerateBreadcrumbs({segments}: {segments: string[]}) {

    const breadCrumbs = segments.map((segment, index) => ({
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        href: `/${segments.slice(0, index + 1).join('/')}`,
    }));
    
    return (
        <>
            {breadCrumbs.length > 1 && breadCrumbs.map(
                (crumb: { label: string; href: string }, index: number): React.ReactElement => (
                    <React.Fragment key={index}>
                        {index > 0 && <BreadcrumbSeparator />}
                        {index === breadCrumbs.length - 1 ? (
                            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={crumb.href} className={cn(buttonVariants({ variant: "link" }), "px-0 py-0")}>{crumb.label}</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        )}
                    </React.Fragment>
                )
            )}
        </>
    );
}

export default CustomBreadcrumbs;
