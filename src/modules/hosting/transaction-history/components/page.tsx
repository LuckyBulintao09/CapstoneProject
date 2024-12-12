"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/table/data-table";
import { columns as generateColumns, Transaction } from "./columns";
import { createClient } from "@/utils/supabase/client";
import { getTransactionHistory } from "@/actions/transaction/getTransactionHistory";
import { cancel_lessorNotification, cancelled_onsiteNotification, confirm_onsiteNotification, expireContractNotification } from "@/actions/notification/notification";
import CustomBreadcrumbs from "../../components/CustomBreadcrumbs";
import CreateTransactionModal from "./CreateTransactionModal";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const supabase = createClient();

const TransactionDashboard = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  //check if there are nearing end of contract
  // useEffect(() => {
  //   const fetchExpiringTransactions = async () => {
  //     const user = await supabase.auth.getUser();
  //     await expireContractNotification(user.data.user.id);
  //   };
  //   fetchExpiringTransactions();
  // }, [])

  const fetchTransactionHistory = async () => {
    setLoading(true);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData?.user)
        throw new Error("User not authenticated");

      const userId = userData.user.id;
      const transactionHistory = await getTransactionHistory(userId);

      if (transactionHistory.length > 0) {
        const updatedTransactions = await Promise.all(
          transactionHistory.map(async (transaction) => {
            if (
              transaction.unit?.[0]?.isReserved &&
              transaction.transaction_status === "pending"
            ) {
              const { error: cancelError } = await supabase
                .from("transaction")
                .update({ transaction_status: "cancelled" })
                .eq("id", transaction.id);

              if (cancelError) {
                setError(
                  `Failed to cancel transaction for unit ID ${transaction.unit[0].id}`
                );
              } else {
                return { ...transaction, transaction_status: "cancelled" };
              }
            }
            return transaction;
          })
        );
        setData(updatedTransactions as Transaction[]);
      } else {
        setError("No transactions found for this user.");
      }
    } catch (err: any) {
      setError(
        err.message || "Failed to load transactions due to an unexpected error."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const updateTransactionStatus = async (
    id: number,
    newStatus: string,
    unitId: number,
    reason?: string
  ) => {
    try {
      const { data: receiver_id, error: receiverIdError } = await supabase
        .from("transaction")
        .select("user_id")
        .eq("id", id)


      const { error: updateError } = await supabase
        .from("transaction")
        .update({ transaction_status: newStatus })
        .eq("id", id);
      
      if (newStatus === "cancelled") {
        await cancel_lessorNotification(receiver_id[0].user_id, unitId)
      }

      if (updateError) {
        setError(`Failed to update status for transaction ID ${id}`);
        return;
      }

      // if (newStatus === "reserved") {
      //   const { data: transactionData, error: transactionDataError } = await supabase
      //       .from("transaction")
      //       .select("guest_number")
      //       .eq("id", id)
      //       .single();
        
      //   const { data: unitCurrentOccupants, error: unitCurrentOccupantsError } = await supabase
      //       .from("unit")
      //       .select("current_occupants")
      //       .eq("id", unitId)
      //       .single();
        
      //   let updatedOccupants = transactionData?.guest_number + unitCurrentOccupants?.current_occupants;

      //   const { error: unitUpdateError } = await supabase
      //     .from("unit")
      //     .update({ isReserved: true, current_occupants: updatedOccupants  })
      //     .eq("id", unitId);

      //     await confirm_onsiteNotification(unitId, receiver_id[0].user_id)

      //   if (unitUpdateError) {
      //     setError(`Failed to update reserved status for unit ID ${unitId}`);
      //     return;
      //   }

      //   const { data: updatedRows, error: cancelOtherError } = await supabase
      //     .from("transaction")
      //     .update({ transaction_status: "cancelled" })
      //     .eq("unit_id", unitId)
      //     .eq("transaction_status", "pending")
      //     .neq("id", id)
      //     .select()
        
      //   await cancelled_onsiteNotification(unitId, updatedRows.map((row) => row.user_id))
          

      //   if (cancelOtherError) {
      //     setError(
      //       `Failed to cancel other pending transactions for unit ID ${unitId}`
      //     );
      //     return;
      //   }
      // }

      await fetchTransactionHistory();
    } catch (err: any) {
      setError(
        "Unexpected error occurred while updating the transaction status."
      );
    }
  };

  return (
		<div className='px-32 md:px-24 sm:px-20 xs:px-10 p-5 bg-background dark:bg-secondary h-screen'>
			{/* <HostingTransactionBreadcrumb active='Transactions' /> */}
      <CustomBreadcrumbs />
			<div className='flex mt-1 mb-4 justify-between'>
				<h1 className='font-semibold xs:text-xl sm:text-2xl md:text-3xl text-left dark:text-white'>
					Booking Transactions
				</h1>
          <div className='flex justify-end'>
            <Button
              className='flex justify-center items-center border bg-white dark:bg-secondary dark:border-gray-300 border-black text-black dark:text-white'
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={20}/>
            </Button>
          </div>
          <CreateTransactionModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={(newTransactionData) => {
              // Handle new transaction data submission
              setIsCreateModalOpen(false);
              fetchTransactionHistory(); // Refresh transaction history
            }}
          />
			</div>
			<div className='col-span-full'>
				{error ? (
					<p className='text-red-500'>{error}</p>
				) : (
					<DataTable
						columns={generateColumns(updateTransactionStatus)}
						data={data}
						loading={loading}
					/>
				)}
			</div>
		</div>
	);
};

export default TransactionDashboard;
