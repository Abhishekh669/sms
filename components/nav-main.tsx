"use client";

import { cn } from "@/lib/utils";
import { type IconType } from "react-icons/lib";
import { type LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useGetUnverifiedUser } from "@/utils/hooks/query-hooks/admin/use-get-unverified-user";
import Hint from "./features/Hint";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon | IconType;
    isAdmin?: boolean;
  }[];
}) {
  const { data: users } = useGetUnverifiedUser();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Features : </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem
            key={item.title}
            className={cn(
              "flex relative items-center pr-2 rounded-md  ",
              pathname.includes(item.url) && "bg-gray-200/80"
            )}
          >
            <SidebarMenuButton
              tooltip={item.title}
              onClick={() => {
                router.push(`/sms/${item.url}`);
              }}
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
            <div>
              {users?.result.length > 0 && item.url === "authorize" && (
                <Hint label={`${users?.result?.length} unverified users`}>
                  <span className="size-4 rounded-sm p-0.5 bg-rose-500 text-white cursor-pointer">{users?.result.length}</span>

                </Hint>
              )}
            </div>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
