import { get_todos_by_id } from "@/actions/todo/todo";
import { get_logged_user } from "@/actions/users/users";
import { useQuery } from "@tanstack/react-query";

export  const fetchTodosById = async() =>{
    const response = await get_todos_by_id();
    console.log(" i am called while creating ")
    return {
        message : response?.message ,
        todos : JSON.parse(response?.todos as string )


    }
}

export const useGetTodosById  = () =>{
    return useQuery({
        queryKey : ["get_todos_by_id"],
        queryFn : () => fetchTodosById(),
    })
}