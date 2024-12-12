"use client";

import React from "react";

import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { CircleAlert, Redo2, Trash, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

import { propertyReapplication } from "@/actions/property/update-property";

function Reapplication({ propertyId, classNames, propertyTitle, documentsStatus, userId }: { propertyId: string, classNames?: string, propertyTitle: any, documentsStatus: any, userId: any }) {
    const [open, setOpen] = React.useState(false);
    const [businessPermitContent, setBusinessPermitContent] = React.useState(false);
    const [fireInspectionContent, setFireInspectionContent] = React.useState(false);

    const [isPending, startTransition] = React.useTransition();
    return (
        <Dialog open={open} onOpenChange={setOpen} modal>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                    <Redo2 className="h-4 w-4" />
                    <span>Reapply</span>
                </Button>
            </DialogTrigger>
            <DialogContent
                className={cn(classNames, "z-[999] transform translate-x-[-50%] translate-y-[-50%]")}
                onInteractOutside={(e) => {
                    e.preventDefault();
                }}
            >
                <div className="flex flex-col items-center gap-2">
                    <div className="flex size-14 shrink-0 items-center justify-center" aria-hidden="true">
                        <CircleAlert className="opacity-80 text-warning" size={128} strokeWidth={2} />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="sm:text-center">Update documents</DialogTitle>
                        <DialogDescription className="sm:text-center">
                            Update your documents here to reapply for{" "}
                            <span className="text-foreground font-bold">{propertyTitle}</span>.
                            <span>
                                If you have not updated your property documents go to the property details section and
                                update your documents.
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="relative flex w-full items-start gap-2 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring">
                    <Checkbox
                        id="is-business-permit-updated"
                        className="order-1 after:absolute after:inset-0"
                        aria-describedby="is-business-permit-updated-description"
                        checked={businessPermitContent}
                        onCheckedChange={() => {
                            setBusinessPermitContent(!businessPermitContent);
                        }}
                    />
                    <div className="grid grow gap-2">
                        <Label htmlFor="is-business-permit-updated">I have updated my business permit. </Label>
                        <p id="is-business-permit-updated-description" className="text-sm text-muted-foreground">
                            This is to confirm that the business permit is updated.
                        </p>
                    </div>
                </div>

                <div className="relative flex w-full items-start gap-2 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring">
                    <Checkbox
                        id="is-fire-inspection-updated"
                        className="order-1 after:absolute after:inset-0"
                        aria-describedby="is-fire-inspection-updated-description"
                        checked={fireInspectionContent}
                        onCheckedChange={() => {
                            setFireInspectionContent(!fireInspectionContent);
                        }}
                    />
                    <div className="grid grow gap-2">
                        <Label htmlFor="is-fire-inspection-updated">
                            I have updated my fire inspection certification.{" "}
                        </Label>
                        <p id="is-fire-inspection-updated-description" className="text-sm text-muted-foreground">
                            This is to confirm that the fire inspection certification is updated.
                        </p>
                    </div>
                </div>
                {documentsStatus?.arePermitsComplete === false && (
                    <div className="text-sm flex w-full items-center gap-2 rounded-lg border border-warning p-4 py-2 shadow-sm shadow-black/5 bg-warning/20">
                        <TriangleAlert className="text-warning h-16 w-16" strokeWidth={2} />
                        <span>
                            You haven't uploaded your business permit or fire inspection. Please update your documents.
                        </span>
                    </div>
                )}

                <div className="space-y-5">
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setBusinessPermitContent(false);
                                    setFireInspectionContent(false);
                                }}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        {/* chnage the function to update the status to pending --- done */}
                        <Button
                            type="button"
                            className="flex-1"
                            disabled={
                                isPending ||
                                !(fireInspectionContent && businessPermitContent) ||
                                documentsStatus?.arePermitsComplete === false
                            }
                            onClick={async () => {
                                startTransition(() => {
                                    toast.promise(propertyReapplication(propertyId), {
                                        loading: "Updating property...",
                                        success: () => {
                                            setBusinessPermitContent(false);
                                            setFireInspectionContent(false);
                                            setOpen(false);
                                            return "Property updated successfully";
                                        },
                                        error: (error) => {
                                            console.log(error.message);
                                            return "Something went wrong. Failed to update property.";
                                        },
                                    });
                                });
                            }}
                        >
                            {isPending && (
                                <svg
                                    aria-hidden="true"
                                    className="size-6 mr-2 fill-accent animate-spin-fade dark:text-accent-foreground text-primary"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                            )}{" "}
                            Continue
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default Reapplication;
