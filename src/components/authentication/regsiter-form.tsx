"use client";

import React from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "@/lib/schemas/authSchema";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

function RegisterForm() {
    const queryString = typeof window !== "undefined" ? window?.location.search : "";
    const urlSearchParams = new URLSearchParams(queryString);
    const redirectedFrom = urlSearchParams.get("redirectedFrom");
    const router = useRouter()

    const [isPending, startTransition] = React.useTransition();
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    const registerForm = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirm_password: "",
        },
        mode: "onSubmit",
    });

    function onSubmit(values: RegisterFormData) {
        console.log(values);
    };
    
    return (
        <div className="grid w-full gap-6">
            <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onSubmit)}>
                    {" "}
                    {/* change back after onSubmit={loginForm.handleSubmit(onSubmit)} */}
                    <div className="grid gap-2">
                        <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-0 grid grid-cols-3 place-items-baseline gap-2">
                                    <FormLabel htmlFor="email" className="col-span-1 text-right w-full">
                                        Email:
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="email"
                                            placeholder="example@email.com"
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            autoCorrect="off"
                                            className="col-span-2"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={registerForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="space-y-0 grid grid-cols-3 place-items-baseline gap-2">
                                    <FormLabel htmlFor="password" className="col-span-1 text-right w-full">
                                        Password:
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative col-span-2 w-full">
                                            <Input
                                                id="password"
                                                type={`${showPassword ? "text" : "password"}`}
                                                placeholder="•••••••••"
                                                autoComplete="on"
                                                className=""
                                                {...field}
                                            />
                                            <div
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute top-1/2 right-2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group select-none"
                                            >
                                                {showPassword ? (
                                                    <EyeClosedIcon className="group-hover:scale-105 transition-all" />
                                                ) : (
                                                    <EyeOpenIcon className="group-hover:scale-105 transition-all" />
                                                )}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={registerForm.control}
                            name="confirm_password"
                            render={({ field }) => (
                                <FormItem className="space-y-0 grid grid-cols-3 place-items-baseline gap-2">
                                    <FormLabel htmlFor="confirm_password" className="col-span-1 text-right w-full">
                                        Confirm password:
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="confirm_password"
                                            type={`${showPassword ? "text" : "password"}`}
                                            placeholder="•••••••••"
                                            autoComplete="on"
                                            className="col-span-2"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending && (
                                <svg
                                    aria-hidden="true"
                                    className="size-6 mr-2 fill-accent animate-spin-fade dark:text-accent-foreground text-primary"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                            )}{" "}
                            Register
                        </Button>
                    </div>
                </form>
            </Form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>
            <Button variant="outline" type="button" className="w-full" disabled={isPending}>
                {isPending ? (
                    <svg
                        aria-hidden="true"
                        className="size-6 mr-2 text-accent animate-spin-fade dark:text-accent-foreground fill-primary"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                ) : (
                    <Image
                        src="/google-icon-logo.svg"
                        alt="google icon"
                        width="64"
                        height="64"
                        className="size-5 object-fit bg-center mr-2"
                        priority
                    />
                )}{" "}
                Google
            </Button>
            <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href={redirectedFrom ? `/login?redirectedFrom=${redirectedFrom}` : "/login"} className="underline">
                    Sign in
                </Link>
            </div>
        </div>
    );
}

export default RegisterForm;
