import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const supabase = createClient();

export const getUserSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      toast.error(`Error fetching session: ${error.message}`);
      return null;
    }
    return data?.session?.user || null;
  } catch {
    toast.error("Unexpected error while fetching user session.");
    return null;
  }
};

export const fetchGovId = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("account")
      .select("government_ID_url, approved_government")
      .eq("id", userId)
      .single();

    if (error) {
      toast.error(`Error fetching government ID: ${error.message}`);
      return null;
    }

    return {
      governmentIdUrl: data?.government_ID_url,
      isApproved: data?.approved_government,
    };
  } catch {
    toast.error("Unexpected error while fetching government ID.");
    return null;
  }
};

export const uploadGovernmentId = async (file: File, userId: string) => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `government-id-${Date.now()}.${fileExt}`;
    const filePath = `government ID/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("unihomes image storage")
      .upload(filePath, file);

    if (uploadError) {
      toast.error(`Failed to upload government ID: ${uploadError.message}`);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("unihomes image storage")
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      toast.error("Failed to retrieve public URL for the uploaded file.");
      return null;
    }

    const { error: updateError } = await supabase
      .from("account")
      .update({ government_ID_url: publicUrlData.publicUrl })
      .eq("id", userId);

    if (updateError) {
      toast.error(`Failed to update government ID URL: ${updateError.message}`);
      return null;
    }

    return publicUrlData.publicUrl;
  } catch {
    toast.error("Unexpected error during file upload.");
    return null;
  }
};

export const cancelVerification = async (
  userId: string,
  govIdUrl: string | null
) => {
  try {
    const { error: deleteError } = await supabase
      .from("account")
      .update({ government_ID_url: null })
      .eq("id", userId);

    if (deleteError) {
      toast.error(`Failed to delete government ID: ${deleteError.message}`);
      return false;
    }

    if (govIdUrl) {
      const fileName = govIdUrl.split("/").pop();
      if (fileName) {
        await supabase.storage
          .from("unihomes image storage")
          .remove([`government ID/${fileName}`]);
      }
    }

    return true;
  } catch {
    toast.error("Unexpected error during cancellation.");
    return false;
  }
};
