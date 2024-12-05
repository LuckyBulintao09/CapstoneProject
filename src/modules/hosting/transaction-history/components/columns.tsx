"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/data-column-header";
import { format, parseISO, set } from "date-fns";
import { Badge } from "@/components/ui/badge";
import ToggleSwitch from "./toggleSwitch";
import { createClient } from "@/utils/supabase/client";
import { CheckCircle2, XCircleIcon } from "lucide-react";
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import RejectionTransactionModal from "./cancellationModal";
import { toast } from "sonner";
import { cancel_lessorNotification } from "@/actions/notification/notification";


const supabase = createClient();

export type Transaction = {
  id: number;
  client_name: string;
  user_id: string;
  service_option: string;
  appointment_date: string;
  transaction_status: string;
  isPaid: boolean;
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
      
      const handleClick = async () => {
        const { data, error } = await supabase
          .from("transaction")
          .update({ isPaid: !isPaid })
          .eq("id", row.original.id);
        if (error) {
          console.error(error);
        } else {
          setIsPaid(!isPaid);
        }

        const { data: unitData, error: unitError } = await supabase
          .from("unit")
          .update({ isReserved: !isPaid })
          .eq("id", row.original.unit.id);
        if (unitError) {
          console.error(unitError);
        }

      };

      return (
        <span className="cursor-pointer" onClick={handleClick}>
          {isPaid ? (
            <CheckCircle2 className="text-white bg-green-800 dark:bg-green-700 mx-8 rounded-full p-0" />
          ) : (
            <XCircleIcon className="text-white bg-red-800 dark:bg-red-700 mx-8 rounded-full p-0" />
          )}
        </span>
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

      return (transactionStatus === "pending" || (transactionStatus === "reserved" && row.getValue("service_option") === "Room Reservation" && !row.getValue("isPaid"))) ? (
        <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSeparator />
            {transactionStatus === "pending" && (
              <>
                <DropdownMenuItem onSelect={() => updateTransactionStatus(row.original.id, "reserved", row.original.unit.id, false)}>
                  Reserve
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => updateTransactionStatus(row.original.id, "visited", row.original.unit.id, false)}>
                  Visited
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onSelect={() => setIsModalOpen(true)}>
              Cancel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <RejectionTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCancel}
        />
        </>
      ) : (
        <span />
      );

    },
  },
];

