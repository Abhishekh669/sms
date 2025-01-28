import { get_all_admin } from "@/actions/admin/admin";
import { get_logged_user } from "@/actions/users/users";
import { useQuery } from "@tanstack/react-query";

export  const fetchAdmin = async() =>{
    const response = await get_all_admin();
    return response;
}

export const useGetAdmin  = () =>{
    return useQuery({
        queryKey : ["get_admin"],
        queryFn : () => fetchAdmin(),
    })
}