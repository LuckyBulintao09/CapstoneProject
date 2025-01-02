"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

function CardInfo() {
  return (
    <Card >
      <CardHeader>
        <CardTitle className="text-md">FINAL PROJECT</CardTitle>
        <CardDescription className="text-xs">Nov 14, 2024</CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        Please refer to the attached file as a reviewer
      </CardContent>
    </Card>
  );
}

export default CardInfo;
