import { auth } from '@/auth'
import { redirect } from 'next/navigation'

async function page() {
const session = await auth();
if(!session?.user) return redirect("/auth/login")
 return redirect("/sms/dashboard")
}
export default page
