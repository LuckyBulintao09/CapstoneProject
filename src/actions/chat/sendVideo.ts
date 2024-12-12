import { createClient } from "@/utils/supabase/client";
import { updateInbox } from "./updateInbox";
import { toast } from "sonner";

const supabase = createClient();

interface SendVideoParams {
  userId: string;
  receiverId: string;
  conversationId: string;
  videoFile: File; 
  setMessages: React.Dispatch<React.SetStateAction<any[]>>; 
}

export const sendVideo = async (
  {
    userId,
    receiverId,
    conversationId,
    videoFile,
    setMessages,
  }: SendVideoParams
) => {
  if (!conversationId) {
    console.error("Conversation ID is not set.");
    return;
  }

  if (!videoFile) {
    toast.error("No video file selected.");
    return;
  }

  console.log("Attempting to upload video file:", videoFile);

  try {
    const filePath = `videos/${userId}/${videoFile.name}`;
    console.log("Uploading video to file path:", filePath);

    const { data, error: uploadError } = await supabase
      .storage
      .from("videos")
      .upload(`${userId}/${videoFile.name}`, videoFile, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading video:", uploadError);
      toast.error("Error uploading video. Please try again.");
      return;
    }

    console.log("Upload successful, data:", data);

    const { data: publicUrlData, error: publicUrlError } =
      await supabase.storage.from("videos").getPublicUrl(data.path);

    if (publicUrlError) {
      console.error("Error getting public URL:", publicUrlError);
      toast.error("Error retrieving video URL.");
      return;
    }

    const videoUrl = publicUrlData.publicUrl;

    console.log("Generated video URL:", videoUrl);

    if (!videoUrl) {
      toast.error("Error retrieving video URL.");
      return;
    }

    const { data: messageData, error: messageError } = await supabase
      .from("messages")
      .insert([
        {
          sender_id: userId,
          receiver_id: receiverId,
          content: videoUrl,
          conversation_id: conversationId,
          created_at: new Date(),
        },
      ]);

    if (messageError) {
      console.error("Error sending message:", messageError);
      toast.error("Error sending message. Please try again.");
      return;
    }

    console.log("Message sent successfully:", messageData);

    const messageContentUpdate = "Sent a video.";
    await updateInbox(userId, receiverId, messageContentUpdate);

    if (messageData && messageData.length > 0) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...messageData[0], sender_id: userId },
      ]);
    }
  } catch (error) {
    console.error("Error sending video message:", error);
    toast.error("Error sending message. Please try again.");
  }
};