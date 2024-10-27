"use client";

import * as React from "react";

import Link from "next/link";

import { ChevronsUpDown, MoreHorizontal, Plus, SquarePen } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function TeamSwitcher({
    companies,
}: {
    companies: {
        id: number;
        address: string;
        company_name: string;
        logo: React.ElementType;
        has_business_permit: "approved" | "pending" | "missing";
    }[];
}) {
    const { isMobile } = useSidebar();
    const [activeCompany, setActiveCompany] = React.useState(companies[0]);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                {/* <activeCompany.logo className="size-4" /> */}
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{activeCompany?.company_name}</span>
                                {activeCompany?.has_business_permit === "approved" ? (
                                    <span className="truncate text-xs inline-flex gap-1 items-center text-primary">
                                        <div className="bg-primary rounded-full w-2 h-2" />
                                        Verified
                                    </span>
                                ) : activeCompany?.has_business_permit === "pending" ? (
                                    <span className="truncate text-xs inline-flex gap-1 items-center text-warning">
                                        <div className="bg-warning rounded-full w-2 h-2" />
                                        Verification pending
                                    </span>
                                ) : (
                                    <span className="truncate text-xs inline-flex gap-1 items-center text-danger">
                                        <div className="bg-danger rounded-full w-2 h-2" />
                                        Verification required
                                    </span>
                                )}
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">Companies</DropdownMenuLabel>
                        <ScrollArea className="h-72">
                            {companies?.map((company) => (
                                <DropdownMenuItem
                                    key={company.id}
                                    onClick={() => setActiveCompany(company)}
                                    className={cn("p-2 my-1", activeCompany.company_name === company.company_name && "bg-accent")}
                                >
                                    <div className="flex flex-row justify-between items-center w-full">
                                        <span className=" truncate overflow-hidden">{company.company_name}</span>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link href={`/hosting/company/${company.id}/edit-company`}>
                                                    <Button variant="ghost" size="icon" className="size-5">
                                                        <SquarePen className="size-4" />
                                                    </Button>
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent>Edit company</TooltipContent>
                                        </Tooltip>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </ScrollArea>
                        <DropdownMenuSeparator />

                        <Link href="/hosting/company/add-a-company">
                            <DropdownMenuItem className="gap-2 p-2">
                                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                    <Plus className="size-4" />
                                </div>
                                <div className="font-medium text-muted-foreground">Add a company</div>
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
