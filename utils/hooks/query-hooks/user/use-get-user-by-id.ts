import { get_user_by_id } from "@/actions/users/users";
import { useQuery } from "@tanstack/react-query";

export  const fetchUserById = async(userId : string) =>{
    const response = await get_user_by_id(userId);
    return {
        message : response?.message,
        user : JSON.parse(response?.user as string)
    }
}


export const useUserById  = (userId : string) =>{
    return useQuery({
        queryKey : ["get_user_by_id"],
        queryFn : () => fetchUserById(userId),
    })
}