"use client";
import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export const getPaginatedAnnouncements = async (page = 1, limit = 10) => {
  try {
    const start = (page - 1) * limit;
    const end = page * limit - 1;

    const { data, error, count } = await supabase
      .from("announcement")
      .select("*", { count: "exact" })
      .range(start, end)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return { data, count };

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching announcements:", error.message);
    } else {
      console.error("Unknown error fetching announcements:", error);
    }
    return { data: [], count: 0 };
  }
};
