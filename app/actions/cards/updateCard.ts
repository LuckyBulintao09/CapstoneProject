import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const supabase = createClient();

export const updateCardAction = async (
  cardId: string, 
  { title, shortDescription, thumbnailFile, thumbnail_url }: { 
    title: string; 
    shortDescription: string; 
    thumbnailFile?: File | null; 
    thumbnail_url?: string | null;
  }
): Promise<void> => {
  try {
    console.log("cardId:", cardId);
    console.log("title:", title);
    console.log("shortDescription:", shortDescription);
    console.log("thumbnailFile:", thumbnailFile);
    console.log("thumbnail_url:", thumbnail_url);

    let thumbnailUrl = thumbnail_url;

    if (thumbnailFile) {
      if (thumbnail_url) {
        const imageName = extractImageName(thumbnail_url);
        const { error } = await supabase
          .storage
          .from("thumbnails")
          .remove([`cards/${imageName}`]);

        if (error) {
          console.error("Error deleting existing thumbnail:", error);
          toast.error("Failed to delete the existing thumbnail.");
        } else {
          console.log("Existing thumbnail deleted successfully.");
        }
      }

      const filePath = `cards/${Date.now()}_${thumbnailFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("thumbnails")
        .upload(filePath, thumbnailFile);

      if (uploadError || !uploadData) {
        console.error("Upload error:", uploadError);
        toast.error("Failed to upload new thumbnail.");
      } else {
        const { data: publicUrlData } = supabase.storage
          .from("thumbnails")
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          thumbnailUrl = publicUrlData.publicUrl;
          console.log("New thumbnail URL:", thumbnailUrl);
        } else {
          toast.error("Failed to retrieve new thumbnail URL.");
        }
      }
    }

    const { error: updateError } = await supabase
      .from("card")
      .update({
        title,
        short_description: shortDescription,
        thumbnail_url: thumbnailUrl,
      })
      .eq("id", cardId);

    if (updateError) {
      toast.error("Failed to update card.");
      console.error("Update error:", updateError);
    } else {
      toast.success("Card updated successfully!");
    }
  } catch (error) {
    toast.error("An unexpected error occurred.");
    console.error("Error in updateCardAction:", error);
  } finally {
    window.location.href = "/protected/admin/dashboard";
  }
};

function extractImageName(url: string): string {
  const parts = url.split('/');
  const lastSegment = parts[parts.length - 1];
  const imageName = lastSegment.split('?')[0];
  return imageName;
}
