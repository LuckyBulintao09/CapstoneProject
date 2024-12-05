"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { columns, NewProprietors } from "./columns";
import { getPendingProprietors } from "@/actions/admin/getPendingProprietors";
import { format } from "date-fns";

const NewProprietorsDashboard = ({ onCountUpdate }) => {
  const [data, setData] = useState<NewProprietors[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPendingProprietors = async () => {
      setLoading(true);
      const pendingProprietors = await getPendingProprietors();
      if (pendingProprietors) {
        const mappedData = pendingProprietors.map((proprietor) => ({
          id: proprietor.id,
          proprietor_name: `${proprietor.firstname} ${proprietor.lastname}`,
          email: proprietor.email,
          cp_number: proprietor.cp_number,
          dob: proprietor.dob,
          govIdUrl: proprietor.government_ID_url,
          updatedAt: proprietor.updated_at
          ? format(new Date(proprietor.updated_at), "MMMM dd, yyyy")
            : "",
        }));
        setData(mappedData);
        onCountUpdate?.(mappedData.length);
      }
      setLoading(false);
    };

    fetchPendingProprietors();
  }, []);

  const handleProprietorUpdate = (proprietorId: string) => {
    setData((prevData) =>
      prevData.filter((proprietor) => proprietor.id !== proprietorId)
    );
    onCountUpdate(data.length - 1);
  };

  return (
    <DataTable
      columns={columns(handleProprietorUpdate)}
      data={data}
      loading={loading}
    />
  );
};

export default NewProprietorsDashboard;
