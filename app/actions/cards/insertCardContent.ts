import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";
const supabase = createClient();

export const insertCardContent = async (
  parent_card_id: string,
  subject: string,
  content: string,
  files: File[]
) => {
  try {
    const uuidFolder = uuidv4(); 
    const fileUrls: string[] = [];

    for (const file of files) {
      const filePath = `${uuidFolder}/${file.name}`; 
      const { data, error } = await supabase.storage
        .from("card_content")
        .upload(filePath, file);

      if (error) {
        throw new Error(`File upload failed: ${error.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from("card_content")
        .getPublicUrl(filePath);

      if (publicUrlData) {
        fileUrls.push(publicUrlData.publicUrl);
      }
    }

    const { data: newCardContent, error: insertError } = await supabase
      .from("card_content")
      .insert({
        parent_card: parent_card_id,
        subject,
        content,
        files: fileUrls,
      })
      .select();

    if (insertError) {
      throw new Error(`Database insertion failed: ${insertError.message}`);
    }

    return newCardContent;
  } catch (error) {
    console.error("Error inserting card content:", error);
    throw error;
  }
};
