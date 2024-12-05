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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleAlert, Trash } from "lucide-react";

import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { removeUnitById } from "@/actions/unit/removeUnitById";

function DeleteUnit({ unitId, classNames, unitTitle, propertyId }: { unitId: string; classNames?: string; unitTitle: any, propertyId: string }) {
    const [inputValue, setInputValue] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [isPending, startTransition] = React.useTransition();
    const PROJECT_NAME = unitTitle;

    return (
        <Dialog open={open} onOpenChange={setOpen} modal>
            <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                    <Trash className="h-5 w-5" />
                    <span>Delete this unit</span>
                </Button>
            </DialogTrigger>
            <DialogContent className={cn(classNames, "z-[999] transform translate-x-[-50%] translate-y-[-50%]")}>
                <div className="flex flex-col items-center gap-2">
                    <div className="flex size-14 shrink-0 items-center justify-center" aria-hidden="true">
                        <CircleAlert className="opacity-80 text-warning" size={128} strokeWidth={2} />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="sm:text-center">Final confirmation</DialogTitle>
                        <DialogDescription className="sm:text-center">
                            This action cannot be undone. To confirm, please enter the unit title{" "}
                            <span className="text-foreground font-bold">{unitTitle}</span>.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="unit-title">Unit title</Label>
                        <Input
                            id="unit-title"
                            type="text"
                            placeholder="Type Origin UI to confirm"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setInputValue("");
                                }}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="button"
                            className="flex-1"
                            disabled={inputValue !== PROJECT_NAME || isPending}
                            onClick={async () => {
                                startTransition(() => {
                                    toast.promise(removeUnitById(unitId, propertyId), {
                                        loading: "Deleting unit...",
                                        success: () => {
                                            return "Unit deleted successfully";
                                        },
                                        error: (error) => {
                                            console.log(error.message);
                                            return "Something went wrong. Failed to delete unit.";
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
                            Delete
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteUnit;
