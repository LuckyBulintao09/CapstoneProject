import React from 'react'

import Link from 'next/link'

import { useMediaQuery } from "@/hooks/use-media-query"

import { Button as ShadcnButton } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"



import { MoveLeft, MoveRight, X } from 'lucide-react';
import { removePropertyById } from '@/actions/property/remove-property-by-id';

import { useRouter } from 'next/navigation';


type ListingButtonProps = {
  hrefFrom?: string
  propertyId: string
}

function ListingStepButton({ hrefFrom, propertyId }: ListingButtonProps) {

    const router = useRouter()

    const isDesktop = useMediaQuery("(min-width: 742px)")

    const [openDialog, setOpenDialog] = React.useState(false)

    async function handleCancelListing(id: string) {
        if (id) {
            await removePropertyById(id)
        }
        router.push("/hosting/host-a-property")
    }

    return (
        <div className="absolute w-full h-[64px] bottom-0 left-0 px-3 py-2 flex flex-row items-center justify-between border-t">
            {hrefFrom ? (
                <ShadcnButton className="rounded-full" variant={"outline"} asChild>
                    <Link href={hrefFrom} className="flex flex-row items-center gap-2">
                        <span>
                            <MoveLeft className="w-5 h-5" />
                        </span>
                        Go back
                    </Link>
                </ShadcnButton>
            ) : isDesktop ? (
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <ShadcnButton variant={"outline"} className="rounded-full flex flex-row items-center gap-2">
                            <span>
                                <X className="w-5 h-5" />
                            </span>
                            Cancel
                        </ShadcnButton>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-secondary">
                        <DialogHeader>
                            <DialogTitle>Cancel listing</DialogTitle>
                            <DialogDescription>Are you sure you want to cancel this listing?</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <ShadcnButton variant="destructive" onClick={() => handleCancelListing(propertyId)}>Confirm</ShadcnButton>
                            <ShadcnButton variant="outline" onClick={() => setOpenDialog(false)}>Cancel</ShadcnButton>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            ) : (
                <Drawer>
                    <DrawerTrigger asChild>
                        <ShadcnButton variant={"outline"} className="rounded-full flex flex-row items-center gap-2">
                            <span>
                                <X className="w-5 h-5" />
                            </span>
                            Cancel
                        </ShadcnButton>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader className="text-left">
                            <DrawerTitle>Cancel listing</DrawerTitle>
                            <DrawerDescription>Are you sure you want to cancel this listing?</DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter className="pt-2">
                            <ShadcnButton variant="destructive" onClick={() => handleCancelListing(propertyId)}>Confirm</ShadcnButton>
                            <DrawerClose asChild>
                                <ShadcnButton variant="outline">Cancel</ShadcnButton>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            )}
            <ShadcnButton className="rounded-full flex flex-row items-center gap-2" type="submit">
                Next
                <span>
                    <MoveRight className="w-5 h-5" />
                </span>
            </ShadcnButton>
        </div>
    );
}

export default ListingStepButton