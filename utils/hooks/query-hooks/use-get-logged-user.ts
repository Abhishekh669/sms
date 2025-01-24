import { get_logged_user } from "@/actions/users/users";
import { useQuery } from "@tanstack/react-query";

export  const fetchLoggedInUser = async() =>{
    const response = await get_logged_user();
    return response;
}

export const useGetLoggedInUser  = () =>{
    return useQuery({
        queryKey : ["get_logged_user"],
        queryFn : () => fetchLoggedInUser(),
    })
}