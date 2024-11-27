import { PencilIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { createClient } from "../../../utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  DatePicker,
} from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { parseDate } from "@internationalized/date";
import LoadingPage from "@/components/LoadingPage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { handleResetPassword } from "@/actions/user/updatePassword";
import { handleDeleteAccount } from "@/actions/user/deleteAccount";
import { logout } from "@/app/auth/login/actions";

interface ProfileData {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  cp_number: string;
  dob: string;
  profile_url: string;
}

const ProfileSection = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [editProfileData, setEditProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const supabase = createClient();
  const [confirmationInput, setConfirmationInput] = useState<string>("");

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        await getProfile(data.session.user.id);
      } else {
        toast.error("Login first to access this function!");
        window.location.href = "/";
      }
    };
    checkSession();
  }, []);

  const getProfile = async (id: string) => {
    const { data, error } = await supabase
      .from("account")
      .select("*")
      .eq("id", id);

    if (data && data.length > 0) {
      setProfileData(data[0]);
      setEditProfileData(data[0]);
    } else if (error) {
      toast.error("No profile data found.");
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProfileData((prevData) =>
      prevData ? { ...prevData, [name]: value } : prevData
    );
  };

  const handleConfirmationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationInput(e.target.value);
  };

  const handleDeleteAccountConfirm = async () => {
    if (confirmationInput === `${profileData?.firstname} ${profileData?.lastname}`) {
      try {
        await handleDeleteAccount(profileData?.id); 
        toast.success("Account deleted successfully!");
        await logout();
      } catch (error) {
        toast.error("Failed to delete account: " + error.message);
      }
    } else {
      toast.error("Please enter the correct confirmation text.");
    }
  };

  const handleSaveProfile = async () => {
    if (editProfileData) {
      const { id, firstname, lastname, address, cp_number, dob } =
        editProfileData;

      const { error: updateProfileError } = await supabase
        .from("account")
        .update({ firstname, lastname, address, cp_number, dob })
        .eq("id", id);

      if (!updateProfileError) {
        const { error: updateAuthError } = await supabase.auth.updateUser({
          data: { firstname, lastname },
        });

        if (!updateAuthError) {
          toast.success("Profile updated successfully!");
          setProfileData(editProfileData);
          onOpenChange(false);
        } else {
          toast.error(`Failed to update auth metadata: ${updateAuthError.message}`);
        }
      } else {
        toast.error(`Failed to update profile: ${updateProfileError.message}`);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && profileData) {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${profileData.id}-${Date.now()}.${fileExt}`;
        const filePath = `profile images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("unihomes image storage")
          .upload(filePath, file);

        if (uploadError) {
          toast.error(`Failed to upload image: ${uploadError.message}`);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("unihomes image storage")
          .getPublicUrl(filePath);

        if (!publicUrlData?.publicUrl) {
          toast.error("Failed to get public URL for the uploaded image.");
          return;
        }

        const publicUrl = publicUrlData.publicUrl;

        const { error: updateError } = await supabase
          .from("account")
          .update({ profile_url: publicUrl })
          .eq("id", profileData.id);

        if (updateError) {
          toast.error(`Failed to update profile URL: ${updateError.message}`);
          return;
        }

        setProfileData((prevData) =>
          prevData ? { ...prevData, profile_url: publicUrl } : prevData
        );

        toast.success("Profile image updated successfully!");
      } catch (error) {
        toast.error("An unexpected error occurred during profile image upload.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingPage />
      </div>
    );
  }

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetLoading(true);

    const result = await handleResetPassword(newPassword, confirmPassword);

    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      setNewPassword("");
      setConfirmPassword("");
      toast.success(result.success);
      setIsResetPasswordOpen(false);
    }

    setIsResetLoading(false);
  };

  return (
    <>
      <section className="w-full p-2">
        <div className="flex p-2 gap-4 h-[20%]">
          <div className="relative">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profileData?.profile_url} />
              <AvatarFallback>
                {profileData?.firstname.charAt(0)}
                {profileData?.lastname.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md hover:bg-gray-200 transition w-7"
            >
              <PencilSquareIcon className="w-5 h-5 text-gray-600" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex items-center">
            <div className="flex flex-col">
              <h1 className="font-bold mb-1">{`${profileData?.firstname} ${profileData?.lastname}`}</h1>
              <p>{profileData?.address}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-4 mt-10">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Personal Details</h1>
            <Button
              onPress={onOpen}
              className="text-blue-600 underline hover:text-blue-800 bg-transparent"
            >
              <PencilIcon className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>

          <div>
            <p className="text-base font-medium text-default-400">Full Name</p>
            <h4 className="text-lg font-medium">{`${profileData?.firstname} ${profileData?.lastname}`}</h4>
          </div>
          <div>
            <p className="text-base font-medium text-default-400">Contact Number</p>
            <h4 className="text-lg font-medium">{profileData?.cp_number}</h4>
          </div>
          <div>
            <p className="text-base font-medium text-default-400">Email</p>
            <h4 className="text-lg font-medium">{profileData?.email}</h4>
          </div>
          <div>
            <p className="text-base font-medium text-default-400">Birthday</p>
            <h4 className="text-lg font-medium">{profileData?.dob}</h4>
          </div>
        </div>

        {/* Profile Edit Modal */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent className="sm:max-w-[425px]">
            <ModalHeader>
              <h1 className="font-bold">Edit Profile</h1>
            </ModalHeader>
            <ModalBody>
              <div>
                <Input
                  label="First Name"
                  name="firstname"
                  value={editProfileData?.firstname || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Input
                  label="Last Name"
                  name="lastname"
                  value={editProfileData?.lastname || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Input
                  label="Contact Number"
                  name="cp_number"
                  value={editProfileData?.cp_number || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Input
                  label="Address"
                  name="address"
                  value={editProfileData?.address || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Input
                  label="Date of Birth"
                  name="dob"
                  value={editProfileData?.dob || ""}
                  onChange={handleInputChange}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleSaveProfile}>Save</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Reset Password Modal */}
        <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
          <DialogTrigger asChild>
            <Button>Reset Password</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleResetPasswordSubmit}>
              <div className="py-4">
                <Input
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                />
              </div>
              <div className="py-4">
                <Input
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                />
              </div>
              <DialogFooter>
                <Button type="submit" isLoading={isResetLoading}>
                  Reset Password
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Account Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Delete Account</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                Be careful, this action cannot be undone. This will permanently
                delete your account and remove its data from our servers.
              </DialogDescription>
              <DialogDescription>
                Enter the words "{profileData?.firstname} {profileData?.lastname}" to proceed.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirmationInput" className="text-right">
                  Enter here:
                </Label>
                <Input
                  id="confirmationInput"
                  className="col-span-3"
                  value={confirmationInput}
                  onChange={handleConfirmationInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleDeleteAccountConfirm}>Delete Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </>
  );
};

export default ProfileSection;
