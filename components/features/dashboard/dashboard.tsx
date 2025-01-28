"use client"
import { useGetLoggedInUser } from "@/utils/hooks/query-hooks/user/use-get-logged-user"
export default function Dashboard() {
 
  const {data} = useGetLoggedInUser();
  return (
    
    <>
    this is dashbaord
    </>
  )
}
