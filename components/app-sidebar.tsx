"use client"

import * as React from "react"
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import {
  BookOpen,
  GalleryVerticalEnd,
  LayoutDashboardIcon,
  ListTodo,
  Settings2,
  UserRoundCheck,
  Users,
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
import { useGetLoggedInUser } from "@/utils/hooks/query-hooks/use-get-logged-user"
import { Separator } from "./ui/separator"

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
      url: "#",
      icon: BookOpen,
      
    },
    {
      title: "Attendance",
      url: "#",
      icon: UserRoundCheck,
      
    },
    {
      title: "Todo",
      url: "todo",
      icon: ListTodo,
      
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
   
  ],
 
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {data : session} = useGetLoggedInUser();
  
 const new_data = {...data, user : {
  name : session?.user?.name as string,
  email : session?.user?.email as string,
  avatar : session?.user?.image as string
 }}
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavMain items={data.navMain}  />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={new_data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
