"use client"

import { cn } from "@/lib/utils"
import { type IconType } from "react-icons/lib"
import {  ChevronRight, type LucideIcon  } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"


export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon | IconType
  }[],
}) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <SidebarGroup>
    <SidebarGroupLabel>Features : </SidebarGroupLabel>
    <SidebarMenu>
      {items.map((item) => (
        
          <SidebarMenuItem
            key={item.title}
          >
              <SidebarMenuButton 
                tooltip={item.title} 
                className={cn(pathname.includes(item.url) && "bg-gray-200/80")}
                onClick={()=>{
                  router.push(`/sms/${item.url}`)
                }}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
      ))}
    </SidebarMenu>
  </SidebarGroup>
  )
}
