"use client";
import React, { useState, useEffect } from "react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Switch } from "@nextui-org/react";
import { DataTableColumnHeader } from "@/components/table/data-column-header";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { createClient } from "@/utils/supabase/client";
import PropertyModal from "../components/PropertyModal";

const supabase = createClient();

export type PropertyListing = {
  id: string;
  company_name: string;
  proprietor_name: string;
  property_title: string;
  businessPermitUrl: string;
  fireInspectionUrl: string;
  propertyImageUrls?: string[];
  createdAt: string;
  isApproved: boolean;
  dueDate?: string | null;
};

const BusinessPermitViewActionCell = ({
  row,
}: {
  row: Row<PropertyListing>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertyImageUrls, setPropertyImageUrls] = useState<string[]>([]);

  const { id, businessPermitUrl, fireInspectionUrl } = row.original;

  const handleOpenModal = () => {
    setIsModalOpen(true);
    fetchPropertyImages();
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const fetchPropertyImages = async () => {
    try {
      const { data, error } = await supabase
        .from("property")
        .select("property_image")
        .eq("id", id);
      if (!error && data?.length > 0) {
        setPropertyImageUrls(data[0]?.property_image || []);
      }
    } catch (error) {
      console.error("Error fetching property images:", error);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="text-blue-600 underline dark:text-blue-400"
      >
        View Documents
      </button>
      <PropertyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        propertyId={id}
        businessPermitUrl={businessPermitUrl}
        fireInspectionUrl={fireInspectionUrl}
        propertyImageUrls={propertyImageUrls}
      />
    </>
  );
};

const PropertyListingActionsCell = ({
  row,
  onPropertyUpdate,
}: {
  row: Row<PropertyListing>;
  onPropertyUpdate: (id: string, isApproved: boolean) => void;
}) => {
  const [isApproved, setIsApproved] = useState(row.original.isApproved);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsApproved(row.original.isApproved);
  }, [row.original.isApproved]);

  const handleApprovalToggle = async (newValue: boolean) => {
    setIsApproved(newValue);
    setLoading(true);

    try {
      const updates: Partial<PropertyListing> = { isApproved: newValue };

      if (newValue) {
        const dueDate = new Date();
        dueDate.setFullYear(dueDate.getFullYear() + 2);
        updates.due_date = dueDate.toISOString();
      } else {
        updates.due_date = null;
      }

      const { error } = await supabase
        .from("property")
        .update(updates)
        .eq("id", row.original.id);

      if (error) {
        console.error("Error updating approval status:", error);
        setIsApproved(!newValue);
      } else {
        onPropertyUpdate(row.original.id, newValue);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setIsApproved(!newValue);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      isSelected={isApproved}
      size="lg"
      color={isApproved ? "success" : "error"}
      onValueChange={(value) => !loading && handleApprovalToggle(value)}
      startContent={<CheckIcon className="h-5 w-5 text-green-500" />}
      endContent={<XMarkIcon className="h-5 w-5 text-red-500" />}
    />
  );
};

export const columns = (
  handlePropertyUpdate: (id: string, isApproved: boolean) => void
): ColumnDef<PropertyListing>[] => [
  {
    accessorKey: "proprietor_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Proprietor Name" />
    ),
    cell: ({ row }) => <div>{row.original.proprietor_name}</div>,
  },
  {
    accessorKey: "company_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company Name" />
    ),
    cell: ({ row }) => <div>{row.original.company_name}</div>,
  },
  {
    accessorKey: "property_title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Property Title" />
    ),
    cell: ({ row }) => <div>{row.original.property_title}</div>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => <div>{row.original.createdAt}</div>,
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => <div>{row.original.dueDate || "N/A"}</div>,
  },
  {
    accessorKey: "businessPermitUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Documents" />
    ),
    cell: BusinessPermitViewActionCell,
  },
  {
    id: "actions",
    cell: (info) => (
      <PropertyListingActionsCell
        row={info.row}
        onPropertyUpdate={handlePropertyUpdate}
      />
    ),
  },
];
