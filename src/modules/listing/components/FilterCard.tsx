import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/multi-select";
import React, { useState, useEffect, useRef} from 'react';
import PublicMap from "./PublicMap";

const householdAmenities = [
  { value: "wifi", label: "WiFi" },
  { value: "air_conditioning", label: "Air Conditioning" },
  { value: "heating", label: "Heating" },
  { value: "washing_machine", label: "Washing Machine" },
  { value: "dryer", label: "Dryer" },
  { value: "dishwasher", label: "Dishwasher" },
  { value: "refrigerator", label: "Refrigerator" },
  { value: "microwave", label: "Microwave" },
  { value: "oven", label: "Oven" },
  { value: "stove", label: "Stove" },
  { value: "television", label: "Television" },
  { value: "iron", label: "Iron" },
  { value: "vacuum_cleaner", label: "Vacuum Cleaner" },
  { value: "coffee_maker", label: "Coffee Maker" },
  { value: "kettle", label: "Kettle" },
  { value: "toaster", label: "Toaster" },
  { value: "blender", label: "Blender" },
  { value: "hair_dryer", label: "Hair Dryer" },
  { value: "bed_linen", label: "Bed Linen" },
  { value: "towels", label: "Towels" },
];

export function FilterCard() {

	const [selectedFilter, setSelectedFilter] = React.useState<string[]>([]);

	return (
		<Card className='w-full bg-white dark:bg-secondary shadow-md lg:mt-0 md:mt-4 sm:mt-4 xs:mt-4'>
			<CardHeader>
				<Card className='h-[370px] border-none'>
					<div className='rounded-md w-full h-full border-none'>
						<PublicMap />
					</div>
				</Card>
			</CardHeader>
			<CardContent>
				<form>
					<div>
						<Label htmlFor='amenities' className='font-semibold'>
							Filter Amenities
						</Label>
						<MultiSelect
							options={householdAmenities}
							onValueChange={setSelectedFilter}
							defaultValue={selectedFilter}
							placeholder='Select amenities'
							variant='inverted'
							maxCount={6}
						/>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}


