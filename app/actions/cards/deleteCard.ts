import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
const supabase = createClient();

export const deleteCard = async (id: string) => {
    extractImageName(id);
}

function extractImageName(url: string): string {
    const parts = url.split('/');
    const lastSegment = parts[parts.length - 1];
    const imageName = lastSegment.split('?')[0];
    toast.info(imageName);
    return imageName;
  }
  