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
    console.log(`Checking conflicts for user: ${userId}`);

    const { data: onSiteReservations, error: onSiteError } = await supabase
      .from("transaction")
      .select("id, created_at, unit_id")
      .eq("user_id", userId)
      .eq("service_option", "On-Site Visit")
      .eq("transaction_status", "pending");

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
      const { unit_id: unitId, created_at: createdAt } = reservation;

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

        conflictMessages.push({
          message: `The unit ${unitTitle} that you transacted at ${formattedDate} has now been reserved.`,
          unitId: unitId,
        });
      }
    }

    console.log("Conflicting reservations found:", conflictMessages);
    return conflictMessages;
  } catch (error) {
    console.error("Error checking reservation conflict:", error);
    return [];
  }
};
