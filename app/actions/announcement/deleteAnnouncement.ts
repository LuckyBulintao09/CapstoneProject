import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const supabase = createClient();

export const deleteAnnouncement = async (announcementId: string) => {
  try {
    const { error } = await supabase
      .from("announcement")
      .delete()
      .eq("id", announcementId);

    if (error) {
      console.error("Failed to delete announcement:", error.message);
      toast.error("Failed to delete announcement. Please try again.");
      return { success: false, error };
    }

    toast.success("Announcement deleted successfully.");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    toast.error("An unexpected error occurred. Please try again.");
    return { success: false, error };
  }
};
