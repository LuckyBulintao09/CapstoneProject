"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { handleResetPassword } from "@/actions/user/sendMagicLink";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (secondsRemaining === 0) {
      setIsResendDisabled(false);
    }

    if (isResendDisabled && secondsRemaining > 0) {
      const timer = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [secondsRemaining, isResendDisabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await handleResetPassword(email); 
      toast.success(`Password reset link sent to: ${email}`);
      setHasSubmitted(true);
      setIsResendDisabled(true); 
      setSecondsRemaining(120); 
    } catch (error) {
      toast.error(error.message || "An error occurred while sending the password reset email.");
    } finally {
      setIsLoading(false); 
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsLoading(true); 
      await handleResetPassword(email); 
      toast.success("A new magic link has been sent to your email.");
      setSecondsRemaining(120); 
      setIsResendDisabled(true); 
    } catch (error) {
      toast.error(error.message || "An error occurred while sending the password reset email.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-10 m-5">
      <div className="w-full max-w-md border p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Forgot Password
        </h2>
        <p className=" text-center mb-6">
          Enter your email address to receive a one-time login link. You can then reset your password in the profile section.
        </p>

        {!hasSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" >Email</label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 w-full"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Submit"}
            </Button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Please check your email for the password reset link.</p>
            <Button
              type="button"
              onClick={handleResendOTP}
              disabled={isResendDisabled}
              className={`w-full py-2 px-4 ${isResendDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white'} rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500`}
            >
              Resend Magic Link {isResendDisabled && `(${secondsRemaining}s)`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
