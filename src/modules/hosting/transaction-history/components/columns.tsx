"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/data-column-header";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import ToggleSwitch from "./toggleSwitch";
import { createClient } from "@/utils/supabase/client";
import { CheckCircle2, XCircleIcon } from "lucide-react";
import React from "react";

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
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
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

      return transactionStatus === "pending" ? (
        <ToggleSwitch
          transactionId={row.original.id}
          unitId={row.original.unit.id}
          onStatusChange={(id, newStatus, unitId, cancelOthers) =>
            updateTransactionStatus(id, newStatus, unitId, cancelOthers)
          }
        />
      ) : (
        <span />
      );
    },
  },
];
