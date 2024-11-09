import AuthHeading from "@/components/authentication/auth-heading";
import AuthLeft from "@/components/authentication/auth-left";
import AuthTop from "@/components/authentication/auth-top";
import RegisterForm from "@/components/authentication/regsiter-form";
import React from "react";

function RegisterPage() {
    return (
        <>
            <div className="container relative hidden h-screen flex-col items-center justify-center mx-auto airBnbMobile:grid airBnbDesktop:max-w-none airBnbDesktop:grid-cols-2 airBnbDesktop:px-0">
                {/* top */}
                <AuthTop />
                {/* left */}
                <AuthLeft />
                {/* right */}
                <div className="lg:p-8 px-3 mt-11">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[425px]">
                        {/* title */}
                        <AuthHeading
                            title={"Create a UniHomes Account"}
                            subtitle={
                                <p>
                                    Hello there! <span className="text-[16px]">👋</span> Please sign up to register & get started.{" "}
                                    <span className="text-[16px]">😊</span>
                                </p>
                            }
                        />
                        {/* form */}
                        <RegisterForm />
                    </div>
                </div>
            </div>
        </>
    );
}

export default RegisterPage;
