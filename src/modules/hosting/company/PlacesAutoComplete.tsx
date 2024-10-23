import React from "react";

import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

function PlacesAutoComplete({ setSelectedPlace }: {setSelectedPlace: React.Dispatch<React.SetStateAction<any>>}) {
    const {
        ready, 
        value,
        setValue,
        suggestions: {status, data},
        clearSuggestions,
    } = usePlacesAutocomplete({
        debounce: 300,
        requestOptions: {
            componentRestrictions: {
                country: 'AU',
            },
        },
        initOnMount: false,
    })

    const [buttonText ,setButtonText] = React.useState<string>("Select address...");
    const [popoverOpen, setPopoverOpen] = React.useState<boolean>(false);

    const handleSelectedValue = async (selectedAddress) => {
        setValue(selectedAddress, false);
        clearSuggestions();

        const convertedAddress = await getGeocode({address: selectedAddress});
        const { lat, lng } = await getLatLng(convertedAddress[0]);
        console.log(selectedAddress);
        setSelectedPlace({ lat, lng });
    }

    console.log("Component Mounted", { value, status, data });    

    return (
        <div>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild >
                    <Button variant="outline" role="combobox" className={cn("w-full justify-start", !value && "text-muted-foreground")} disabled={!ready}>
                        <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <span>{buttonText}</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start" side="bottom" >
                    <Command className="">
                        <CommandInput placeholder="Search address..." onValueChange={setValue} />
                        <CommandList>
                            <CommandEmpty>Address not found.</CommandEmpty>
                            <CommandGroup>
                                {status === "OK" &&
                                    data.map(({ place_id, description }) => (
                                        <CommandItem
                                            value={description}
                                            key={place_id}
                                            onSelect={(currentValue) => {
                                                handleSelectedValue(currentValue);
                                                setButtonText(currentValue);
                                                setPopoverOpen(!popoverOpen);
                                            }}
                                        >
                                            <Check className={cn("mr-2 h-4 w-4 opacity-0", description && "opacity-100")} />
                                            {description}
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default PlacesAutoComplete;
