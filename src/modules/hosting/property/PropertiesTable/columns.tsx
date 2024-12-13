"use client";

import React from "react";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { useMediaQuery } from "@/hooks/use-media-query";

import { PropertyViewModeContext } from "@/modules/hosting/property/PropertyViewModeProvider";

import { ChevronRight, Eye, MoreHorizontal } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { showErrorToast } from "@/lib/handle-error";

import Link from "next/link";

import { removePropertyById } from "@/actions/property/remove-property-by-id";
import { getAllUnitUnderProperty } from "@/actions/unit/getAllUnitUnderProperty";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "./data-table-column-header";
import { parseISO, isWithinInterval, format } from "date-fns";

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "property",
        accessorFn: (row) => `${row.title}`,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Property" />,
        cell: ({ row }) => {
            const property_name = row.original.title;
            const thumbnail = row.original.property_image;
            const address = row.getValue<string>("address");
            const propertyId = row.getValue<string>("id");
            const status = row.getValue<string>("isApproved");

            const { viewMode } = React.useContext(PropertyViewModeContext);

            const status_classnames = {
                rejected: "bg-destructive",
                missing: "bg-orange-500",
                approved: "bg-success",
                pending: "bg-warning",
            };

            if (viewMode === "table") {
                return (
                    <div className="flex flex-row items-center">
                        <div className="flex relative">
                            {thumbnail && thumbnail[0] ? (
                                <Image
                                    src={thumbnail[0]}
                                    alt={`${property_name} thumbnail image`}
                                    width={64}
                                    height={64}
                                    className="rounded-xl h-[64px] w-[64px] min-h-[64px] min-w-[64px] object-cover overflow-clip"
                                    loading="lazy"
                                />
                            ) : (
                                <Image
                                    src={`/placeholderImage.webp`}
                                    alt="property image"
                                    width={64}
                                    height={64}
                                    className="rounded-xl h-[64px] w-[64px] min-h-[64px] min-w-[64px] object-cover overflow-clip"
                                    loading="lazy"
                                />
                            )}
                            <div className={cn("absolute top-0 left-0 z-[3] h-3 w-3 mt-1 ml-1 rounded-full airBnbTablet:hidden", status_classnames[status])}></div>
                        </div>
                        <span className="ml-7">{property_name}</span>
                    </div>
                );
            }
            return (
                <div className="flex flex-col relative">
                    <Link
                        href={`/hosting/properties/${propertyId}/details/photos`}
                        className={cn(
                            "left-0 right-0 p-0 m-0 absolute bg-transparent top-0 bottom-0 z-[2] outline-none"
                        )}
                    ></Link>
                    <div className="relative">
                        {thumbnail && thumbnail[0] ? (
                            <Image
                                src={thumbnail[0]}
                                alt={`${property_name} thumbnail image`}
                                width={1524}
                                height={2032}
                                className="rounded-xl object-cover overflow-clip aspect-[20/19] mb-3 select-none"
                                loading="lazy"
                            />
                        ) : (
                            <Image
                                src={`/placeholderImage.webp`}
                                alt={`property image`}
                                width={1524} 
                                height={2032}
                                className="rounded-xl object-cover overflow-clip aspect-[20/19] mb-3 select-none"
                                loading="lazy"
                            />
                        )}
                        <div className="absolute top-0 left-0 mt-4 ml-4">
                            <Badge
                                className="flex flex-row items-center gap-2 w-max text-sm font-light shadow-md"
                                variant="secondary"
                            >
                                <div className={cn("h-2 w-2 rounded-full", status_classnames[status])}></div>
                                <span className="font-medium text-[0.875rem] leading-normal tracking-wide grow-0 w-fit">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                            </Badge>
                        </div>
                    </div>
                    <div className="flex flex-col text-left ">
                        <span className="text-clip break-all">{property_name}</span>
                        <span className="text-muted-foreground text-nowrap text-ellipsis overflow-hidden">
                            {address}
                        </span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "address",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Address" />,
        cell: ({ row }) => {
            const address = row.getValue<string>("address");

            const { viewMode } = React.useContext(PropertyViewModeContext);

            if (viewMode === "table") {
                return <span>{address}</span>;
            }
            return null;
        },
    },
    {
        accessorKey: "due_date",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Valid until" />,
        cell: ({ row }) => {
            const due_date = row.getValue<string>("due_date");

            const { viewMode } = React.useContext(PropertyViewModeContext);

            if (viewMode === "table") {
                return <span>{due_date ? format(new Date(due_date), 'MMM, dd, yyyy') : 'N/A'}</span>;
            }
            return null;
        },
        filterFn: (row, id, value) => {
            const { from, to } = value;
            const theDate = parseISO(row.getValue(id));

            if ((from || to) && !theDate) {
                return false;
            } else if (from && !to) {
                return theDate.getTime() >= from.getTime();
            } else if (!from && to) {
                return theDate.getTime() <= to.getTime();
            } else if (from && to) {
                return isWithinInterval(theDate, { start: from, end: to });
            } else {
                return true;
            }
        },
    },
    {
        accessorKey: "isApproved",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.getValue<string>("isApproved");

            const { viewMode } = React.useContext(PropertyViewModeContext);

            const status_classnames = {
                rejected: "bg-destructive",
                missing: "bg-orange-500",
                approved: "bg-success",
                pending: "bg-warning",
            };

            if (viewMode === "table") {
                return (
                    <Badge
                        className="flex flex-row shrink-0 items-center px-3 py-1 gap-2 w-max text-sm font-light shadow-md"
                        variant="outline"
                    >
                        <div className={cn("h-3 w-3 rounded-full", status_classnames[status])}></div>
                        <p className="whitespace-nowrap">{status.charAt(0).toUpperCase() + status.slice(1)}</p>
                    </Badge>
                );
            }
            return null;
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "id",
        header: () => {
            return <span className="sr-only">Actions</span>;
        },
        cell: ({ row }) => {
            const propertyId = row.getValue<string>("id");
            const { viewMode } = React.useContext(PropertyViewModeContext);

            if (viewMode === "grid") {
                return <span className="sr-only">Actions</span>;
            }

            return (
                <>
                    <Link
                        href={`/hosting/properties/${propertyId}/details/photos`}
                        className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "rounded-full airBnbDesktop:px-11 airBnbMobile:px-3 inline-flex items-center gap-2"
                        )}
                    >
                        <span>Go to property</span> <ChevronRight className="size-4" />
                    </Link>
                </>
            );
        },
    },
];