"use server"
import { createClient } from "@/utils/supabase/server";
import { dataFocusVisibleClasses } from "@nextui-org/theme";
import { useEffect } from "react";

const supabase = createClient();

// FIX THIS ONE ON BOOKING CARD
// export const checkReservationConflict = async (userId: string) => {
//   try {
//     const { data: onSiteReservations, error: onSiteError } = await supabase
//       .from("transaction")
//       .select("id, created_at, unit_id")
//       .eq("user_id", userId)
//       .eq("service_option", "On-Site Visit");

//     if (onSiteError) {
//       console.error("Error fetching On-Site Visit transactions:", onSiteError);
//       throw onSiteError;
//     }

//     if (!onSiteReservations || onSiteReservations.length === 0) {
//       console.log("No pending On-Site Visit reservations found.");
//       return [];
//     }

//     const conflictMessages = [];

//     for (const reservation of onSiteReservations) {
//       const {
//         id: onSiteId,
//         unit_id: unitId,
//         created_at: createdAt,
//       } = reservation;

//       const { data: conflictingReservations, error: conflictError } =
//         await supabase
//           .from("transaction")
//           .select("created_at")
//           .eq("unit_id", unitId)
//           .eq("service_option", "Room Reservation")
//           .neq("user_id", userId);

//       if (conflictError) {
//         console.error(
//           `Error checking for conflicting Room Reservation for unit ${unitId}:`,
//           conflictError
//         );
//         throw conflictError;
//       }

//       if (conflictingReservations && conflictingReservations.length > 0) {
//         const reservedDate = new Date(conflictingReservations[0].created_at);
//         const formattedDate = reservedDate.toLocaleDateString();

//         const { data: unitData, error: unitError } = await supabase
//           .from("unit")
//           .select("title")
//           .eq("id", unitId)
//           .single();

//         if (unitError) {
//           console.error(
//             `Error fetching unit title for unit ${unitId}:`,
//             unitError
//           );
//           throw unitError;
//         }

//         const unitTitle = unitData?.title || "the unit";

//         const { error: updateError } = await supabase
//           .from("transaction")
//           .update({ transaction_status: "cancelled" })
//           .eq("id", onSiteId);

//         if (updateError) {
//           console.error(
//             `Error updating transaction status for On-Site Visit ${onSiteId}:`,
//             updateError
//           );
//           throw updateError;
//         }

//         conflictMessages.push({
//           message: `We regret to inform you that your transaction for the unit ${unitTitle} on ${formattedDate} has been cancelled, as the unit has now been reserved by another user.`,
//           unitId: unitId,
//         });
//       }
//     }
//     return conflictMessages;
//   } catch (error) {
//     console.error("Error checking reservation conflict:", error);
//     return [];
//   }
// };

export const fetchNotifications = async (userId : string) => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("receiver_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export const reservationNotification = async (
    userId : string, 
    propertyTitle : string, 
    unitTitle : string
  ) => {
  const { data, error } = await supabase
    .from("notifications")
    .insert({ receiver_id: userId, text: `Transaction: Room Reservation for ${propertyTitle} - ${unitTitle}` });
  if (error) throw error;
}

export const onsiteNotification = async (
    userId : string, 
    propertyTitle : string, 
    unitTitle : string
  ) => {
  const { data, error } = await supabase
    .from("notifications")
    .insert({ receiver_id: userId, text: `Transaction: Onsite Visit for ${propertyTitle} - ${unitTitle}` });
  if (error) throw error;
}

export const cancel_onsiteNotification = async (
    unitID : number,
    senderID: string
  ) => {
    const {data: property_id, error: propertyIdError} = await supabase
      .from("unit")
      .select("property_id, title")
      .eq("id", unitID)

    const {data: property_title, error: propertyTitleError} = await supabase
      .from("property")
      .select("company_id,title")
      .eq("id", property_id[0].property_id)

    const {data: receiver_id, error: receiverIdError} = await supabase
      .from("company")
      .select("owner_id")
      .eq("id", property_title[0].company_id)
    
    const { data, error } = await supabase
      .from("notifications")
      .insert({ receiver_id: receiver_id[0].owner_id, text: `Transaction: Onsite Visit Cancelled for ${property_title[0].title} - ${property_id[0].title}` });
    if (error) throw error;
}

export const confirm_onsiteNotification = async (
    unitID : number,
    receiver_id: string
  ) => {
    const {data: property_id, error: propertyIdError} = await supabase
      .from("unit")
      .select("property_id, title")
      .eq("id", unitID)

    const {data: property_title, error: propertyTitleError} = await supabase
      .from("property")
      .select("title")
      .eq("id", property_id[0].property_id)
    
    const { data, error } = await supabase
      .from("notifications")
      .insert({ receiver_id: receiver_id, text: `Your Onsite Visit is confirmed and reserved for ${property_title[0].title} - ${property_id[0].title}` });
    if (error) throw error;
}

export const cancelled_onsiteNotification = async (
    unitID : number,
    receiver_id: string[]
  ) => {
    const {data: unitData, error: propertyIdError} = await supabase
      .from("unit")
      .select("property_id, title")
      .eq("id", unitID)
      .single()
    
    const {data: propertyData, error: propertyTitleError} = await supabase
      .from("property")
      .select("title")
      .eq("id", unitData.property_id)
      .single()
    
      const notifications = receiver_id.map(userId => ({
        receiver_id: userId,
        text: `Cancelled: Someone has reserved your Onsite Visit for ${propertyData.title} - ${unitData.title}`,
      }));
    
      const { data, error } = await supabase
        .from("notifications")
        .insert(notifications);
}

export const cancel_lessorNotification = async (
  receiver_id: string,
  unit_id: number
) => {
  const { data: UnitData, error: UnitDataError } = await supabase
    .from('unit')
    .select('title, property_id')
    .eq("id", unit_id)
    .single()
  
  const {data: PropertyData, error: PropertyDataError} = await supabase
    .from("property")
    .select("title")
    .eq("id", UnitData.property_id)
    .single()

  const { data, error } = await supabase
    .from("notifications")
    .insert({ receiver_id: receiver_id, text: `Proprietor has cancelled your Onsite Visit for ${PropertyData.title} - ${UnitData.title}` });
  if (error) throw error;
}

//admin status update
