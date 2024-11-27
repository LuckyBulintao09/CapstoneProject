import { profanityList } from "../../../profanityList/profanityList";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getSessionUserId = async (): Promise<string | null> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.user?.id || null;
};

const censorProfanity = (comment: string): string => {
  let censoredComment = comment;

  for (const profaneWord of profanityList) {
    const regex = new RegExp(profaneWord, "gi");
    censoredComment = censoredComment.replace(
      regex,
      "*".repeat(profaneWord.length)
    );
  }

  return censoredComment;
};

export const addReview = async (
  unitId: string,
  userId: string,
  rating: number,
  comment: string,
  location: number,
  cleanliness: number,
  valueForMoney: number
) => {
  try {
    const sanitizedComment = censorProfanity(comment);

    const { error } = await supabase.from("ratings_review").insert([
      {
        unit_id: unitId,
        user_id: userId,
        ratings: rating,
        comment: sanitizedComment,
        isReported: false,
        location: location,
        cleanliness: cleanliness,
        value_for_money: valueForMoney,
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
  comment: string,
  location: number,
  cleanliness: number,
  valueForMoney: number
) => {
  try {
    const sanitizedComment = censorProfanity(comment);

    const { error } = await supabase
      .from("ratings_review")
      .update({
        ratings: rating,
        comment: sanitizedComment,
        location: location,
        cleanliness: cleanliness,
        value_for_money: valueForMoney,
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
export const fetchReviewData = async (unitId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from("ratings_review")
      .select("*")
      .eq("unit_id", unitId)
      .eq("user_id", userId)
      .single(); // Fetch a single review

    if (error) {
      console.error("Error fetching review data:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching review data:", error);
    return null;
  }
};
