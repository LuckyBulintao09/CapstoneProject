import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import { sendMessageAfterReservation } from "../chat/sendMessageAfterReservation";
import { notifyProprietor } from "../email/notifyProprietor";
import { addTransactionAnalytics } from "../analytics/addTransactionAnalytics";
const supabase = createClient();

export const fetchUserData = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) {
    console.error("Error retrieving session:", error.message);
    return null;
  }
  return session?.user?.id || null;
};

export const checkExistingReservation = async (userId, unitId) => {
  const { data, error } = await supabase
    .from("transaction")
    .select("*")
    .eq("user_id", userId)
    .eq("unit_id", unitId)
    .in("transaction_status", ["pending", "reserved"]);

  if (error) {
    console.error("Error checking existing reservation:", error.message);
    return false;
  }

  return data.length > 0;
};

export const checkUnitReservationStatus = async (unitId) => {
  const { data, error } = await supabase
    .from("unit")
    .select("isReserved")
    .eq("id", unitId)
    .single();

  if (error) {
    console.error("Error checking unit reservation status:", error.message);
    return false;
  }

  return data.isReserved;
};

export const createReservation = async (
  userId,
  unitId,
  selectedService,
  date,
  guestNumber,
  paymentOption
) => {
  const formattedDate = format(date, "yyyy-MM-dd");
  const transactionStatus =
    selectedService === "Room Reservation" ? "reserved" : "pending";

  const { error: transactionError } = await supabase
    .from("transaction")
    .insert([{
      user_id: userId,
      service_option: selectedService,
      appointment_date: formattedDate,
      transaction_status: transactionStatus,
      isPaid: false,
      unit_id: unitId,
      guest_number: guestNumber,
      payment_option: paymentOption,
    }]);

  if (transactionError) {
    console.error("Error saving reservation:", transactionError.message);
    return { success: false, error: transactionError.message };
  }

  if (selectedService === "Room Reservation") {
    const { data: unitOccupants, error: unitOccupantsError } = await supabase
      .from("unit")
      .select("current_occupants")
      .eq("id", unitId)
      .single();
    
    let updatedOccupants = unitOccupants?.current_occupants + guestNumber;
    
    const { error: unitError } = await supabase
      .from("unit")
      .update({ isReserved: true, current_occupants: updatedOccupants })
      .eq("id", unitId);

    if (unitError) {
      console.error("Error updating unit reservation status:", unitError.message);
      return { success: false, error: unitError.message };
    }
  }


  const { data: unitData, error: unitDataError } = await supabase
    .from("unit")
    .select("property:property_id(company_id, title)") 
    .eq("id", unitId)
    .single(); 

  if (unitDataError) {
    console.error("Error fetching unit data:", unitDataError.message);
    return null;
  }

  const companyId = unitData?.property?.company_id;
  const propertyTitle = unitData?.property?.title;
  console.log("==================================");
  console.log("Company ID:", companyId);
  console.log("Property Title:", propertyTitle);
  console.log(companyId, selectedService, propertyTitle, formattedDate);

  await addTransactionAnalytics(companyId, selectedService, propertyTitle, formattedDate);
  
  await sendMessageAfterReservation(unitId, userId);

  const { data: ownerData, error: ownerDataError } = await supabase
    .from("unit")
    .select(`
      property:property_id (
        title,
        company:company_id (
          owner:owner_id (
            email
          )
        )
      )
    `)
    .eq("id", unitId)
    .single();

  if (ownerDataError) {
    console.error("Error fetching property owner data:", ownerDataError.message);
    return null;
  }

  const email = ownerData.property.company.owner.email;
  const propertyName = ownerData.property.title;
  const subject = `New ${selectedService} Reservation`;
  const message = `A new ${selectedService} service has been made for your unit in "${propertyName}".`;
  
  await notifyProprietor({ email, subject, message });

  return { success: true };
};
