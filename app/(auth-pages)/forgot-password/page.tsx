import { forgotPasswordAction } from "@/app/actions/actions";
import { FormMessage, Message } from "@/app/componentsFromSupabase/ui/form-message";
import { SubmitButton } from "@/app/componentsFromSupabase/ui/submit-button";
import { Input } from "@/app/componentsFromSupabase/ui/input";
import { Label } from "@/app/componentsFromSupabase/ui/label";
import Link from "next/link";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  return (
    <>
      <form className="flex flex-col w-full max-w-md mx-auto gap-6 p-6 text-foreground border rounded-md shadow-sm bg-background mt-20 m-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-center">Reset Password</h1>
          <p className="text-sm text-secondary-foreground text-center">
            Already have an account?{" "}
            <Link className="text-primary underline" href="/sign-in">
              Sign in
            </Link>
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              placeholder="you@example.com"
              required
              className="px-4 py-2"
            />
          </div>

          <SubmitButton formAction={forgotPasswordAction}>
            Reset Password
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
