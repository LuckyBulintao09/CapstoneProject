import { profanityList } from "../../../profanityList/profanityList";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner"; // assuming you're using the `sonner` library for toast notifications

const supabase = createClient();

export const getSessionUserId = async (): Promise<string | null> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.user?.id || null;
};

const detectProfanity = (comment: string): string[] => {
  const profaneWordsFound: string[] = [];

  for (const profaneWord of profanityList) {
    const regex = new RegExp(`\\b${profaneWord}\\b`, "gi");
    if (regex.test(comment)) {
      profaneWordsFound.push(profaneWord);
    }
  }

  return profaneWordsFound;
};

export const addReview = async (
  unitId: string,
  userId: string,
  rating: number,
  comment: string,
  location: number,
  cleanliness: number,
  valueForMoney: number,
  transactionId: number
) => {
  try {
    const profaneWords = detectProfanity(comment);

    if (profaneWords.length > 0) {
      toast.error(`Profane words detected: ${profaneWords.join(", ")}`);
      return false;
    }

    const { error } = await supabase.from("ratings_review").insert([
      {
        unit_id: unitId,
        user_id: userId,
        ratings: rating,
        comment: comment, 
        isReported: false,
        location: location,
        cleanliness: cleanliness,
        value_for_money: valueForMoney,
        transaction_id: transactionId
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
    const profaneWords = detectProfanity(comment);

    if (profaneWords.length > 0) {
      toast.error(`Profane words detected: ${profaneWords.join(", ")}`);
      return false;
    }

    const { error } = await supabase
      .from("ratings_review")
      .update({
        ratings: rating,
        comment: comment, 
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
      .single(); 

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
