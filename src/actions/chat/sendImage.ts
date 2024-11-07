import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { sendImageAsMessage } from "./sendImageAsMessage";
const supabase = createClient();

export default async function sendImage(userId: string, receiverId: string, conversationId: string, selectedFile: File, setMessages: React.Dispatch<React.SetStateAction<any[]>>) {
    console.log(selectedFile.name);

    const bucketName = "unihomes image storage";  
    const folderName = "chat-images";  
    const fileExtension = selectedFile.name.split('.').pop(); 
    const sanitizedFileName = selectedFile.name.replace(/\s+/g, '_'); 
    const uniqueFileName = `${userId}-${conversationId}-${Date.now()}.${fileExtension}`;
    const filePath = `${folderName}/${uniqueFileName}`;

    const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, selectedFile);

    if (uploadError) {
        console.error("Error uploading file:", uploadError.message);
        toast.error("Error uploading the image.");
        return;
    }

    const { data: publicUrlData, error: urlError } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    if (urlError) {
        console.error("Error getting public URL:", urlError.message);
        toast.error("Error getting the image URL.");
        return;
    }

    if (!publicUrlData?.publicUrl) {
        console.error("Public URL is undefined");
        toast.error("Failed to retrieve public URL.");
        return;
    }

    const messageContent = publicUrlData.publicUrl;

    const messageData = await sendImageAsMessage({
        userId: userId,
        receiverId: receiverId,
        conversationId: conversationId,
        messageContent: messageContent, 
        setMessages: setMessages 
    });

    console.log("Message with image sent:", messageData);
    toast.success("Image sent successfully");
}
