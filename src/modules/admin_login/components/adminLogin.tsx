"use client";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import React from "react";
import { EyeFilledIcon } from "@/modules/admin_login/components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/modules/admin_login/components/EyeSlashFilledIcon";
import { Button } from "@nextui-org/react";
import spiels from "@/lib/constants/spiels";
const adminLogin = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <section className="h-screen  flex justify-center items-center">
      <Card
        isBlurred
        className="border-none bg-background/20 dark:bg-default-100/50 w-[500px] p-4"
        shadow="sm"
      >
        <CardHeader className="flex flex-col gap-3">
          <div className="w-full">
            <h1 className="text-3xl font-semibold">Admin Sign In</h1>
          </div>
          <div className="w-full">
            <p>Enter the email and password</p>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
            <Input
              isClearable
              type="email"
              label="Email"
              variant="bordered"
              defaultValue="junior@nextui.org"
              onClear={() => console.log("input cleared")}
            />
            <Input
              label="Password"
              variant="bordered"
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
            />
          </div>
        </CardBody>
        <CardFooter>
          <div className="flex flex-col w-full gap-4">
            <Button
              size="md"
              className="bg-gradient-to-tr from-blue-500 to-teal-500 text-white shadow-lg w-full"
            >
              {spiels.BUTTON_LOGIN}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
};

export default adminLogin;
