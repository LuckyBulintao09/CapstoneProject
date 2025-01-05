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

    const fileUploadPromises = files.map((file) => {
      const filePath = `${uuidFolder}/${file.name}`;
      return supabase.storage
        .from("card_content")
        .upload(filePath, file)
        .then(() => supabase.storage.from("card_content").getPublicUrl(filePath))
        .then(({ data }) => {
          if (data?.publicUrl) {
            fileUrls.push(data.publicUrl);
          }
        })
        .catch((error) => {
          throw new Error(`File upload failed: ${error.message}`);
        });
    });

    await Promise.all(fileUploadPromises);

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

    const { error: updateError } = await supabase
      .from("card") 
      .update({ updated_at: new Date() })
      .eq("id", parent_card_id);

    if (updateError) {
      throw new Error(`Failed to update parent card: ${updateError.message}`);
    }

    return newCardContent;
  } catch (error) {
    console.error("Error inserting card content:", error);
    throw error;
  }
};

