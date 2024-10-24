import { createClient } from "../../../supabase/client";

const supabase = createClient();

export const updateInbox = async (
  senderId: string,
  receiverId: string,
  message: string
) => {
  if (!senderId || !receiverId || !message) {
    console.error("Invalid input data for updating inbox.");
    return;
  }

  console.log(`senderId: ${senderId}, receiverId: ${receiverId}`);
  console.log(`message: ${message}`);

  const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });

  try {
    const { data, error } = await supabase
      .from("conversations")
      .update({
        updated_at: currentTime, 
        last_message: message,
      })
      .or(`id.eq.${senderId}_${receiverId},id.eq.${receiverId}_${senderId}`);

    if (error) {
      throw error;
    }

    console.log("Inbox updated successfully", data);
  } catch (error) {
    console.error("Error updating conversations:", error.message);
  }
};
