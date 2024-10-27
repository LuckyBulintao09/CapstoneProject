"use client";

import React from "react";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";
import { deleteCompanyBusinessPermit } from "@/actions/company/deleteCompanyBusinessPermit";
import { toast } from "sonner";

function BusinessPermitDelete({ companyId, fileUrl }: { companyId: string, fileUrl: string }) {
    const [open, setOpen] = React.useState(false);

    const fileUrlSegments = fileUrl ? fileUrl.split("/") : null;
    const fileName = fileUrlSegments ? fileUrlSegments[fileUrlSegments.length - 1] : "No file uploaded";

    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent className="bg-accent">
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the file and remove it from our server.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="text-sm flex items-center gap-2">
                    <span><FileIcon className="h-6 w-6" /></span>
                    <span className="truncate overflow-x-hidden">{fileName}</span>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={async () => {
                        toast.promise(deleteCompanyBusinessPermit(companyId), {
                            loading: "Updating company...",
                            success: () => {
                                return "File removed successfully";
                            },
                            error: () => {
                                return "Something went wrong. Failed to update company";
                            },
                        });
                        setOpen(false);
                    }} disabled={fileName === "No file uploaded"}>Sure</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default BusinessPermitDelete;
