// transactionService.ts
import { createClient } from "@/utils/supabase/client";

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

export const cancelTransaction = async (transactionId: number) => {
  try {
    const { error } = await supabase
      .from("transaction")
      .delete()
      .match({ id: transactionId });

    if (error) {
      console.error("Error cancelling transaction:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("An error occurred while cancelling the transaction:", error);
    return false;
  }
};
