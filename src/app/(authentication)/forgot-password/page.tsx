"use client"

import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {resendOTP} from "@/app/(authentication)/forgot-password/actions"
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

export default function ForgotPasswordPage() {
  const form = useForm({
    defaultValues: {
      email: "",
    },
  })

  const [secondsRemaining, setSecondsRemaining] = useState(120) 
  const [isResendDisabled, setIsResendDisabled] = useState(false) 
  const [hasSubmitted, setHasSubmitted] = useState(false) 

  useEffect(() => {
    if (secondsRemaining === 0) return 
    if (isResendDisabled) {
      const timer = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1)
      }, 1000)

      return () => clearInterval(timer) 
    }
  }, [secondsRemaining, isResendDisabled])

  const handleResendOTP = () => {
    toast({
      title: "OTP Sent",
      description: "A new OTP has been sent to your email.",
    })

    setSecondsRemaining(120)
    setIsResendDisabled(true)
  }

  function onSubmit(data: { email: string }) {
    toast({
      title: "You submitted the following email:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })

    //  backend for magic link generation 


    setHasSubmitted(true)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Forgot Password</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormItem>
              <FormLabel htmlFor="email" className="text-gray-700">Email</FormLabel>
              <FormControl>
                <Input 
                  id="email"
                  placeholder="Enter your email" 
                  {...form.register("email")} 
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 w-full" 
                />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
            <Button 
              type="submit" 
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Submit
            </Button>
          </form>
        </Form>

        {/* Resend OTP Section */}
        {hasSubmitted && (
          <div className="mt-6 text-center">
            <Button 
              type="button" 
              onClick={handleResendOTP} 
              disabled={isResendDisabled} 
              className={`w-full py-2 px-4 ${isResendDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white'} rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500`}
            >
              Resend OTP {isResendDisabled && `(${secondsRemaining}s)`}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
