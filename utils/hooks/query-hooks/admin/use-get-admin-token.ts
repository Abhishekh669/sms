import { fetch_token } from "@/actions/admin/admin";
import { useQuery } from "@tanstack/react-query";

export  const fetchAdmin = async() =>{
    const response = await fetch_token();
    return response;
}

export const useGetAdminToken  = () =>{
    return useQuery({
        queryKey : ["get_admin_token"],
        queryFn : () => fetchAdmin(),
    })
}