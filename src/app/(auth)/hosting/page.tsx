import React from "react";

import Link from "next/link";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { cn } from "@/lib/utils";

import { CircleAlert } from "lucide-react";

function LessorPage() {
    return (
        <div className="pt-16 space-y-11">
            <div className="px-20 max-w-[1440px] mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-[2em] font-[500]">Welcome back, Throw</h1>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="link">Show all (3)</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Property issues</DialogTitle>
                                <DialogDescription>This contains a list of issues and required actions about your property.</DialogDescription>
                            </DialogHeader>
                            <div className=" h-[calc(100vh-10rem)] ">
                                <ScrollArea>
                                    <div className="flex flex-col gap-3">
                                        <span className="text-sm">Required actions</span>
                                        <div className="flex flex-row justify-between items-center px-5 py-3 border rounded-md">
                                            <div className="flex flex-col justify-start text-sm">
                                                <span className="font-[500]">Confirm important details</span>
                                                <span className="text-destructive">Required to publish</span>
                                                <span>Lucky homes</span>
                                                <Link
                                                    href="/hosting"
                                                    className={cn(
                                                        buttonVariants({ variant: "link", size: "sm" }),
                                                        " px-0 py-0 h-fit w-fit block mt-2"
                                                    )}
                                                >
                                                    Go to property {`>>`}
                                                </Link>
                                            </div>
                                            <CircleAlert className="size-8 text-destructive" />
                                        </div>
                                    </div>
                                </ScrollArea>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="grid grid-cols-4 w-full gap-4 mt-8">
                    {/* issues */}
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row justify-between items-center px-5 py-3 border rounded-md">
                            <div className="flex flex-col justify-start text-sm">
                                <span className="font-[500]">Confirm important details</span>
                                <span className="text-destructive">Required to publish</span>
                                <span>Lucky homes</span>
                                <Link
                                    href="/hosting"
                                    className={cn(buttonVariants({ variant: "link", size: "sm" }), " px-0 py-0 h-fit w-fit block mt-2")}
                                >
                                    Go to property {`>>`}{" "}
                                </Link>
                            </div>
                            <CircleAlert className="size-8 text-destructive" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-20 max-w-[1440px] mx-auto pb-16">
                <div className="flex justify-between items-center">
                    <h1 className="text-[2em] font-[500]">Your reservations</h1>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="link">All reservations (0)</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Property issues</DialogTitle>
                                <DialogDescription>This contains a list of issues and required actions about your property.</DialogDescription>
                            </DialogHeader>
                            <div className=" h-[calc(100vh-10rem)] ">
                                <ScrollArea>
                                    <div className="flex flex-col gap-3">
                                        <span className="text-sm">Required actions</span>
                                        <div className="flex flex-row justify-between items-center px-5 py-3 border rounded-md">
                                            <div className="flex flex-col justify-start text-sm">
                                                <span className="font-[500]">Confirm important details</span>
                                                <span className="text-destructive">Required to publish</span>
                                                <span>Lucky homes</span>
                                                <Link
                                                    href="/hosting"
                                                    className={cn(
                                                        buttonVariants({ variant: "link", size: "sm" }),
                                                        " px-0 py-0 h-fit w-fit block mt-2"
                                                    )}
                                                >
                                                    Go to property {`>>`}
                                                </Link>
                                            </div>
                                            <CircleAlert className="size-8 text-destructive" />
                                        </div>
                                    </div>
                                </ScrollArea>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <Tabs defaultValue="1" className="w-full mt-8">
                    <TabsList className="flex flex-row items-center justify-start gap-5 rounded-full bg-transparent dark:bg-transparent">
                        <TabsTrigger
                            value="1"
                            className="px-3 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:[data-state=active]:text-primary-foreground data-[state=active]:font-normal dark:data-[state=active]:font-normal data-[state=active]:text-base dark:data-[state=active]:text-base"
                        >
                            Currently hosting (0)
                        </TabsTrigger>
                        <TabsTrigger
                            value="2"
                            className="px-3 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:[data-state=active]:text-primary-foreground data-[state=active]:font-normal dark:data-[state=active]:font-normal data-[state=active]:text-base dark:data-[state=active]:text-base"
                        >
                            Arriving soon (0)
                        </TabsTrigger>
                        <TabsTrigger
                            value="3"
                            className="px-3 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:[data-state=active]:text-primary-foreground data-[state=active]:font-normal dark:data-[state=active]:font-normal data-[state=active]:text-base dark:data-[state=active]:text-base"
                        >
                            Pending review (0)
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="1">
                        <div className="h-48 rounded-lg flex items-center justify-center border">You dont have guests staying with you right now.</div>
                    </TabsContent>
                    <TabsContent value="2">
                        <div className="h-48 rounded-lg flex items-center justify-center border">You dont have any guests arriving today or tomorrow.</div>
                    </TabsContent>
                    <TabsContent value="3">
                        <div className="h-48 rounded-lg flex items-center justify-center border">You dont have any reviews to write.</div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default LessorPage;
