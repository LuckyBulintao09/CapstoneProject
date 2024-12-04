"use client";

import React from "react";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { useMediaQuery } from "@/hooks/use-media-query";

import { PropertyViewModeContext } from "@/modules/hosting/property/PropertyViewModeProvider";

import { ChevronRight, MoreHorizontal } from "lucide-react";

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

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "property",
        accessorFn: (row) => `${row.title}`,
        header: "Property",
        cell: ({ row }) => {
            const property_name = row.original.title;
            const thumbnail = row.original.property_image;
            const address = row.getValue<string>("address");
            const propertyId = row.getValue<string>("id");

            const { viewMode } = React.useContext(PropertyViewModeContext);

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
                                />
                            ) : (
                                <Image
                                    src={`/placeholderImage.webp`}
                                    alt="property image"
                                    width={64}
                                    height={64}
                                    className="rounded-xl h-[64px] w-[64px] min-h-[64px] min-w-[64px] object-cover overflow-clip"
                                />
                            )}
                        </div>
                        <span className="ml-7">{property_name}</span>
                    </div>
                );
            }
            return (
                <div className="flex flex-col">
                    <div className="relative">
                        {thumbnail && thumbnail[0] ? (
                            <Image
                                src={thumbnail[0]}
                                alt={`${property_name} thumbnail image`}
                                width={1524}
                                height={2032}
                                className="rounded-xl object-cover overflow-clip aspect-[20/19] mb-3 select-none"
                            />
                        ) : (
                            <Image
                                src={`/placeholderImage.webp`}
                                alt={`property image`}
                                width={1524}
                                height={2032}
                                className="rounded-xl object-cover overflow-clip aspect-[20/19] mb-3 select-none"
                            />
                        )}
                        <div className="absolute top-0 right-0 mt-3 mr-3">
                            <Link
                                href={`/hosting/properties/${propertyId}/details/photos`}
                                className={cn(
                                    buttonVariants({ variant: "default", size: "sm" }),
                                    "flex items-center justify-center gap-2 rounded-full text-primary-foreground"
                                )}
                            >
                                Go to property
                                <ChevronRight className="size-4" />
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col text-left ">
                        <span className="text-clip break-all">{property_name}</span>
                        <span className="text-muted-foreground text-nowrap text-ellipsis overflow-hidden">{address}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "address",
        header: "Address",
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
        accessorKey: "isApproved",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue<string>("isApproved");

            const { viewMode } = React.useContext(PropertyViewModeContext);

            if (viewMode === "table") {
                return (
                    <div className="flex shrink-0 items-center">
						<div className={cn("mr-2 h-3 w-3 rounded-full", status ? "bg-success" : "bg-destructive")}></div>
                        <p className="whitespace-nowrap">{status ? "Approved" : "Action required"}</p>
                    </div>
                );
            }
            return null;
        },
    },
    // {
    //     accessorKey: "",
    //     header: "Units",
    //     cell: ({ row }) => {
    //         return (
    //             <span>{"5"}</span>
    //         )
    //     }
    // },
    {
        accessorKey: "id",
        header: () => {
            return <span className="sr-only">Actions</span>;
        },
        cell: ({ row }) => {
            const propertyId = row.getValue<string>("id");
            const { viewMode } = React.useContext(PropertyViewModeContext);
            const unitId = "123";

            if (viewMode === "grid") {
                return <span className="sr-only">Actions</span>;
            }

            return (
                // <DropdownMenu>
                //     <DropdownMenuTrigger asChild>
                //         <Button variant="ghost" className="h-8 w-8 p-0">
                //             <span className="sr-only">Open menu</span>
                //             <MoreHorizontal className="h-4 w-4" />
                //         </Button>
                //     </DropdownMenuTrigger>
                //     <DropdownMenuContent align="end">
                //         <DropdownMenuLabel>Actions</DropdownMenuLabel>
                //         <DropdownMenuSeparator />

                //         <DropdownMenuItem asChild>
                //             <Link href={`/hosting/property/edit-property/${propertyId}`}>Edit</Link>
                //         </DropdownMenuItem>
                //         <DropdownMenuItem asChild>
                //             <DeletePropertyAlert trigger={<Button variant="ghost" className="w-full justify-start h-auto relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50" >Delete</Button>} propertyId={propertyId} />
                //         </DropdownMenuItem>
                //     </DropdownMenuContent>
                // </DropdownMenu>
                <Link
                    href={`/hosting/properties/${propertyId}/details/photos`}
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "flex items-center justify-center gap-2 px-5 rounded-lg")}
                >
                    Go to property
                    <ChevronRight className="size-4" />
                </Link>
            );
        },
    },
];

function DeletePropertyAlert({ propertyId, trigger }: { propertyId: string; trigger: React.ReactNode }) {
    const [open, setOpen] = React.useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your property and remove the data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="inline-flex items-center justify-end gap-2">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                            toast.promise(removePropertyById(propertyId), {
                                loading: "Deleting property...",
                                success: () => {
                                    setOpen(false);
                                    return toast.success("Property deleted successfully!");
                                },
                                error: (error) => {
                                    setOpen(false);
                                    return showErrorToast(error);
                                },
                            });
                            setOpen(false);
                        }}
                    >
                        Yes, I'm sure
                    </Button>
                    <DialogClose asChild>
                        <Button variant="outline" size="sm">
                            No, nevermind
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
