import { get_student_by_id } from "@/actions/students/students";
import { useQuery } from "@tanstack/react-query";

export  const fetch_student_by_id = async() =>{
    const response = await get_student_by_id();
    return {
        message : response?.message,
        result : JSON.parse(response?.result as string)
    };
}

export const useGetStudentById  = () =>{
    return useQuery({
        queryKey : ["get_student_by_id"],
        queryFn : () => fetch_student_by_id(),
    })
}