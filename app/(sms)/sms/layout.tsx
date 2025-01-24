"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Hint from "@/components/features/Hint";
import Model from "@/components/features/modal/modal";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCreateTodoModal } from "@/components/features/todo/store/use-create-todo-modol";

function SmsLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [_open, setOpen] = useCreateTodoModal();

  const pathname = usePathname();

  return (
    <>
      <SidebarProvider >
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
  );
}

export default SmsLayout;
