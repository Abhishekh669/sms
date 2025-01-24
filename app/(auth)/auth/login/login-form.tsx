"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { do_social_login } from "@/actions/auth/auth"
import { formSchema } from "@/schemas"



export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("data : ",values)
  }

  const handleSocialLogin = async (action: string) => {
      await do_social_login(action);
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8 flex flex-col gap-y-4">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">Login Form</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log in"
                )}
              </Button>
            </form>
          </Form>
           <div className="flex items-center w-full gap-x-2">
                      <Button
                        size={"lg"}
                        className="w-full"
                        variant={"outline"}
                        onClick={() => handleSocialLogin("google")}
                      >
                        <FcGoogle />
                      </Button>
                      <Button
                        size={"lg"}
                        className="w-full  "
                        variant={"outline"}
                        onClick={() => handleSocialLogin("github")}
                      >
                        <FaGithub />
                      </Button>
                    </div>
          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-purple-600 hover:text-purple-500">
              Forgot your password?
            </a>
          </div>
        </div>
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/auth/register" className="font-medium text-purple-600 hover:text-purple-500">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

