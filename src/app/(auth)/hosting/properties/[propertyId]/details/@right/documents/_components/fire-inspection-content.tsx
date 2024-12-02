"use client";

import React from "react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { FileDown, Trash } from "lucide-react";

import Image from "next/image";

function FireInspectionContent({ fireInspection }: { fireInspection: { fire_inspection: string } }) {
    const fireInspectionName = fireInspection ? fireInspection?.fire_inspection?.split('/').pop() : "";
    const fireInspectionExtension = fireInspection ? fireInspection?.fire_inspection?.split('/').pop().split('.').pop() : "";
    return (
        <Card className="bg-background flex items-center justify-between">
            <CardHeader className="sr-only">
                <CardTitle className="sr-only">Manage business permit</CardTitle>
                <CardDescription className="sr-only">You can remove, update or download your business permit here.</CardDescription>
            </CardHeader>
            <CardContent className="px-5 py-3">
                <div className="flex items-center gap-2">
                    <Image
                        src={
                            (fireInspectionExtension === "jpb" || fireInspectionExtension === "jpeg" || fireInspectionExtension === "png") ? "/documents/image-document-svgrepo-com.svg" :
                            (fireInspectionExtension === "docx" || fireInspectionExtension === "doc") ? "/documents/word-document-svgrepo-com.svg" : fireInspectionExtension === "pdf" ? "/documents/pdf-document-svgrepo-com.svg" : "/documents/attachment-document-svgrepo-com.svg"
                        }
                        alt=""
                        width={64}
                        height={64}
                        className="object-cover aspect-square w-11 h-auto"
                    />
                    <div className="flex flex-col">
                        <p className="text-sm font-[500] truncate w-[300px]">
                            {fireInspection ? <span>{fireInspectionName}</span> : <span>No fire inspection certificate uploaded.</span>}
                        </p>
                        <p className="text-sm font-[500] truncate w-[300px] text-muted-foreground">1 kb</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="gap-2 px-5 py-3">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                    <FileDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Trash className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
  )
}

export default FireInspectionContent