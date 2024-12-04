"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/table/data-column-header";
import { useState } from "react";
import ApproveConfirmationModal from "../components/ApproveConfirmationModal";
import RejectConfirmationModal from "../components/RejectConfirmationModal";
import { toast } from "sonner";
import { updateProprietorStatus } from "@/actions/admin/updateProprietorStatus";
import { confirmedProprietorNotification, rejectedProprietorNotification } from "@/actions/notification/notification";

export type NewProprietors = {
  id: string;
  proprietor_name: string;
  email: string;
  cp_number: string;
  birthdate: string;
  govIdUrl: string;
  approved_government: boolean;
  rejected_government: boolean;
  decline_reason?: string; 
};

const NewProprietorsActionsCell = ({
  row,
  onProprietorUpdate,
}: {
  row: Row<NewProprietors>;
  onProprietorUpdate: (id: string) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(
    row.original.approved_government
  );
  const [isRejected, setIsRejected] = useState(
    row.original.rejected_government
  );
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    setIsApproved(true);

    const result = await updateProprietorStatus(row.original.id, true, null,"Proprietor");
    if (result) {
      toast.success("Client approved successfully!");
      onProprietorUpdate(row.original.id);
      await confirmedProprietorNotification(row.original.id);
    } else {
      setIsApproved(false); 
      toast.error("Failed to approve the client. Please try again.");
    }
    setLoading(false);
    setIsApproveModalOpen(false);
  };

  const handleReject = async (reason: string) => {
    setLoading(true);
    setIsRejected(true);

    const result = await updateProprietorStatus(row.original.id, false, reason); 
    if (result) {
      toast.success("Client rejected successfully!");
      onProprietorUpdate(row.original.id);
      await rejectedProprietorNotification(row.original.id, reason);
    } else {
      setIsRejected(false); 
      toast.error("Failed to reject client. Please try again.");
    }
    setLoading(false);
    setIsRejectModalOpen(false);
  };

  if (isApproved) {
    return <span className="text-blue-500 font-bold">Approved</span>;
  }

  if (isRejected) {
    return (
      <div>
        <span className="text-red-500 font-bold">Rejected</span>
        {row.original.decline_reason && (
          <p className="text-sm text-gray-500 mt-1">
            Reason: {row.original.decline_reason}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-2">
      <Button
        variant="default"
        size="sm"
        onClick={() => setIsApproveModalOpen(true)}
      >
        Approve
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsRejectModalOpen(true)}
      >
        Reject
      </Button>

      <ApproveConfirmationModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        handleApprove={handleApprove}
      />

      <RejectConfirmationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        handleReject={handleReject}
      />
    </div>
  );
};

const GovernmentIDViewActionCell = ({ row }: { row: Row<NewProprietors> }) => {
  const { govIdUrl }: NewProprietors = row.original;

  const handleViewGovId = () => {
    if (govIdUrl) {
      window.open(govIdUrl, "_blank");
    } else {
      alert("Government ID not available.");
    }
  };

  return (
    <Button
      variant="link"
      className="dark:text-gray-400 underline"
      size="sm"
      onClick={handleViewGovId}
    >
      View Government ID
    </Button>
  );
};

export const columns = (
  handleProprietorUpdate: (id: string) => void
): ColumnDef<NewProprietors>[] => [
  {
    accessorKey: "proprietor_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Proprietor Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "cp_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
  },
  {
    accessorKey: "dob",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Birth" />
    ),
  },
  {
    accessorKey: "govIdUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Government ID" />
    ),
    cell: GovernmentIDViewActionCell,
  },
  {
    id: "actions",
    cell: (info) => (
      <NewProprietorsActionsCell
        row={info.row}
        onProprietorUpdate={handleProprietorUpdate}
      />
    ),
  },
];
