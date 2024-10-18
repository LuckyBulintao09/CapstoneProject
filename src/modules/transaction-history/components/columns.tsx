"use client";

import { useState } from "react";
import { format, isWithinInterval, parseISO } from "date-fns";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/app/(auth)/(lessor-dashboard)/reservations/data-column-header";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import AddReviewModal from "./AddReviewModal";

const TransactionActionsCell = ({ row }: { row: Row<Transaction> }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const transactionStatus = row.getValue("transaction_status") as string;
  const propertyId = row.original.property?.id;

  return (
    <div className="flex flex-row gap-3">
      {(transactionStatus === "Confirmed" ||
        transactionStatus === "Visited") && (
        <>
          <Button
            variant="link"
            className="dark:text-amber-400"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            <Star className="h-4 w-4 mr-2" />
            Add Review
          </Button>
          <AddReviewModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            property_id={propertyId}
          />
        </>
      )}
    </div>
  );
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "property.property_code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Room Code" />
    ),
  },
  {
    accessorKey: "property.id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Room Name" />
    ),
  },
  {
    accessorKey: "service_option",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Service Option" />
    ),
    cell: ({ row }) => {
      const serviceOption = row.getValue("service_option") as string;
      return (
        <span className="truncate">
          {serviceOption
            .split(" ")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ")}
        </span>
      );
    },
  },
  {
    accessorKey: "appointment_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Appointment Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("appointment_date") as string;
      return date ? (
        <span className="truncate">
          {format(parseISO(date), "dd MMMM, yyyy")}
        </span>
      ) : (
        <span className="truncate">No date available</span>
      );
    },
    filterFn: (row, id, value) => {
      const { from, to } = value;
      const theDate = parseISO(row.getValue(id));

      if ((from || to) && !theDate) return false;
      if (from && !to) return theDate.getTime() >= from.getTime();
      if (!from && to) return theDate.getTime() <= to.getTime();
      if (from && to)
        return isWithinInterval(theDate, { start: from, end: to });
      return true;
    },
  },
  {
    accessorKey: "property.company.owner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lessor Name" />
    ),
    cell: ({ row }) => {
      const firstname =
        row.original.property?.company?.account?.firstname || "No";
      const lastname =
        row.original.property?.company?.account?.lastname || "Name";
      return `${firstname} ${lastname}`;
    },
  },
  {
    accessorKey: "transaction_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction Status" />
    ),
    cell: ({ row }) => {
      const transactionStatus = row.getValue("transaction_status") as string;
      const badgeColor = {
        Reserved: "bg-green-700 hover:bg-green-800",
        Pending: "bg-amber-600 hover:bg-amber-700",
        Cancelled: "bg-destructive hover:bg-red-800",
        Visited: "bg-primary hover:bg-blue-800",
      }[transactionStatus];

      return (
        <Badge
          className={`${badgeColor} ml-6`}
          style={{
            minWidth: "80px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {transactionStatus}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: TransactionActionsCell,
  },
];
