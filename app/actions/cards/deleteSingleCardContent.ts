import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
const supabase = createClient();

export const deleteSingleCardContent = async (id: string) => {
  // Fetch data to get the files associated with the card content
  const { data, error } = await supabase
    .from("card_content")
    .select("id, files") 
    .eq("id", id);

  if (error) {
    toast.error("Failed to fetch card files.");
    console.error("Error fetching card files:", error.message);
    return null;
  }

  // Log the fetched data for debugging
  // toast.info(`Fetched card content data: ${JSON.stringify(data)}`);
  // console.log(`Fetched card content data: ${JSON.stringify(data)}`);

  // Delete associated files if any
  await Promise.all(
    data?.map(async (content) => {
      if (content.files && Array.isArray(content.files)) {
        await Promise.all(
          content.files.map(async (fileUrl) => {
            const imageName = extractImageName(fileUrl); 
            console.log(`Card ID: ${content.id} | File URL extracted name: ${imageName}`);
            await deleteFile(content.id, imageName); // Delete each file from storage
          })
        );
      } else {
        console.log(`Card ID: ${content.id} | No files found.`);
      }
    })
  );

  //  delete the card content itself from the database
  const { data: deletedData, error: deleteError } = await supabase
    .from("card_content")
    .delete()
    .eq("id", id);

  if (deleteError) {
    toast.error("Failed to delete card content.");
    console.error("Error deleting card content:", deleteError.message);
    return null;
  }

  toast.success("Card content and associated files deleted successfully.");
  return deletedData;
};

async function deleteFile(id: string, imageName: string) {
  // Delete the file from Supabase Storage
  const { error } = await supabase.storage.from("card_content").remove([`${id}/${imageName}`]);

  if (error) {
    toast.error(`Failed to delete file: ${imageName}`);
    console.error("Error deleting file:", error.message);
  } else {
    toast.success(`File ${imageName} deleted successfully.`);
  }
}

function extractImageName(url: string): string {
  const parts = url.split('/');
  const lastSegment = parts[parts.length - 1];
  const imageName = lastSegment.split('?')[0]; 
  return imageName;
}
