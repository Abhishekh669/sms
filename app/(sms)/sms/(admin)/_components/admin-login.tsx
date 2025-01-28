"use client"

import {  useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { formSchema } from "@/schemas"
import { useGetAdmin } from "@/utils/hooks/query-hooks/admin/use-get-admin"
import { useCreateAdmin } from "@/utils/hooks/mutate-hooks/admin/use-create-admin"
import toast from "react-hot-toast"
import {  useRouter } from "next/navigation"



export default function AdminLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {data : admin_data, isLoading : admin_loading} = useGetAdmin();
  const {mutate : create_admin} = useCreateAdmin();
  


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })



  async function onSubmit(values: z.infer<typeof formSchema>) {
  
    setIsLoading(true);
    try {
      const create = admin_data?.all_admin == 0 ? true : false;
      console.log(create)
      if(create){
        create_admin(values,{
          onSuccess : (res) =>{
            if(res.message && res.admin){
              toast.success("Created successfully")
            }
            else{
              toast.error(res.error)
            }
          },

          onError : () => {
            toast.error("Failed to create")
          }
        })
      }else{
          axios.post("http://localhost:3000/api/admin-login/",values)
          .then((res)=>{
             if(res.data.message== "logged in success" && res.data.success == true){
              toast.success("logged in successfully");
              router.push("/sms/admin/dashboard")
             }else{
              toast.error("Failed to login")
             }
          })
      }
      
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }
  if(admin_loading){
    return (
      <div className="min-h-screen h-full w-full flex justify-center items-center">
      <Loader className="size-5 animate-spin text-muted-foreground"/>
  </div>
    )
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8 flex flex-col gap-y-4">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">Login </h2>
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
                className="w-full mt-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
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
        </div>
        
      </div>
    </div>
  )
}

