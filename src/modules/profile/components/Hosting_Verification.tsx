import { useState, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@nextui-org/react";
import { UserIcon } from "@heroicons/react/24/solid";
import spiels from "@/lib/constants/spiels";
import {
  getUserSession,
  fetchGovId,
  uploadGovernmentId,
  cancelVerification,
} from "@/actions/hosting/hosting";

const HostingVerification: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [govIdUrl, setGovIdUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isRejected, setIsRejected] = useState<boolean>(false);
  const [declineReason, setDeclineReason] = useState<string | null>(null);
  const [fileWarning, setFileWarning] = useState<string | null>(null);

  const [prevState, setPrevState] = useState<{
    govIdUrl: string | null;
    isApproved: boolean;
    isRejected: boolean;
    declineReason: string | null;
  } | null>(null);

  const fetchVerificationData = async () => {
    const user = await getUserSession();
    if (!user) return;

    setUserId(user.id);

    const govIdData = await fetchGovId(user.id);
    if (!govIdData) return;

    const formattedData = {
      govIdUrl: govIdData.governmentIdUrl || null,
      isApproved: govIdData.isApproved || false,
      isRejected: govIdData.isRejected || false,
      declineReason: govIdData.declineReason || null,
    };

    const hasChanged =
      formattedData.govIdUrl !== prevState?.govIdUrl ||
      formattedData.isApproved !== prevState?.isApproved ||
      formattedData.isRejected !== prevState?.isRejected ||
      formattedData.declineReason !== prevState?.declineReason;

    if (hasChanged) {
      setGovIdUrl(formattedData.govIdUrl);
      setIsApproved(formattedData.isApproved);
      setIsRejected(formattedData.isRejected);
      setDeclineReason(formattedData.declineReason);
      setPrevState(formattedData);
    }
  };

  useEffect(() => {
    fetchVerificationData();

    const interval = setInterval(() => {
      fetchVerificationData();
    }, 10000);

    return () => clearInterval(interval);
  }, [prevState]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files ? event.target.files[0] : null;
    setFile(newFile);
    setFileWarning(newFile ? null : "Please upload a file to proceed.");
  };

  const handleSubmit = async () => {
    if (!file || !userId) {
      setFileWarning("Please upload a file to proceed.");
      return;
    }

    const publicUrl = await uploadGovernmentId(file, userId);
    if (publicUrl) {
      setGovIdUrl(publicUrl);
      setIsRejected(false);
      setDeclineReason(null);
    }
  };

  const handleCancelVerification = async () => {
    if (!userId) return;

    const success = await cancelVerification(userId, govIdUrl);
    if (success) {
      setGovIdUrl(null);
      setIsApproved(false);
      setIsRejected(false);
      setDeclineReason(null);
    }
  };

  return (
    <section className="w-full p-4">
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-3xl">Hosting Verification</h1>
        <p>
          Please upload necessary documents to verify yourself as a host. Ensure
          your photos aren’t blurry and the front of your driver’s license
          clearly shows your face.{" "}
          <strong>
            Only one upload is allowed, so please upload the front of your ID.
          </strong>
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
              <div className="mt-4">
                {isApproved ? (
                  <div className="text-green-700 p-4 rounded-md">
                    <p className="font-bold">Success</p>
                    <p>
                      Your government ID has been verified and approved. You can
                      now proceed with your listings.
                    </p>
                  </div>
                ) : isRejected ? (
                  <div className="text-red-700 p-4 rounded-md">
                    <p className="font-bold">Rejected</p>
                    <p>
                      Your document has been rejected. Please upload a valid ID
                      again for verification.
                    </p>
                    {declineReason && (
                      <p className="text-sm mt-2">
                        <strong>Reason:</strong> {declineReason}
                      </p>
                    )}
                    <div className="flex flex-col justify-center mt-6">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input-class"
                      />
                      {fileWarning && (
                        <p className="text-red-600 mt-2 text-sm">
                          {fileWarning}
                        </p>
                      )}
                      <Button
                        className="w-full md:w-[48%] lg:w-[30%] xl:w-[25%] bg-black text-white hover:bg-gray-800 mt-2"
                        onClick={handleSubmit}
                      >
                        {spiels.BUTTON_SEND_REQUEST}
                      </Button>
                    </div>
                  </div>
                ) : govIdUrl ? (
                  <div className="text-yellow-700 p-4 rounded-md">
                    <p className="font-bold">Waiting for verification</p>
                    <p>
                      Your document has been uploaded. We are verifying your
                      identity.
                    </p>
                    <Button
                      color="danger"
                      variant="bordered"
                      startContent={<UserIcon />}
                      onClick={handleCancelVerification}
                      className="mt-4"
                    >
                      Cancel Verification
                    </Button>
                  </div>
                ) : (
                  <p>
                    You’ll need to upload an official government ID. This is
                    required to publish your listing(s).
                  </p>
                )}
              </div>
              {!govIdUrl && !isRejected && (
                <div className="flex flex-col justify-center md:w-1/2 lg:w-[205px] mt-6">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input-class"
                  />
                  {fileWarning && (
                    <p className="text-red-600 mt-2 text-sm">{fileWarning}</p>
                  )}
                </div>
              )}
            </div>
            {!govIdUrl && !isRejected && (
              <Button
                className="w-full md:w-[48%] lg:w-[30%] xl:w-[25%] bg-black text-white hover:bg-gray-800 mt-2"
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
