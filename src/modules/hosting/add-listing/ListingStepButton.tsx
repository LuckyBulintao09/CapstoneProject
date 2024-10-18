import Link from 'next/link'
import React from 'react'
import { Button as ShadcnButton } from "@/components/ui/button";
import { MoveRight } from 'lucide-react';

type ListingButtonProps = {
  hrefTo: string
  hrefFrom?: string
}

function ListingStepButton({ hrefTo, hrefFrom }: ListingButtonProps) {
    return (
        <div className="absolute w-full h-[64px] bottom-0 left-0 px-3 py-2 flex flex-row items-center justify-between border">
            {hrefFrom && (
                <ShadcnButton
                    className="rounded-full"
                    variant={"outline"}
                    asChild
                >
                    <Link href={hrefFrom}>Go Back</Link>
                </ShadcnButton>
            )}
            <ShadcnButton className="rounded-full" asChild>
                <Link
                    href={hrefTo}
                    className="flex flex-row items-center gap-2"
                >
                    Next
                    <span>
                        <MoveRight className="w-5 h-5" />
                    </span>
                </Link>
            </ShadcnButton>
        </div>
    );
}

export default ListingStepButton