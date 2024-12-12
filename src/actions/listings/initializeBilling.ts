"use server"
import { createClient } from "@/utils/supabase/server";
const supabase = createClient();

export const initializeBilling = async (companyId: string,selectedService: string,ownerEmail: string, amount: number,propertyTitle: string,company_name: string,transactionId: string,userId: string,unitId: string) => {

    const clientName = await supabase.from("account").select("firstname,lastname").eq("id", userId).single();
    const unitName = await supabase.from("unit").select("title").eq("id", unitId).single();

    console.log("Initialize billing called", "selectedService:", selectedService, "ownerEmail:", ownerEmail, "amount:", amount, "propertyTitle:", propertyTitle);
    const amountToBeCollected = amount * 0.03;
    const { data, error } = await supabase.from("company_billing").insert([{ company_id: companyId, service: selectedService, owner_email: ownerEmail, amount: amount, property_title: propertyTitle,company_name,amountToBeCollected,transaction_id:transactionId,tenant:`${clientName.data.firstname} ${clientName.data.lastname}`,unit:unitName.data.title}]);

    if (error) {
        console.error("Error initializing billing:", error.message);
        return { success: false, error: error.message };
    } else {
        console.log("Billing initialized successfully:", data);
        return { success: true, data };
    }
}