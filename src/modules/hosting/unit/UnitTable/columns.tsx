"use client";

import React from "react";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { useMediaQuery } from "@/hooks/use-media-query";

import { UnitViewModeContext } from "@/modules/hosting/unit/UnitViewModeProvider";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import Image from "next/image";
import { removeUnitById } from "@/actions/unit/removeUnitById";

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "Unit",
        accessorFn: (row) => `${row.unit_title} - ${row.unit_thumbnail_url}`,
        header: "Unit",
        cell: ({ row }) => {
            // const src = row.getValue<string>("unit_thumbnail_url");
            const unit_title = row.original.unit_title;
            const unit_thumbnail_url = row.original.unit_thumbnail_url;

            return (
                <div className="flex flex-row items-center">
                    <div className="flex relative">
                        {unit_thumbnail_url ? (
                            <Image
                            src={unit_thumbnail_url}
                            alt="property image"
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
                    <span className="ml-7">{unit_title}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "unit_privacy_type",
        header: "Type",
    },
    {
        accessorKey: "unit_isreserved",
        header: "Status",
    },
    {
        accessorKey: "company_name",
        header: "Company",
    },
    {
        accessorKey: "unit_id",
        header: () => {
            return <span className="sr-only">Action</span>;
        },
        cell: ({ row }) => {
            const unit_id = row.getValue<string>("unit_id");
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem>
                            <Link href={`/property/room/${unit_id}`}>View</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem asChild></DropdownMenuItem>
                        <DeleteUnitAlert
                            trigger={
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-auto relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                >
                                    Delete
                                </Button>
                            }
                            unitId={unit_id}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
    // {
    //     accessorKey: "id",
    //     header: ({ column }) => {
    //         return <span className="sr-only">Actions</span>;
    //     },
    //     cell: ({ row }) => {
    //         const propertyId = row.getValue<string>("id");
    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button variant="ghost" className="h-8 w-8 p-0">
    //                         <span className="sr-only">Open menu</span>
    //                         <MoreHorizontal className="h-4 w-4" />
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //                     <DropdownMenuSeparator />

    //                     <DropdownMenuItem asChild>
    //                         <Link href={`/hosting/property/edit-property/${propertyId}`}>Edit</Link>
    //                     </DropdownMenuItem>
    //                     <DropdownMenuItem asChild>
    //                         <DeletePropertyAlert trigger={<Button variant="ghost" className="w-full justify-start h-auto relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50" >Delete</Button>} propertyId={propertyId} />
    //                     </DropdownMenuItem>
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         );
    //     },
    // },
];

function DeleteUnitAlert({ unitId, trigger }: { propertyId: string; trigger: React.ReactNode }) {
    const [open, setOpen] = React.useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the unit and remove its data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="inline-flex items-center justify-end gap-2">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                            toast.promise(removeUnitById(unitId), {
                                loading: "Deleting unit...",
                                success: () => {
                                    setOpen(false);
                                    return toast.success("Unit deleted successfully!");
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
