import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getSessionUserId = async (): Promise<string | null> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.user?.id || null;
};

export const addReview = async (
  unitId: string,
  userId: string,
  rating: number,
  comment: string
) => {
  try {
    const { error } = await supabase.from("ratings_review").insert([
      {
        unit_id: unitId,
        user_id: userId,
        ratings: rating,
        comment: comment,
        isReported: false,
      },
    ]);

    if (error) {
      console.error("Error adding review:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error adding review:", error);
    return false;
  }
};

export const updateReview = async (
  reviewId: number,
  rating: number,
  comment: string
) => {
  try {
    const { error } = await supabase
      .from("ratings_review")
      .update({
        ratings: rating,
        comment: comment,
      })
      .eq("id", reviewId);

    if (error) {
      console.error("Error updating review:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error updating review:", error);
    return false;
  }
};
