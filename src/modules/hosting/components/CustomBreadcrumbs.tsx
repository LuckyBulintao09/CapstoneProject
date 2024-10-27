"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";

import { usePathname } from "next/navigation";
import React from "react";

function CustomBreadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);
    return (
        <Breadcrumb>
            <BreadcrumbList className="py-5 px-3 border-b">
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
            {breadCrumbs.map(
                (crumb: { label: string; href: string }, index: number): React.ReactElement => (
                    <React.Fragment key={index}>
                        {index > 0 && <BreadcrumbSeparator />}
                        {index === breadCrumbs.length - 1 ? (
                            <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={crumb.href}>{crumb.label}</Link>
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
