"use client"

import * as React from "react"
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import {
  BookOpen,
  GalleryVerticalEnd,
  Key,
  LayoutDashboardIcon,
  ListTodo,
  Loader,
  Settings2,
  UserRoundCheck,
  Users,
  Users2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useGetLoggedInUser } from "@/utils/hooks/query-hooks/user/use-get-logged-user"
import { Separator } from "./ui/separator"
import { useUserById } from "@/utils/hooks/query-hooks/user/use-get-user-by-id";
import { User } from "@prisma/client";

const data = {
  teams: 
    {
      name: "SMS",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  navMain: [
    
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboardIcon,
      
    },
    {
      title: "Manage Users",
      url: "manage-users",
      icon: Users2,
      isAdmin : true
    },
    {
      title: "Teachers",
      url: "teachers",
      icon: LiaChalkboardTeacherSolid,
    },
    {
      title: "Students",
      url: "students",
      icon: Users,
      
    },
   
    {
      title: "Subjects",
      url: "subjects",
      icon: BookOpen,
      
    },
    {
      title: "Attendance",
      url: "attendance",
      icon: UserRoundCheck,
      
    },
    {
      title: "Todo",
      url: "todo",
      icon: ListTodo,
      
    },
    {
      title: "Authorize",
      url: "authorize",
      icon: Key,
      isAdmin : true,
      
    },
    {
      title: "Settings",
      url: "settings",
      icon: Settings2,
    },
   
  ],
 
}

export function AppSidebar({user, user_loading ,isAdmin, ...props }: React.ComponentProps<typeof Sidebar> & {user : User} & {user_loading : boolean} & {isAdmin : boolean}) {

  
  
  const new_data = {
    ...data,
    user: {
      name: user?.name as string,
      email: user?.email as string,
      avatar: user?.image as string,
    },
    navMain: data.navMain.filter((item) => {
      return !item.isAdmin || (item.isAdmin && user?.isAdmin && isAdmin);
    }),
  };

 
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        
        {user_loading ? (
           <div className=" h-full w-full flex justify-center items-center">
           <Loader className="size-5 animate-spin text-muted-foreground" />
         </div>
        ) : (
          <NavMain items={new_data.navMain} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={new_data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
