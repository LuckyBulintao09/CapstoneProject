"use server"
import { createClient } from "@/utils/supabase/server";
const supabase = createClient();

export const initializeBilling = async (companyId: string,selectedService: string,ownerEmail: string, amount: number,propertyTitle: string,company_name: string,transactionId: string) => {
    console.log("Initialize billing called", "selectedService:", selectedService, "ownerEmail:", ownerEmail, "amount:", amount, "propertyTitle:", propertyTitle);
    const amountToBeCollected = amount * 0.03;
    const { data, error } = await supabase.from("company_billing").insert([{ company_id: companyId, service: selectedService, owner_email: ownerEmail, amount: amount, property_title: propertyTitle,company_name,amountToBeCollected,transaction_id:transactionId }]);

    if (error) {
        console.error("Error initializing billing:", error.message);
        return { success: false, error: error.message };
    } else {
        console.log("Billing initialized successfully:", data);
        return { success: true, data };
    }
}