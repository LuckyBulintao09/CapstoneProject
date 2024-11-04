"use client";

import React from "react";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { useMediaQuery } from "@/hooks/use-media-query";

import { PropertyViewModeContext } from "@/modules/hosting/property/PropertyViewModeProvider";

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

import { removePropertyById } from "@/actions/property/remove-property-by-id";

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "title",
        header: "Property",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "id",
        header: ({ column }) => {
            return <span className="sr-only">Actions</span>;
        },
        cell: ({ row }) => {
            const propertyId = row.getValue<string>("id");
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

                        <DropdownMenuItem asChild>
                            <Link href={`/hosting/property/edit-property/${propertyId}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <DeletePropertyAlert trigger={<Button variant="ghost" className="w-full justify-start h-auto relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50" >Delete</Button>} propertyId={propertyId} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
