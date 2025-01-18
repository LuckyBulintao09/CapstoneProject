import { resetPasswordAction } from "@/app/actions/actions";
import { FormMessage, Message } from "@/app/componentsFromSupabase/ui/form-message";
import { SubmitButton } from "@/app/componentsFromSupabase/ui/submit-button";
import { Input } from "@/app/componentsFromSupabase/ui/input";
import { Label } from "@/app/componentsFromSupabase/ui/label";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex justify-center items-center min-h-screen">
      <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-medium text-center">Reset password</h1>
        <p className="text-sm text-foreground/60 text-center">
          Please enter your new password below.
        </p>
        <Label htmlFor="password">New password</Label>
        <Input
          type="password"
          name="password"
          placeholder="New password"
          required
        />
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          required
        />
        <SubmitButton formAction={resetPasswordAction}>
          Reset password
        </SubmitButton>
        <FormMessage message={searchParams} />
      </form>
    </div>
  );
}
