import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

export const insertCardContent = async (
  parent_card_id: string,
  subject: string,
  content: string,
  files: File[] // Multiple files
) => {
  try {
    const fileUrls: string[] = []; // Array to store file URLs

    // Insert the card content first to get its id
    const { data: newCardContent, error: insertError } = await supabase
      .from("card_content")
      .insert({
        parent_card: parent_card_id,
        subject,
        content,
        files: [] // Initialize files as an empty array first
      })
      .select()
      .single(); 

    if (insertError) {
      throw new Error(`Database insertion failed: ${insertError.message}`);
    }

    const cardContentId = newCardContent.id; 

    // Upload the files to the folder named after the new card_content id
    const fileUploadPromises = files.map((file) => {
      const filePath = `${cardContentId}/${file.name}`; 
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
    const { error: updateError } = await supabase
      .from("card_content")
      .update({
        files: fileUrls, // Update the files field with the URLs
      })
      .eq("id", cardContentId);

    if (updateError) {
      throw new Error(`Failed to update card_content with file URLs: ${updateError.message}`);
    }

    const { error: updateParentCardError } = await supabase
      .from("card")
      .update({ updated_at: new Date() })
      .eq("id", parent_card_id);

    if (updateParentCardError) {
      throw new Error(`Failed to update parent card: ${updateParentCardError.message}`);
    }

    return newCardContent; // Return the new card content with all files uploaded
  } catch (error) {
    console.error("Error inserting card content:", error);
    throw error;
  }
};
