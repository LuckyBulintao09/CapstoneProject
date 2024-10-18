"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "@/app/(auth)/(lessor-dashboard)/reservations/data-table";
import { columns, Transaction } from "./columns";
import { createClient } from "../../../../utils/supabase/client";

const supabase = createClient();

const getData = async (userId: string): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from("transaction")
    .select(
      `
      user_id,
      service_option,
      appointment_date,
      transaction_status,
      property:property_id(
        id,
        title,
        property_code,
        company:company_id(
          account:owner_id(
            firstname,
            lastname
          )
        )
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }

  return data as Transaction[];
};

const TransactionDashboard = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error);
        setIsLoading(false);
        return;
      }

      if (user) {
        setUserId(user.id);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) return;

      const transactionData = await getData(userId);
      setData(transactionData);
      setIsLoading(false);
    };

    fetchTransactions();
  }, [userId]);

  return (
    <div className="p-5 bg-white dark:bg-secondary h-full">
      <div className="mt-4 mb-4">
        <h1 className="font-semibold xs:text-xl sm:text-2xl md:text-3xl text-left dark:text-white">
          Transaction History
        </h1>
      </div>
      <div className="col-span-full">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </div>
    </div>
  );
};

export default TransactionDashboard;
