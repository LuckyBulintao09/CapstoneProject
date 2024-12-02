"use server";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";



export const getUserSession = async () => {
  const supabase = createClient();
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
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("account")
      .select(
        "government_ID_url, approved_government, rejected_government, decline_reason"
      )
      .eq("id", userId)
      .single();

    if (error) {
      toast.error(`Error fetching government ID: ${error.message}`);
      return null;
    }

    return {
      governmentIdUrl: data?.government_ID_url || null,
      isApproved: data?.approved_government || false,
      isRejected: data?.rejected_government || false,
      declineReason: data?.decline_reason || null,
    };
  } catch {
    toast.error("Unexpected error while fetching government ID.");
    return null;
  }
};

export const uploadGovernmentId = async (file: File, userId: string) => {
  const supabase = createClient();
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
      .update({
        government_ID_url: publicUrlData.publicUrl,
        rejected_government: false, 
        decline_reason: null, 
      })
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
      .update({
        government_ID_url: null,
        rejected_government: false, 
        decline_reason: null, 
      })
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
