import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }
  return data.user?.id || null;
};

export const checkReservationConflict = async (userId: string) => {
  try {
    const { data: onSiteReservations, error: onSiteError } = await supabase
      .from("transaction")
      .select("id, created_at, unit_id")
      .eq("user_id", userId)
      .eq("service_option", "On-Site Visit");

    if (onSiteError) {
      console.error("Error fetching On-Site Visit transactions:", onSiteError);
      throw onSiteError;
    }

    if (!onSiteReservations || onSiteReservations.length === 0) {
      console.log("No pending On-Site Visit reservations found.");
      return [];
    }

    const conflictMessages = [];

    for (const reservation of onSiteReservations) {
      const {
        id: onSiteId,
        unit_id: unitId,
        created_at: createdAt,
      } = reservation;

      const { data: conflictingReservations, error: conflictError } =
        await supabase
          .from("transaction")
          .select("created_at")
          .eq("unit_id", unitId)
          .eq("service_option", "Room Reservation")
          .neq("user_id", userId);

      if (conflictError) {
        console.error(
          `Error checking for conflicting Room Reservation for unit ${unitId}:`,
          conflictError
        );
        throw conflictError;
      }

      if (conflictingReservations && conflictingReservations.length > 0) {
        const reservedDate = new Date(conflictingReservations[0].created_at);
        const formattedDate = reservedDate.toLocaleDateString();

        const { data: unitData, error: unitError } = await supabase
          .from("unit")
          .select("title")
          .eq("id", unitId)
          .single();

        if (unitError) {
          console.error(
            `Error fetching unit title for unit ${unitId}:`,
            unitError
          );
          throw unitError;
        }

        const unitTitle = unitData?.title || "the unit";

        const { error: updateError } = await supabase
          .from("transaction")
          .update({ transaction_status: "cancelled" })
          .eq("id", onSiteId);

        if (updateError) {
          console.error(
            `Error updating transaction status for On-Site Visit ${onSiteId}:`,
            updateError
          );
          throw updateError;
        }

        conflictMessages.push({
          message: `We regret to inform you that your transaction for the unit ${unitTitle} on ${formattedDate} has been cancelled, as the unit has now been reserved by another user.`,
          unitId: unitId,
        });
      }
    }
    return conflictMessages;
  } catch (error) {
    console.error("Error checking reservation conflict:", error);
    return [];
  }
};
