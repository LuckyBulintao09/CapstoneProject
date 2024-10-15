import React from 'react';

export const metadata = {
    title: 'Verify Your Email - Unihomes',
    description: 'Check your inbox for an email to confirm your account.',
  };
export default function Verify() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Check Your Email
        </h1>
        <p className="text-center text-gray-600 mb-4">
          We've sent a confirmation link to your email address. Please check your inbox and follow the instructions to verify your account.
        </p>
        
        <p className="text-center text-gray-600 mb-4">
          Didn’t receive the email? Make sure to check your spam or junk folder.
        </p>
        <p className="text-center text-gray-600 mb-4">
          If you're still having issues, contact our support team <u>@unihomes2024@gmail.com</u> for further assistance.
        </p>
      </div>
    </div>
  );
}
