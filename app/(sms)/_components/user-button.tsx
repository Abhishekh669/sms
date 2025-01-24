"use client"
import { logout } from "@/actions/auth/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useGetLoggedInUser } from "@/utils/hooks/query-hooks/use-get-logged-user"



export const UserButton = () => {
    const {data : session} = useGetLoggedInUser();
    const handle_log_out = async() =>{
        await logout();
    }
    return (
        <DropdownMenu
            modal={false}
        >
            <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="size-10 hover:opacity-75 transition text-white rounded-full bg-blue-500">
                    <AvatarImage alt="img" src={session?.user?.image as string}/>
                    <AvatarFallback className="rounded-[5px] text-white">
                            {session?.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side='right' className="w-60 bg-black hover:bg-black text-black rounded-[5px]">
                <DropdownMenuItem className="bg-black hover:bg-black">
                    <Button
                        className="w-full "
                        onClick={handle_log_out}
                    >
                        Logout
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}