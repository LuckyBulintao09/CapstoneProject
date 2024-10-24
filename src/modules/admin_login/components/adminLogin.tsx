"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import React, { useState } from "react";
import { EyeFilledIcon } from "@/modules/admin_login/components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/modules/admin_login/components/EyeSlashFilledIcon";
import { Button } from "@nextui-org/react";
import spiels from "@/lib/constants/spiels";
import { login } from "./actions";

const AdminLogin = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { success, error } = await login({ email, password });
    if (!success) {
      setError(error || "An error occurred.");
    } else {
      setError(null);
    }
  };

  return (
    <section className="h-screen flex justify-center items-center">
      <Card
        className="border-none bg-background/20 dark:bg-default-100/50 w-[500px] p-4"
        shadow="sm"
      >
        <CardHeader className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold">Admin Sign In</h1>
          <p>Enter your email and password</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              isClearable
              type="email"
              label="Email"
              variant="bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              required
            />
            <Input
              label="Password"
              variant="bordered"
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400" />
                  )}
                </button>
              }
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-gradient-to-tr from-blue-500 to-teal-500 text-white shadow-lg"
            >
              {spiels.BUTTON_LOGIN}
            </Button>
          </form>
        </CardBody>
      </Card>
    </section>
  );
};

export default AdminLogin;
