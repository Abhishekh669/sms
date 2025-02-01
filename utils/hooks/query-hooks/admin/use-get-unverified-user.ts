import { fetch_unverified_user} from "@/actions/admin/admin";
import { useQuery } from "@tanstack/react-query";

export  const fetchUnverifiedUser = async() =>{
    const response = await fetch_unverified_user();
    return {
        message : response.message,
        result : JSON.parse(response.result as string)
    };
}

export const useGetUnverifiedUser  = () =>{
    return useQuery({
        queryKey : ["get_unverified_user"],
        queryFn : () => fetchUnverifiedUser(),
    })
}