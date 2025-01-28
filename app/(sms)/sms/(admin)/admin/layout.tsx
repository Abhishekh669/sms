"use client";
import { useGetAdminToken } from "@/utils/hooks/query-hooks/admin/use-get-admin-token";
import { Loader } from "lucide-react";
import { redirect, usePathname } from "next/navigation";

function AdminMainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const {data : admin_data, isLoading: token_loading} = useGetAdminToken();
    if(admin_data?.error){
        return redirect("/sms/admin/admin-verification");
    }
    if(admin_data?.data && admin_data?.message){
        if(pathname.includes("/admin/admin-verification")){
            return redirect("/sms/admin/dashboard")
        }
    }
    console.log("this is the admin data :: ",admin_data?.message);
    if(token_loading){
        return (
            <div className="min-h-screen h-full w-full flex justify-center items-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        )
    }
  return <div className="w-full min-h-screen h-full">{children}</div>;
}

export default AdminMainLayout;
