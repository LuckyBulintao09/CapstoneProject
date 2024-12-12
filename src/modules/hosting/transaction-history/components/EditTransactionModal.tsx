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

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: number;
}

const EditTransactionModal = ({ isOpen, onClose, id }: EditTransactionModalProps) => {
  const [propertyTitle, setPropertyTitle] = useState("");
  const [unitTitle, setUnitTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [monthContract, setMonthContract] = useState(0);
  const [unitId, setUnitId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchTransaction = async () => {
        try {
          const data = await fetchEditDetails(id);
          setPropertyTitle(data?.unit?.property?.title || "");
          setUnitTitle(data?.unit?.title || "");
          setUnitId(data?.unit_id || null);
		  if(data.user_id){
			setClientName(`${data?.account?.firstname || ""} ${data?.account?.lastname || ""}`);
		  }else{
			setClientName(data?.client_name || "");
		  }
          setMonthContract(0);
        } catch (error) {
          console.error("Failed to fetch transaction details:", error.message);
        }
      };
      fetchTransaction();
    }
  }, [isOpen, id]);

  const handleFormSubmit = async () => {
    const supabase = createClient();
    // Add the update function here
    // If needed, include fields like "propertyTitle", "unitTitle", etc.

	const { error } = await supabase
	  .from("transaction")
	  .update({
		contract: format(new Date(Date.now() + (monthContract * 30 * 24 * 60 * 60 * 1000)), 'yyyy-MM-dd'),
		client_name: clientName
	  })
	  .eq("id", id);

  const { error: unitError } = await supabase
    .from("unit")
    .update({ contract: format(new Date(Date.now() + (monthContract * 30 * 24 * 60 * 60 * 1000)), 'yyyy-MM-dd') })
    .eq("id", unitId);
  

	if (error) {
	  console.error("Error updating transaction:", error.message);
	  return { success: false, error: error.message };
	}
	toast.success("Transaction updated successfully");
    onClose();
	window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[80%] lg:max-w-[50%] max-h-[80%] bg-white dark:bg-secondary shadow-lg rounded-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Contract</DialogTitle>
          <DialogDescription className="border-b border-gray-300 dark:text-gray-200 pb-2">
            Provide the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid w-full items-center gap-5">
          {/* Property Name */}
          {/* <div className="flex flex-col space-y-1.5">
            <Label htmlFor="propertyName" className="font-semibold">
              Property Name
            </Label>
            <Input value={propertyTitle} placeholder="Property name" disabled />
          </div> */}

          {/* Unit Title */}
          {/* <div className="flex flex-col space-y-1.5">
            <Label htmlFor="unitTitle" className="font-semibold">
              Unit Title
            </Label>
            <Input value={unitTitle} placeholder="Unit title" disabled />
          </div> */}

          {/* Client Name */}
          {/* <div className="flex flex-col space-y-1.5">
            <Label htmlFor="clientName" className="font-semibold">
              Client Name
            </Label>
            <Input
              id="clientName"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="border-gray-400"
              placeholder="Enter the client name"
            />
          </div> */}

          {/* Month Contract */}
          <div className="flex items-center justify-between w-full">
            <Label htmlFor="monthContract" className="font-semibold">
              Number of Month Contract
            </Label>
            <div className="flex items-center space-x-4">
              <div
                onClick={() => setMonthContract((prev) => Math.max(0, prev - 1))}
                className="px-2 py-1 rounded-full transition-all cursor-pointer hover:bg-gray-200 dark:hover:bg-secondary-dark-hover"
              >
                <MinusCircle className="text-sm" />
              </div>

              <span className="text-sm font-medium flex items-center justify-center w-[40px]">
                {monthContract}
              </span>

              <div
                onClick={() => setMonthContract((prev) => prev + 1)}
                className="px-2 py-1 rounded-full transition-all cursor-pointer hover:bg-gray-200 dark:hover:bg-secondary-dark-hover"
              >
                <PlusCircle className="text-sm" />
              </div>
            </div>
          </div>
        </div>

        <Button
          className="w-full mt-4"
          onClick={handleFormSubmit}
          disabled={!propertyTitle || !unitTitle || !clientName}
        >
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionModal;
