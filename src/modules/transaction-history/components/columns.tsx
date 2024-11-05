"use client";

import { useState, useEffect } from "react";
import { format, isWithinInterval, parseISO } from "date-fns";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/app/(auth)/(lessor-dashboard)/reservations/data-column-header";
import { Badge } from "@/components/ui/badge";
import { Star, XCircle } from "lucide-react";
import AddReviewModal from "./AddReviewModal";
import {
  fetchReviewData,
  deleteReview,
  cancelTransaction,
} from "@/actions/transaction/column";

interface Review {
  id: number;
  created_at: string;
  user_id: string;
  ratings: number;
  comment: string;
  isReported: boolean;
  unit_id: number;
}

const TransactionActionsCell = ({ row }: { row: Row<Transaction> }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState<Review | null>(null);
  const transactionStatus = row.getValue("transaction_status") as string;
  const unitId = row.original.unit?.id;

  useEffect(() => {
    const getReviewData = async () => {
      if (!unitId || !row.original.user_id) return;
      const review = await fetchReviewData(unitId, row.original.user_id);
      setReviewData(review);
    };

    getReviewData();
  }, [unitId, row.original.user_id]);

  const handleDeleteReview = async () => {
    if (!reviewData) return;

    const success = await deleteReview(reviewData.id);
    if (success) {
      setReviewData(null);
      window.location.reload();
    }
  };

  const handleCancel = async () => {
    const success = await cancelTransaction(row.original.id);
    if (success) {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-row gap-3">
      {(transactionStatus === "reserved" ||
        transactionStatus === "visited") && (
        <>
          {reviewData ? (
            <div className="flex gap-3 w-[280px]">
              <Button
                className="dark:text-amber-400 flex-1 flex justify-center"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                <Star className="h-4 w-4 mr-2" />
                Edit Review
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white flex-1 flex justify-center"
                size="sm"
                onClick={handleDeleteReview}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Delete Review
              </Button>
            </div>
          ) : (
            <Button
              className="dark:text-amber-400 w-[280px] flex justify-center"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              <Star className="h-4 w-4 mr-2" />
              Add Review
            </Button>
          )}
          <AddReviewModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            unit_id={unitId}
            reviewData={reviewData}
          />
        </>
      )}

      {transactionStatus === "pending" && (
        <Button
          className="bg-red-500 hover:bg-red-600 text-white w-[280px] flex justify-center"
          size="sm"
          onClick={handleCancel}
        >
          <XCircle className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      )}
    </div>
  );
};

// Columns Configuration
export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "unit.unit_code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Room Code" />
    ),
  },
  {
    accessorKey: "unit.title",
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
      return (
        <span className="truncate">
          {date ? format(parseISO(date), "dd MMMM, yyyy") : "No date available"}
        </span>
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
    accessorKey: "transaction_status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Transaction Status"
        className="flex justify-center items-center"
      />
    ),
    cell: ({ row }) => {
      const transactionStatus = row.getValue("transaction_status") as string;
      const badgeColor = {
        reserved: "bg-green-700 hover:bg-green-800",
        pending: "bg-amber-600 hover:bg-amber-700",
        cancelled: "bg-red-700 hover:bg-red-800",
        visited: "bg-blue-700 hover:bg-blue-800",
      }[transactionStatus];

      return (
        <div className="flex justify-center items-center w-full h-full">
          <Badge
            className={`${badgeColor} text-white`}
            style={{
              minWidth: "80px",
              minHeight: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.5rem 1rem",
            }}
          >
            {transactionStatus.charAt(0).toUpperCase() +
              transactionStatus.slice(1)}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: TransactionActionsCell,
  },
];
