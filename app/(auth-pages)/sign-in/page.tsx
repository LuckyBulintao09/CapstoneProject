import { signInAction } from "@/app/actions/actions";
import { FormMessage, Message } from "@/app/componentsFromSupabase/ui/form-message";
import { SubmitButton } from "@/app/componentsFromSupabase/ui/submit-button";
import { Input } from "@/app/componentsFromSupabase/ui/input";
import { Label } from "@/app/componentsFromSupabase/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-50 m-4">
      <form className="flex flex-col min-w-[400px] max-w-lg p-10 bg-white shadow-2xl rounded-xl">
        <h1 className="text-3xl font-semibold mb-3">Sign in</h1>
        <p className="text-sm text-foreground mb-3">
          Don't have an account?{" "}
          <Link className="text-foreground font-medium underline" href="/sign-up">
            Sign up
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link
              className="text-xs text-foreground underline"
              href="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
          />
          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Sign in
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
