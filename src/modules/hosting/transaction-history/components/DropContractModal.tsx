"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { MinusCircle, PlusCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { fetchEditDetails } from "@/actions/transaction/fetchDetails";
import { format, set } from 'date-fns';
import { toast } from "sonner";
import { addMonths } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from '@/components/ui/calendar';
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: number;
}

const DropContractModal = ({ isOpen, onClose, id }: EditTransactionModalProps) => {
  const [date, setDate] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDropContract = async () => {
    const supabase = createClient();

    try {
      // get transaction unit id
      const { data: unit_id, error: unitIdError } = await supabase
        .from("transaction")
        .select("unit_id")
        .eq("id", id)
        .single();

      //update transaction
      const { error: transactionError } = await supabase
        .from("transaction")
        .update({ contract: new Date(date?.setDate(date.getDate() + 1)), month_contract: null })
        .eq("id", id);
    
      const {error: unitError} = await supabase
        .from("unit")
        .update({ contract: date})
        .eq("id", unit_id?.unit_id);  

      if (transactionError || unitError) {
        throw transactionError || unitError;
      }

      toast.success("Contract dropped and updated successfully!");

    } catch (error) {
      console.error("Failed to drop contract:", error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[70%] lg:max-w-[40%] bg-white dark:bg-secondary shadow-lg rounded-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Drop Contract</DialogTitle>
          <DialogDescription className="border-b border-gray-300 dark:text-gray-200 pb-2">
            Provide date of contract end.
          </DialogDescription>
        </DialogHeader>


            <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                    >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    />
                </PopoverContent>
            </Popover>
          

        <Button
          className="w-full mt-4"
          onClick={() => {
            handleDropContract(); 
            onClose();}}
        >
          Drop Contract
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DropContractModal;
