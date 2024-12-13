"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/data-column-header";
import { format, parseISO, set } from "date-fns";
import { Badge } from "@/components/ui/badge";
import ToggleSwitch from "./toggleSwitch";
import { createClient } from "@/utils/supabase/client";
import { CheckCircle2, XCircleIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import RejectionTransactionModal from "./cancellationModal";
import { toast } from "sonner";
import { cancel_lessorNotification, cancelled_onsiteNotification, confirm_reserveNotification } from "@/actions/notification/notification";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogHeader,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import EditTransactionModal from "./EditTransactionModal";
import { setOfficialTransaction } from "@/actions/transaction/setOfficialTransacttion";
import { setUnofficialTransaction } from "@/actions/transaction/setUnofficialTransaction";
import { Label } from '@/components/ui/label';
import { CalendarIcon, PlusCircle, MinusCircle } from 'lucide-react';
import { ca } from "date-fns/locale";
import { addMonths } from "date-fns";
import ReserveTransactionModal from "./ReserveTransactionModal";


const supabase = createClient();

export type Transaction = {
  id: number;
  client_name: string;
  user_id: string;
  service_option: string;
  appointment_date: string;
  transaction_status: string;
  isPaid: boolean;
  month_contract: Date;
  unit: {
    id: number;
    title: string;
    unit_code: string;
  };
  unit_title: string;
  account: {
    firstname: string;
    lastname: string;
  };
  property_title: string;
};

export const columns = (
  updateTransactionStatus: (
    id: number,
    newStatus: string,
    unitId: number,
    cancelOthers: boolean
  ) => Promise<void>
): ColumnDef<Transaction>[] => [
  {
    accessorKey: "property_title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property" />
    ),
  },
  {
    accessorKey: "unit_title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unit Title" />
    ),
  },
  {
    accessorKey: "client_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client Name" />
    ),
  },
  {
    accessorKey: "service_option",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Service Option" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("service_option")}</span>
    ),
  },
  {
    accessorKey: "transaction_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Service Option" />
    ),
    cell: ({ row }) => (
      <span className="truncate">{row.getValue("transaction_type")}</span>
    ),
  },
  {
    accessorKey: "appointment_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Appointment Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("appointment_date") as string;
      return (
        <span className="truncate">
          {date ? format(parseISO(date), "dd MMMM, yyyy") : "No date available"}
        </span>
      );
    },
  },
  {
    accessorKey: "contract",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End of Contract" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("contract") as string;
      return (
        <span className="truncate">
          {date ? format(parseISO(date), "dd MMMM, yyyy") : "Not yet set"}
        </span>
      );
    },
  },
  {
    accessorKey: "transaction_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("transaction_status") as string;
      const badgeStyles = {
        reserved: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200",
        pending: "bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-200",
        cancelled: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200",
        visited: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200",
      };
      const style = badgeStyles[status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";

      return (
        <Badge
          className={`${style} mx-8 w-[80px] text-center items-center justify-center`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isPaid",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Payment Status" />
  ),
  cell: ({ row }) => {
    const [isPaid, setIsPaid] = React.useState(row.getValue("isPaid") as boolean);
    const [isOpen, setIsOpen] = React.useState(false);
    const [monthContract, setMonthContract] = useState(0);
    const [occupant, setOccupant] = useState<any>(null);


    const handleConfirm = async () => {
      try {
        // notification to cancelled and reserved users
        const { data: receiver_id, error: receiverIdError } = await supabase
          .from("transaction")
          .select("user_id")
          .eq("unit_id", row.original.unit.id)
          .eq("isPaid", false)
          .in("transaction_status", ["pending", "reserved"])
          .not("user_id", "eq", row.original.user_id);

        const receiverIds = receiver_id.map(item => item.user_id);
		    await cancelled_onsiteNotification(row.original.unit.id, receiverIds);
        await confirm_reserveNotification(row.original.unit.id, row.original.user_id);

        //cancel other
        const { error: cancelError } = await supabase
          .from("transaction")
          .update({ transaction_status: "cancelled" })
          .eq("unit_id", row.original.unit.id)
          .eq("isPaid", false)
          .in("transaction_status", ["pending", "reserved"])
          .not("id", "eq", row.original.id);

        //get occupant
        const { data: occupantData, error: occupantError } = await supabase
          .from("transaction")
          .select("guest_number")
          .eq("id", row.original.id)
          .single();

        //update transaction and unit
        const { error } = await supabase
          .from("transaction")
          .update({ isPaid: !isPaid, month_contract: monthContract, contract: format(new Date(Date.now() + (monthContract * 30 * 24 * 60 * 60 * 1000)), 'yyyy-MM-dd') })
          .eq("id", row.original.id);

        const { error: officialError } = await supabase
          .from("unit")
          .update({ current_occupants: occupantData.guest_number,isReserved: !isPaid,contract: format(new Date(Date.now() + (monthContract * 30 * 24 * 60 * 60 * 1000)), 'yyyy-MM-dd') })
          .eq("id", row.original.unit.id);

          await setOfficialTransaction(row.original.id);

        if (error || officialError) {
          console.error(error || officialError);
        } else {
          setIsPaid(!isPaid);
          toast.success("Payment confirmed successfully.");
          // await setUnofficialTransaction(row.original.id);
        }

      } finally {
        setIsOpen(false);
      }
    };

    const handleRemove = async () => {
      try {
        //remove payment
        const { error: paymentError } = await supabase
          .from("transaction")
          .update({ isPaid: !isPaid, month_contract: null, contract: null, guest_number: null })
          .eq("id", row.original.id);

        const { error: unitError} = await supabase
          .from("unit")
          .update({ current_occupants: 0, isReserved: !isPaid,contract: null })
          .eq("id", row.original.unit.id);

        if (paymentError || unitError) {
          console.error(paymentError || unitError);
        } else {
          setIsPaid(!isPaid);
          toast.success("Payment removed successfully.");
          await setUnofficialTransaction(row.original.id);
        }
      } finally {
        setIsOpen(false);
      }
    };

    
    

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <span
            className="cursor-pointer"
            style={{
              pointerEvents:
                row.original.transaction_status === "visited" ||
                row.original.transaction_status === "pending" ||
                row.original.transaction_status === "cancelled"
                  ? "none"
                  : "auto",
            }}
          >
            {isPaid ? (
              <CheckCircle2 className="text-white bg-green-800 dark:bg-green-700 mx-8 rounded-full p-0" />
            ) : (
              <XCircleIcon className="text-white bg-red-800 dark:bg-red-700 mx-8 rounded-full p-0" />
            )}
          </span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Payment Confirmation for <b>{row.original.unit.title}</b>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {isPaid ? "remove" : "confirm"} payment for this transaction?

              {!isPaid && (
                <div className="flex items-center justify-between w-full mt-5">
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
              )}

            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={isPaid ? handleRemove : handleConfirm}>
              {isPaid ? "Remove" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
    },
  },
  
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    cell: ({ row }) => {
      const transactionStatus = row.getValue("transaction_status") as string;

      const [isModalOpen, setIsModalOpen] = React.useState(false);
      const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
      const [paidStatus, setPaidStatus] = React.useState(row.getValue("isPaid") as boolean);
      const [isReserveModalOpen, setIsReserveModalOpen] = React.useState(false);
      const handleCancel = async (reason: string) => {
        try {
          await supabase
            .from("transaction")
            .update({ transaction_status: "cancelled", cancellation_reason: reason })
            .eq("id", row.original.id);
          
          await supabase
            .from("unit")
            .update({ isReserved: false })
            .eq("id", row.original.unit.id);

          // Optionally update the table data or refetch
          toast.success("Transaction cancelled successfully.");
          await cancel_lessorNotification(row.original.user_id, row.original.unit.id, reason);
          window.location.reload();
        } catch (error) {
          console.error(error);
          toast.error("Failed to cancel the transaction.");
        }
      };

      const handleRenewContract = async () => {
        try {
          // Fetch the data
          const { data: transactionData, error: contractError } = await supabase
            .from("transaction")
            .select("month_contract, contract")
            .eq("id", row.original.id)
            .single();

            console.log(transactionData)
      
          if (contractError) {
            console.error("Error fetching transaction:", contractError);
            return;
          }
      
          const { month_contract, contract } = transactionData;
      
           // Validate the data
          if (typeof month_contract !== "number" || isNaN(month_contract)) {
            console.error("Invalid or missing value for month_contract:", month_contract);
            return;
          }

          if (!contract || isNaN(new Date(contract).getTime())) {
            console.error("Invalid or missing date for contract:", contract);
            return;
          }

          // Calculate the new contract date
          const newContractDate = addMonths(new Date(contract), month_contract)
            .toISOString()
            .slice(0, 10);
      
      
          // // Update the transaction
          const { error: updateError } = await supabase
            .from("transaction")
            .update({ contract: newContractDate })
            .eq("id", row.original.id);
  
          const { error: unitError } = await supabase
            .from("unit")
            .update({ contract: newContractDate })
            .eq("id", row.original.unit.id);
      
          if (updateError || unitError) {
            console.error("Error updating transaction:", updateError || unitError);
          } else {
            toast.success("Contract renewed successfully");
          }
        } catch (error) {
          console.error("Unexpected error:", error);
        } 
      };

      const handleReserve = async (cmonth: number, nguest: number) => {
        //ADD HANDLE RESERVE FOR visited and reserved the unit, auto pay, add contract
        //ADD MODAL to set occupation and contract
        try {
          //Add notification cancelled and to the reserved user
          const { data: receiver_id, error: receiverIdError } = await supabase
            .from("transaction")
            .select("user_id")
            .eq("unit_id", row.original.unit.id)
            .eq("isPaid", false)
            .in("transaction_status", ["pending", "reserved"])
            .not("user_id", "eq", row.original.user_id);
          
          const receiverIds = receiver_id.map(item => item.user_id);
          await cancelled_onsiteNotification(row.original.unit.id, receiverIds);
          await confirm_reserveNotification(row.original.unit.id, row.original.user_id);

          //cancel other
          const { error: cancelError } = await supabase
            .from("transaction")
            .update({ transaction_status: "cancelled" })
            .eq("unit_id", row.original.unit.id)
            .eq("isPaid", false)
            .in("transaction_status", ["pending", "reserved"])
            .not("id", "eq", row.original.id);

          // update transaction and unit
          const { error: updateError } = await supabase
            .from("transaction")
            .update({ transaction_status: "reserved", isPaid: true, month_contract: cmonth, contract:  format(new Date(Date.now() + cmonth * 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd") })
            .eq("id", row.original.id);

          const { error: unitError } = await supabase
            .from("unit")
            .update({ isReserved: true, current_occupants: nguest, contract: format(new Date(Date.now() + cmonth * 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd") })
            .eq("id", row.original.unit.id);

          if (updateError || unitError) {
            console.error("Error updating transaction:", updateError || unitError);
          } else {
            toast.success("Transaction reserved successfully");
            await setOfficialTransaction(row.original.id);
          }
        } catch (error) {
          console.error("Unexpected error:", error);
        }
      }

      //Add drop Contract
      const handleDropContract = async () => {
        try {
          //update transaction
          const { error } = await supabase
            .from("transaction")
            .update({ contract: null, month_contract: null })
            .eq("id", row.original.id);

          const { error: unitError} = await supabase
            .from("unit")
            .update({ contract: null, isReserved: false, current_occupants: 0  })
            .eq("id", row.original.unit.id);

          if (error || unitError) {
            console.error("Error updating transaction:", error || unitError);
          } else {
            toast.success("Contract dropped successfully");
          }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    }


      return (transactionStatus === "pending" || (transactionStatus === "reserved")) ? (
        <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {transactionStatus === "pending" && (
              <>
                <DropdownMenuItem onSelect={() => setIsReserveModalOpen(true)}>
                  Reserve
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => updateTransactionStatus(row.original.id, "visited", row.original.unit.id, false)}>
                  Visited
                </DropdownMenuItem>
              <DropdownMenuSeparator/>
              </>
            )}
            {transactionStatus === "reserved" && paidStatus &&  (
              <>
                <DropdownMenuItem onSelect={() => handleRenewContract()}>
                  Renew Contract
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleDropContract()}>
                  Drop Contract
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onSelect={() => setIsEditModalOpen(true)}>
              Edit Contract
            </DropdownMenuItem>
            {!paidStatus && (
              <>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onSelect={() => setIsModalOpen(true)}>
                  Cancel
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <RejectionTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCancel}
        />
        <EditTransactionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          id={row.original.id}
        />
        <ReserveTransactionModal
          isOpen={isReserveModalOpen}
          onClose={() => setIsReserveModalOpen(false)}
          handleReserve={handleReserve}
        />
        </>
      ) : (
        <span />
      );

    },
  },
];

