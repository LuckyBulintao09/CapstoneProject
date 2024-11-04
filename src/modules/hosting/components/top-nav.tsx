"use client";

import React from "react";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
// import { SignOut } from "@/app/(authentication)/login/actions";

import Image from "next/image";
import Link from "next/link";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";

import { useMediaQuery } from "@/hooks/use-media-query";

import {
    Briefcase,
    Building2,
    ChevronDown,
    Home,
    LibraryBig,
    Lightbulb,
    Menu,
    MessageCircleMore,
    PlusSquare,
    Scroll,
    Settings,
    UserCircle2,
    X,
} from "lucide-react";

function TopNavigation() {
    /*
        used useEffect and state so that all possible static routes stay static
    */
    const [user, setUser] = React.useState<User | null>(null);
    const [open, setOpen] = React.useState<boolean>(false);
    const isDesktop = useMediaQuery("(min-width: 950px)");

    // to check if user is logged in without being dynamic
    React.useEffect(() => {
        const { auth } = createClient();

        auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        const { data: authListener } = auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN") {
                setUser(session?.user || null);
            } else if (event === "SIGNED_OUT") {
                setUser(null);
            }
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    // for scrolling while mobile
    React.useEffect(() => {
        if (open) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [open]);

    return (
        <nav className="py-5 sticky z-[99] airBnbDesktop:z-10 top-0 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
            <div className="w-full grid grid-flow-col px-5">
                <div className="flex flex-nowrap items-center justify-start h-11">
                    <Image src="/Logo.png" alt="UniHomes logo" width={120} height={120} priority className="size-24 object-contain aspect-square" />
                </div>
                {isDesktop ? (
                    <>
                        <ul className="flex flex-nowrap items-center justify-center gap-4">
                            <li>
                                <Link href="/hosting" className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/hosting/units" className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}>
                                    Listings
                                </Link>
                            </li>
                            <li>
                                <Link href="/chat/inbox" className={cn(buttonVariants({ variant: "ghost" }), "rounded-full")}>
                                    Messages
                                </Link>
                            </li>
                            <li>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "rounded-full inline-flex items-center gap-2 [&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-in-out [&_svg]:data-[state=open]:rotate-180 [&_svg]:data-[state=closed]:rotate-0"
                                            )}
                                        >
                                            <span>Menu</span>
                                            <ChevronDown className={`h-4 w-4`} />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="bottom" align="start">
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>Listings</DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/hosting/property`}>Properties</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>Reservations</DropdownMenuItem>
                                            <DropdownMenuItem>Insights</DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <div className="inline-flex items-center gap-2">
                                                <span>
                                                    <PlusSquare className="h-5 w-5" strokeWidth={1} />
                                                </span>
                                                <span>Create new listing</span>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </li>
                        </ul>

                        <div className="flex flex-nowrap items-center justify-end gap-11">
                            {/* Notification here */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className="rounded-full">
                                    <Avatar className="w-11 h-11 select-none">
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback className="text-xl font-bold bg-primary text-white dark:text-foreground">
                                            {user?.email?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="bottom" align="end" className="w-fit" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none truncate">{user?.email}</p>
                                            <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem>Profile</DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                                <Link href={`/hosting/company`}>Company</Link>
                                            </DropdownMenuItem>
                                        <DropdownMenuItem>Settings</DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Sign out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </>
                ) : (
                    // mobile view
                    <div className="flex flex-nowrap items-center justify-end">
                        <Sheet open={open} onOpenChange={setOpen} modal={false}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="[&_svg]:size-6">
                                    {open ? <X /> : <Menu />}
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="h-[calc(100vh-80px)] mt-[calc(12.5rem-120px)] py-0 bg-white" side="top">
                                <ScrollArea className="h-[calc(100vh-80px)]">
                                    <SheetClose className="sr-only">Close</SheetClose>
                                    <SheetHeader className="sr-only">
                                        <SheetTitle>Navigation menu</SheetTitle>
                                        <SheetDescription>
                                            This action cannot be undone. This will permanently delete your account and remove your data from our
                                            servers.
                                        </SheetDescription>
                                    </SheetHeader>
                                    <div className="grid gap-11 py-7">
                                        {/* menu */}
                                        <ul className="flex flex-col gap-2 [&_svg]:size-6">
                                            <li className="mb-2">MENU</li>
                                            <li>
                                                <Link
                                                    href={`/test`}
                                                    className={cn(
                                                        buttonVariants({ variant: "ghost" }),
                                                        "w-full justify-start rounded-none px-0 gap-2"
                                                    )}
                                                >
                                                    <Home /> Home
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={`/test`}
                                                    className={cn(
                                                        buttonVariants({ variant: "ghost" }),
                                                        "w-full justify-start rounded-none px-0 gap-2"
                                                    )}
                                                >
                                                    <Scroll />
                                                    Listings
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={`/test`}
                                                    className={cn(
                                                        buttonVariants({ variant: "ghost" }),
                                                        "w-full justify-start rounded-none px-0 gap-2"
                                                    )}
                                                >
                                                    <MessageCircleMore />
                                                    Messages
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={`/hosting/property`}
                                                    className={cn(
                                                        buttonVariants({ variant: "ghost" }),
                                                        "w-full justify-start rounded-none px-0 gap-2"
                                                    )}
                                                >
                                                    <LibraryBig />
                                                    Properties
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={`/test`}
                                                    className={cn(
                                                        buttonVariants({ variant: "ghost" }),
                                                        "w-full justify-start rounded-none px-0 gap-2"
                                                    )}
                                                >
                                                    <Briefcase />
                                                    Reservations
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={`/test`}
                                                    className={cn(
                                                        buttonVariants({ variant: "ghost" }),
                                                        "w-full justify-start rounded-none px-0 gap-2"
                                                    )}
                                                >
                                                    <Lightbulb />
                                                    Insigts
                                                </Link>
                                            </li>
                                        </ul>
                                        <Separator />
                                        {/* account */}
                                        <ul className="flex flex-col gap-2 [&_svg]:size-6">
                                            <li className="mb-2">ACCOUNT</li>
                                            <li>
                                                <Link
                                                    href={`/test`}
                                                    className={cn(
                                                        buttonVariants({ variant: "ghost" }),
                                                        "w-full justify-start rounded-none px-0 gap-2"
                                                    )}
                                                >
                                                    <UserCircle2 /> Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={`/hosting/company`}
                                                    className={cn(
                                                        buttonVariants({ variant: "ghost" }),
                                                        "w-full justify-start rounded-none px-0 gap-2"
                                                    )}
                                                >
                                                    <Building2 />
                                                    Manage Companies
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={`/test`}
                                                    className={cn(
                                                        buttonVariants({ variant: "ghost" }),
                                                        "w-full justify-start rounded-none px-0 gap-2"
                                                    )}
                                                >
                                                    <Settings />
                                                    Settings
                                                </Link>
                                            </li>
                                        </ul>
                                        <Separator />
                                        {/* sign out */}
                                        <div className="flex flex-col gap-2 [&_svg]:size-6">
                                            <Button
                                            // onClick={async () => {
                                            //     SignOut();
                                            // }}
                                            >
                                                Sign out
                                            </Button>
                                        </div>
                                    </div>
                                </ScrollArea>
                            </SheetContent>
                        </Sheet>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default TopNavigation;
