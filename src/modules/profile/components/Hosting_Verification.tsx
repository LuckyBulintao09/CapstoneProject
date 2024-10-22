"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import spiels from "@/lib/constants/spiels";
import { createClient } from "../../../utils/supabase/client";
import { Toaster, toast } from "sonner";

const HostingVerification: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [govIdUrl, setGovIdUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const supabase = createClient();

  useEffect(() => {
    const getUserSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        toast.error("Error fetching session: " + error.message);
        return;
      }
      const user = data?.session?.user;
      if (user) {
        setUserId(user.id);
        await fetchGovId(user.id);
      } else {
        toast.error("No user session found. Please log in.");
      }
    };

    const fetchGovId = async (userId: string) => {
      const { data, error } = await supabase
        .from("account")
        .select("government_ID_url, approved_government")
        .eq("id", userId)
        .single();

      if (error) {
        toast.error("Error fetching government ID: " + error.message);
        return;
      }

      if (data?.government_ID_url) setGovIdUrl(data.government_ID_url);
      if (data?.approved_government) setIsApproved(data.approved_government);
    };

    getUserSession();
  }, [supabase]);

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleSubmit = async () => {
    const file = files[0];
    if (!file || !userId) {
      toast.error("No file selected or user ID not available.");
      return;
    }

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `government-id-${Date.now()}.${fileExt}`;
      const filePath = `government ID/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("unihomes image storage")
        .upload(filePath, file);

      if (uploadError) {
        toast.error(`Failed to upload government ID: ${uploadError.message}`);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("unihomes image storage")
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        toast.error("Failed to retrieve public URL for the uploaded file.");
        return;
      }

      const publicUrl = publicUrlData.publicUrl;
      setGovIdUrl(publicUrl);

      const { error: updateError } = await supabase
        .from("account")
        .update({ government_ID_url: publicUrl })
        .eq("id", userId);

      if (updateError) {
        toast.error(
          `Failed to update government ID URL: ${updateError.message}`
        );
      } else {
        toast.success("Government ID uploaded");
      }
    } catch {
      toast.error("An unexpected error occurred during file upload.");
    }
  };

  return (
    <section className="w-full p-4">
      <Toaster position="top-right" richColors />
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-3xl">Hosting Verification</h1>
        <p>
          Please upload necessary documents to verify yourself as a host. Ensure
          your photos aren’t blurry and the front of your driver’s license
          clearly shows your face.
        </p>
        <div className="flex flex-col md:flex-row-reverse gap-2">
          <Card className="lg:w-1/4 border-none">
            <CardHeader>
              <CardTitle>Your Privacy</CardTitle>
              <CardDescription>
                We prioritize keeping your data private, safe, and secure. Learn
                more in our Privacy Policy.
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="flex flex-col lg:w-3/4 mt-5 gap-5">
            <div>
              <Label className="font-bold text-lg">Government ID</Label>
              <div className="mt-2">
                {isApproved ? (
                  <div className="text-green-700 p-4 rounded-md">
                    <p className="font-bold">Success</p>
                    <p>
                      Your government ID has been verified and approved. You can
                      now proceed with your listings.
                    </p>
                  </div>
                ) : govIdUrl ? (
                  <div className="text-yellow-700 p-4 rounded-md">
                    <p className="font-bold">Waiting for verification</p>
                    <p>
                      Your document has been uploaded. We are verifying your
                      identity.
                    </p>
                  </div>
                ) : (
                  "You’ll need to upload an official government ID. You can provide a driver’s license, passport, or national identity card, depending on your country. This is required to publish your listing(s)."
                )}
              </div>
              {!govIdUrl && (
                <div className="flex justify-center md:w-1/2 lg:w-[205px]">
                  <FileUpload onChange={handleFileChange} />
                </div>
              )}
            </div>
            {!govIdUrl && (
              <Button
                className="w-full md:w-[48%] lg:w-[30%] xl:w-[25%] bg-black text-white hover:bg-gray-800"
                onClick={handleSubmit}
              >
                {spiels.BUTTON_SEND_REQUEST}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HostingVerification;
