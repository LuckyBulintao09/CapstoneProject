// TransactionDashboard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "@/app/(auth)/(lessor-dashboard)/reservations/data-table";
import { columns as generateColumns, Transaction } from "./columns";
import { getTransactionHistory } from "@/actions/transaction/getTransactionHistory";

const TransactionDashboard = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      setLoading(true);
      const transactionHistory = await getTransactionHistory();

      const mappedData =
        transactionHistory?.map((transaction) => ({
          ...transaction,
          client_name: `${transaction.account.firstname} ${transaction.account.lastname}`,
          unit_title: `${transaction.unit.title}`,
        })) || [];

      setData(mappedData);
      setLoading(false);
    };
    fetchTransactionHistory();
  }, []);

  const updateTransactionStatus = (id: number, newStatus: string) => {
    setData((prevData) =>
      prevData.map((transaction) =>
        transaction.id === id
          ? { ...transaction, transaction_status: newStatus }
          : transaction
      )
    );
  };

  return (
    <div className="p-5 bg-white dark:bg-secondary h-full">
      <div className="mt-4 mb-4">
        <h1 className="font-semibold xs:text-xl sm:text-2xl md:text-3xl text-left dark:text-white">
          Transaction History
        </h1>
      </div>
      <div className="col-span-full">
        <DataTable
          columns={generateColumns(updateTransactionStatus)}
          data={data}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default TransactionDashboard;
