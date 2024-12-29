import { signInAction } from "@/app/actions/actions";
import { FormMessage, Message } from "@/app/componentsFromSupabase/ui/form-message";
import { SubmitButton } from "@/app/componentsFromSupabase/ui/submit-button";
import { Input } from "@/app/componentsFromSupabase/ui/input";
import { Label } from "@/app/componentsFromSupabase/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Section */}
      <div className="hidden md:flex w-full md:w-1/3 lg:w-1/2 bg-blue-900 dark:bg-blue-900 text-white flex-col justify-center p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center md:text-left">SGODOSS</h1>
        <p className="text-base md:text-lg leading-6 text-center md:text-left">
        SGODOSS is a centralized web platform designed to enhance resource access and improve coordination between personels,
         addressing the challenges of limited access to essential resources. It provides a hub for accessing information,
          offers search tools for finding resources on various topics, 
        and allows users to view announcements from SDO Ifugao, improving efficiency and communication within the organization.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center w-full md:w-2/3 lg:w-1/2 p-4 md:p-8">
        <form className="flex flex-col w-full max-w-[400px] p-0 bg-transparent">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-3 text-center">Login to SGODOSS</h1>
          <p className="text-sm text-gray-500 mb-4 text-center">
            Only admins are allowed beyond this point.
          </p>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                placeholder="example@email.com"
                required
                className="mt-1"
              />
            </div>
            <div>
 
              <Input
                type="password"
                name="password"
                placeholder="Your password"
                required
                className="mt-1"
              />
            </div>
          </div>
          <SubmitButton
            pendingText="Signing In..."
            formAction={signInAction}
            className="mt-5 bg-blue-800 hover:bg-blue-700"
          >
            Login
          </SubmitButton>
          <div className="text-red-500">
          <FormMessage message={searchParams} />
        </div>

          <br />
                <Link
                  className="text-sm text-blue-500 hover:underline"
                  
                  href="/forgot-password"
                >
                  Forgot Password?
                </Link>
        </form>
      </div>
    </div>
  );
}
