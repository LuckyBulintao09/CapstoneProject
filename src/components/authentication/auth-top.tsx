import React from "react";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

function AuthTop() {
    return (
        <div className="absolute inline-flex items-center justify-center top-4 right-1/2 transform translate-x-1/2 airBnbDesktop:top-8 airBnbDesktop:right-8 airBnbDesktop:transform airBnbDesktop:translate-x-0 space-x-2">
            <Link href="/register" className={cn(buttonVariants({ variant: "ghost" }))}>
                Register
            </Link>
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
                Login
            </Link>
        </div>
    );
}

export default AuthTop;
