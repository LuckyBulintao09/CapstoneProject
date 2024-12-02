"use client";

import React, { useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import PropertyListingsDashboard from "../newProperty-components/page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PropertyTab() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
 const [newPropertyCount, setNewPropertyCount] = useState(0);
  const handleCountUpdate = (count: number) => {
		setNewPropertyCount(count);
	};

  return (
		<Card className='h-full bg-white dark:bg-secondary'>
			<CardHeader>
				<CardTitle>New Property</CardTitle>
				<CardDescription>
					Upcoming {newPropertyCount} properties waiting for approval
				</CardDescription>
			</CardHeader>
			<CardContent className='flex flex-col h-full'>
				<PropertyListingsDashboard
					isLoaded={isLoaded}
					onCountUpdate={handleCountUpdate}
				/>
			</CardContent>
		</Card>
	);
}
