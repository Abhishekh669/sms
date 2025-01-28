"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Hint from "@/components/features/Hint";
import Model from "@/components/features/modal/modal";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React, { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { useGetLoggedInUser } from "@/utils/hooks/query-hooks/user/use-get-logged-user";
import { useUserById } from "@/utils/hooks/query-hooks/user/use-get-user-by-id";
import { Loader, Plus,  } from "lucide-react";
import { redirect, usePathname,  } from "next/navigation";
import { useCreateTodoModal } from "@/components/features/todo/store/use-create-todo-modol";
import { Button } from "@/components/ui/button";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [_open, setOpen] = useCreateTodoModal();

  const pathname = usePathname();
  const { data: session, isLoading: session_loading } = useGetLoggedInUser();
  const { data: user, isLoading: user_loading } = useUserById(
    session?.user?.id as string
  );
  

  if (session_loading || user_loading) {
    return (
      <div className="min-h-screen h-full w-full flex justify-center items-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (user?.user?.isAdmin) {
    return (
      <div className="min-h-screen h-full w-full">
        <>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="">
              <header className="flex h-16 bg-gray-100 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 p-4">
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
              {children}
            </SidebarInset>
          </SidebarProvider>
        </>
      </div>
    );
  } else {
    return redirect("/sms/dashboard");
  }
};

export default AdminLayout;
