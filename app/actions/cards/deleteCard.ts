import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const supabase = createClient();

// Function to extract image name from URL
function extractImageName(url: string): string {
  const parts = url.split('/');
  const lastSegment = parts[parts.length - 1];
  const imageName = lastSegment.split('?')[0];
  toast.info(imageName);
  return imageName;
}

// Delete card and its associated files
export const deleteCard = async (parentId: string) => {
  const { data, error } = await supabase
    .from("card_content")
    .select("id, files") // Select both "id" and "files"
    .eq("parent_card", parentId);

  if (error) {
    toast.error("Failed to fetch card files.");
    console.error("Error fetching card files:", error.message);
    return null;
  }

  // Delete all associated files
  await Promise.all(
    data?.map(async (content) => {
      if (content.files && Array.isArray(content.files)) {
        await Promise.all(
          content.files.map(async (fileUrl) => {
            const imageName = extractImageName(fileUrl); // Get the image name
            console.log(`Card ID: ${content.id} | File URL extracted name: ${imageName}`);
            await deleteCardContent(content.id, imageName); // Delete each file
          })
        );
      } else {
        console.log(`Card ID: ${content.id} | No files found.`);
      }
    })
  );

  // Delete the main card
  await deleteMainCardContent(parentId);
  return data;
};


async function deleteCardContent(contentId: string, filename: string) {
  const { error } = await supabase
    .storage
    .from('card_content')
    .remove([`${contentId}/${filename}`]);

  if (error) {
    toast.error(`Failed to delete file ${filename}`);
    console.error(`Error deleting file ${filename}:`, error.message);
  } else {
    toast.success(`Successfully deleted file ${filename}`);
  }
}

// Delete the main card and its thumbnail
async function deleteMainCardContent(parentId: string) {
  // Delete thumbnail
  await deleteThumbnail(parentId);

  // Delete main card record
  const { error } = await supabase
    .from('card')
    .delete()
    .eq('id', parentId);

  if (error) {
    toast.error("Failed to delete card.");
    console.error("Error deleting card:", error.message);
  } else {
    toast.success("Card deleted successfully.");
  }
}

// Delete the thumbnail associated with the card
async function deleteThumbnail(id: string) {
  const filename = await getThumbnailFile(id);

  if (!filename) {
    console.error("Thumbnail filename not found.");
    return;
  }

  const { error } = await supabase
    .storage
    .from('thumbnails')
    .remove([`cards/${filename}`]);

  if (error) {
    console.error(`Error deleting thumbnail file: ${error.message}`);
  } else {
    console.log(`Successfully deleted thumbnail: ${filename}`);
  }
}


async function getThumbnailFile(id: string): Promise<string | undefined> {
  const { data, error } = await supabase
    .from("card")
    .select("thumbnail_url")
    .eq("id", id)
    .single();

  if (error) {
    toast.error("Failed to fetch thumbnail URL.");
    console.error("Error fetching thumbnail URL:", error.message);
    return undefined;
  }

  if (data?.thumbnail_url) {
    return extractImageName(data.thumbnail_url);
  } else {
    toast.error("Thumbnail URL not found.");
    return undefined;
  }
}
