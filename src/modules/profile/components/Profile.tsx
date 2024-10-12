import { PencilIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { createClient } from "../../../../utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

// Define the shape of profile data
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
  const [profileData, setProfileData] = useState<ProfileData | null>(null); // State to store profile data
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  const handlePencilClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
    }
  };

  const supabase = createClient();

  async function getProfile(id: string) {
    const { data, error } = await supabase
      .from("account")
      .select("*")
      .eq("id", id);

    if (error) {
      console.error("Error fetching profile:", error.message);
    } else {
      console.log("Profile data:", data);
      if (data && data.length > 0) {
        setProfileData(data[0]); // Store the fetched profile data
      } else {
        alert("No profile data found.");
      }
    }
    setLoading(false); // Set loading to false after fetching data
  }

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        await getProfile(data.session.user.id);
      } else {
        alert("Login to access this function");
        window.location.href = "/";
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>; 
  }

  return (
    <section className="w-full p-2">
      <div className="flex p-2 gap-4 h-[20%]">
        <div className="relative">
        <Avatar className="w-32 h-32">
          <AvatarImage src={profileData?.profile_url} />
          <AvatarFallback>
            {profileData?.firstname.charAt(0)}{profileData?.lastname.charAt(0)}
          </AvatarFallback>
        </Avatar>
          <button
            onClick={handlePencilClick}
            className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md hover:bg-gray-200 transition bg-white w-7"
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
            value="center"
            onPress={onOpen}
            className="flex items-center text-blue-600 underline hover:text-blue-800 bg-transparent"
          >
            <PencilIcon className="w-4 h-4 mr-1 " />
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
          <p className="text-base font-medium text-default-400">Address</p>
          <h4 className="text-lg font-medium">{profileData?.address}</h4>
        </div>
        <div>
          <p className="text-base font-medium text-default-400">Date of Birth</p>
          <h4 className="text-lg font-medium">{profileData?.dob}</h4>
        </div>
        <div>
          <p className="text-base font-medium text-default-400">Email</p>
          <h4 className="text-lg font-medium">{profileData?.email}</h4>
        </div>
      </div>
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Edit Profile</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-2">
                  <div>
                    <Input
                      key="inside"
                      type="text"
                      label="Full Name"
                      labelPlacement="outside"
                      placeholder={`${profileData?.firstname} ${profileData?.lastname}`}
                    />
                  </div>
                  <div>
                    <Input
                      key="inside"
                      type="number"
                      label="Contact Number"
                      labelPlacement="outside"
                      placeholder={profileData?.cp_number}
                    />
                  </div>
                  <div>
                    <Input
                      key="inside"
                      type="text"
                      label="Address"
                      labelPlacement="outside"
                      placeholder={profileData?.address}
                    />
                  </div>
                  <div>
                    <DatePicker
                      label="Birth Date"
                      labelPlacement="outside"
                      variant="flat"
                      showMonthAndYearPickers
                      value={profileData ? new Date(profileData.dob) : null}
                    />
                  </div>
                  <div>
                    <Input
                      key="inside"
                      type="email"
                      label="Email"
                      labelPlacement="outside"
                      placeholder={profileData?.email}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
};

export default ProfileSection;
