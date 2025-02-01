"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Hint from "@/components/features/Hint";
import Model from "@/components/features/modal/modal";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { redirect, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Loader, Plus, Router } from "lucide-react";
import { useCreateTodoModal } from "@/components/features/todo/store/use-create-todo-modol";
import OnboardingPage from "@/components/features/onboarding/onboarding";
import { useUserById } from "@/utils/hooks/query-hooks/user/use-get-user-by-id";
import { useGetLoggedInUser } from "@/utils/hooks/query-hooks/user/use-get-logged-user";
import { useCreateOnboarding } from "@/components/features/onboarding/store/use-create-onboarding";
import { adminRoute } from "@/lib/routes";
import { useGetAdmin } from "@/utils/hooks/query-hooks/admin/use-get-admin";
import { useGetAdminToken } from "@/utils/hooks/query-hooks/admin/use-get-admin-token";
import toast from "react-hot-toast";

function SmsLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [_open, setOpen] = useCreateTodoModal();
  const { data: session } = useGetLoggedInUser();
  
  const [_open_board, setOpen_Board] = useCreateOnboarding();
  const { data: user, isLoading: user_loading } = useUserById(
    session?.user?.id as string
  );

  const {data : admin, isLoading : admin_loading } = useGetAdminToken();
  console.log("this is the admin  data: ",admin)
  
  const pathname = usePathname();
  const router = useRouter();
  
  const isOnboarded = useMemo(() => user?.user?.isOnBoarded, [user?.user]);
  const isAdmin = useMemo(()=> {
    if(user_loading ||admin_loading) return false;
    return (user?.user?.isAdmin && (!admin?.error))
  },[user?.user, admin?.data, user_loading, admin_loading]);
  useEffect(() => {
    if(user_loading || admin_loading)return;
    const isAdminRoute = adminRoute.some(route => pathname.includes(route)); // Check if the pathname includes any of the admin routes
    if(isAdminRoute && !isAdmin && user?.user?.isAdmin){
      toast.error("First login as admin")
      router.push("/sms/admin/admin-verification");
    }
    if (isAdminRoute && !user?.user?.isAdmin) {
      router.push("/sms/dashboard");
    }
  }, [pathname,user_loading, router, admin_loading, isAdmin]);

  useEffect(() => {
    if (user_loading ) return;
    if (!isOnboarded) {
      setOpen_Board(true);
    } else if (isOnboarded === true) {
      setOpen_Board(false);
    }
  }, [isOnboarded, setOpen_Board, user_loading, user?.user]);

  return (
    <div>
      <OnboardingPage onboardingOption={_open_board} />
      <SidebarProvider>
        <AppSidebar user={user?.user} user_loading={user_loading} isAdmin={!!isAdmin || false}/>
        <SidebarInset className="">
          <header className="flex  h-16 bg-gray-100 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 p-4">
            <Hint label={isOpen ? "collapse" : "expand"}>
              <SidebarTrigger
                className="-ml-1  "
                onClick={() => setIsOpen((prev) => !prev)}
              />
            </Hint>
            {pathname.includes("todo") && (
              <Breadcrumb className=" w-full flex justify-between px-3 ">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <div className="w-full flex justify-between px-2 py-1">
                      <span className=" text-[25px] font-bold">TODOS</span>
                    </div>
                  </BreadcrumbItem>
                </BreadcrumbList>
                <BreadcrumbList>
                  <BreadcrumbLink>
                    <Button onClick={() => setOpen(true)}>
                      New <Plus />
                    </Button>
                  </BreadcrumbLink>
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </header>
          <Model />
          <>
            {user_loading ? (
              <div className=" h-full w-full flex justify-center items-center">
                <Loader className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {user?.user?.isVerified || ( isAdmin) ? (
                  <div className="w-full h-full over-f">{children}</div>
                ) : (
                  <div className="w-full h-full flex justify-center items-center">
                    Wait till being verified
                  </div>
                )}
              </>
            )}
          </>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default SmsLayout;
