"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "@/app/(auth)/(lessor-dashboard)/reservations/data-table";
import { columns, Transaction } from "./columns";
import { createClient } from "../../../../utils/supabase/client";

const supabase = createClient();

async function getData(): Promise<Transaction[]> {
  const { data, error } = await supabase.from("transaction").select(`
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
    `);

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
  return data as Transaction[];
}

const TransactionDashboard = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPropertyCode, setSelectedPropertyCode] = useState<
    string | null
  >(null); // Store the property_code for review
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const transactionData = await getData();
      setData(transactionData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="p-5 bg-white dark:bg-secondary h-full">
      <div className="mt-4">
        <div className="mb-4">
          <h1 className="font-semibold xs:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl text-left dark:text-white">
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
    </div>
  );
};

export default TransactionDashboard;
