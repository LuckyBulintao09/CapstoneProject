import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const supabase = createClient();

export async function createCardAction(
  title: string,
  shortDescription: string,
  thumbnailImage: File
) {
  try {
    const filePath = `cards/${Date.now()}_${thumbnailImage.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("thumbnails")
      .upload(filePath, thumbnailImage);

    if (uploadError) {
      toast.error("Failed to upload thumbnail.");
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("thumbnails")
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      toast.error("Failed to retrieve thumbnail URL.");
      return;
    }

    const thumbnailUrl = publicUrlData.publicUrl;

    const { data: cardData, error: insertError } = await supabase
      .from("card")
      .insert({
        title,
        short_description: shortDescription,
        thumbnail_url: thumbnailUrl,
      });

    if (insertError) {
      toast.error("Failed to create card.");
      return;
    }
  
    
    return { cardData, success: true };
  } catch (error) {
    toast.error("An unexpected error occurred.");
    return { success: false }; 
  }
}
