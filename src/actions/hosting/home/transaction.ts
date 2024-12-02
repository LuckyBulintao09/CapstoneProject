"use server"
import { createClient } from "@/utils/supabase/server";

const supabase = createClient();

export const getArrivingSoon = async () => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    const userId = userData?.user.id

    const { data: units, error: unitError } = await supabase
        .from("company")
        .select(`
            property (
            unit (id)
            )
        `)
        .eq("owner_id", userId);
    
    const unitIDs = units
        .flatMap(company => company.property)
        .flatMap(property => property.unit)
        .map(unit => unit.id);
  
    const { data, error } = await supabase
        .from("transaction")
        .select(`*, account:user_id(firstname, lastname)`)
        .lt("appointment_date", endDate.toISOString())
        .in("unit_id", unitIDs)
        .neq("transaction_status", "cancelled")

    return data;
};
