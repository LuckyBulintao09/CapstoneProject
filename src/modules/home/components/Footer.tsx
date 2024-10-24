"use client";

import { buttonVariants } from "@/components/ui/button";
import spiels from "@/lib/constants/spiels";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator"
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="flex flex-col justify-center items-center py-5 dark:bg-secondary border-t">
            <div className="flex flex-row justify-center items-center gap-1 text-xs text-muted-foreground">
                <span>{spiels.FOOTER}</span>
                <Separator orientation="vertical" className="h-5 mx-2 w-0.5"/>
                <Link href={`/TermsAndCondition`} target="_blank" className={cn(buttonVariants({ variant: "link", size: "sm" }), "mx-0 px-0")}>
                    Terms and Conditions
                </Link>
                <Separator orientation="vertical" className="h-5 mx-2 w-0.5"/>
                <span>All rights reserved.</span>
            </div>
        </footer>
    );
};

export default Footer;
