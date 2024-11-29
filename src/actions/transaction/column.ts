import { createClient } from "@/utils/supabase/client";
import { notifyProprietor } from "../email/notifyProprietor";

const supabase = createClient();

export const fetchReviewData = async (unitId: number, userId: string) => {
  try {
    const { data, error } = await supabase
      .from("ratings_review")
      .select("*")
      .eq("unit_id", unitId)
      .eq("user_id", userId)
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching review:", error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error("An error occurred while fetching the review:", error);
    return null;
  }
};

export const deleteReview = async (reviewId: number) => {
  try {
    const { error } = await supabase
      .from("ratings_review")
      .delete()
      .eq("id", reviewId);

    if (error) {
      console.error("Error deleting review:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("An error occurred while deleting the review:", error);
    return false;
  }
};

export const cancelTransaction = async (transactionId: number, unitId: number) => {
  try {
    const { error: transactionError } = await supabase
      .from("transaction")
      .update({ transaction_status: "cancelled" })
      .match({ id: transactionId });

    if (transactionError) throw new Error("Error cancelling transaction");

    const { data, error } = await supabase
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

    if (error || !data?.property?.company?.owner?.email) {
      throw new Error("Error retrieving owner email");
    }

    const email = data.property.company.owner.email;
    const subject = "Transaction Cancelled";
    const message = `A transaction for your unit in ${data.property.title} has been cancelled.`;
    await notifyProprietor({email, subject, message});

    console.log("Email sent to:", email);
    return true;
  } catch (error) {
    console.error("Error:", error.message);
    return false;
  }
};