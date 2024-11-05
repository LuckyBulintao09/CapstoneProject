"use client";

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
import React from "react";
import { deleteCompanyById } from "@/actions/company/deleteCompanyById";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function EditCompanyAlert({ companyId }: { companyId: string }) {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" className="w-fit">
                    Delete compnay
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your company and remove its data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="inline-flex items-center justify-end gap-2">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                            toast.promise(deleteCompanyById(companyId), {
                                loading: "Deleting company...",
                                success: () => {
                                    router.push(`/hosting/company`);
                                    return toast.success("Company deleted successfully!");
                                },
                                error: (error) => {
                                    router.push(`/hosting/company`);
                                    return showErrorToast(error);
                                },
                            });
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

export default EditCompanyAlert;
