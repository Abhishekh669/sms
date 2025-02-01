"use client";
import { useGetAdminToken } from "@/utils/hooks/query-hooks/admin/use-get-admin-token";
import { useGetLoggedInUser } from "@/utils/hooks/query-hooks/user/use-get-logged-user";
import { useUserById } from "@/utils/hooks/query-hooks/user/use-get-user-by-id";
import { Loader } from "lucide-react";
import { redirect, usePathname } from "next/navigation";

function AdminMainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: admin_data, isLoading: token_loading } = useGetAdminToken();
  const { data: session } = useGetLoggedInUser();
  const { data: user, isLoading: user_loading } = useUserById(
    session?.user?.id as string
  );

  if (token_loading || user_loading) {
    return (
      <div className="min-h-screen h-full w-full flex justify-center items-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user?.user?.isAdmin) {
    return redirect("/sms/dashboard");
  }

  if (admin_data?.message && admin_data?.data) {
    if (pathname.includes("admin-verification")) {
      return redirect("/sms/dashboard");
    }
  }

  return <div className="w-full min-h-screen h-full">{children}</div>;
}

export default AdminMainLayout;
