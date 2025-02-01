"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Loader, UserPlus } from "lucide-react";
import { OnboardingRequestCard, UserType } from "./authorize-user";
import { useGetUnverifiedUser } from "@/utils/hooks/query-hooks/admin/use-get-unverified-user";
import { useAuthorizeUser } from "@/utils/hooks/mutate-hooks/onboarding/use-get-authorize";
import toast from "react-hot-toast";
import { useRejectUser } from "@/utils/hooks/mutate-hooks/onboarding/use-reject-aut";

export default function AuthorizePage() {
  const { data: unverified_users, isLoading: unverified_users_loading } =
    useGetUnverifiedUser();
  const { mutate: authorize_user } = useAuthorizeUser();
  const { mutate: reject_user } = useRejectUser();

  const [requests, setRequests] = useState(unverified_users?.result); //fetch all the unverified students and teachers
  const [filteredRequest, setFilteredRequests] = useState(requests);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (unverified_users_loading) return;
    if (unverified_users?.result) setRequests(unverified_users?.result);
  }, [unverified_users?.result, unverified_users_loading]);

  useEffect(() => {
    if (unverified_users_loading) return;
    const filtered = requests.filter(
      (request: UserType) =>
        request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRequests(filtered);
  }, [searchTerm, requests]);

  useEffect(() => {
    if (unverified_users_loading) return;
    if (unverified_users?.result) setRequests(unverified_users?.result);
  }, [unverified_users?.result, unverified_users_loading]);

  const handleAccept = async ({ id, role }: { id: string; role: string }) => {
    if (id && role) {
      authorize_user(
        { id, role },
        {
          onSuccess: (res) => {
            if (res.message && res.result) {
              toast.success(res.message);
            } else if (res.error) {
              toast.error(res.error);
            }
          },
          onError: (err) => {
            toast.error(err);
          },
        }
      );
    }
  };

  const handleReject = async (id: string) => {
    if (id) {
      reject_user(id, {
        onSuccess: (res) => {
          if (res.message && res.result) {
            toast.success(res.message);
          } else if (res.error) {
            toast.error(res.error);
          }
        },
        onError: (err) => {
          toast.error(err);
        },
      });
    }
  };
  if (unverified_users_loading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader className="size-5 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Authorize Requests</h1>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4 " />
          {requests?.length > 0 && (
            <div className=" absolute -top-2 -right-1 size-4 bg-red-600 rounded-full flex items-center justify-center text-white">
              {requests?.length}
            </div>
          )}
        </Button>
      </div>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRequest?.map((request: UserType) => (
          <OnboardingRequestCard
            key={request.id}
            request={request}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        ))}
      </div>
      {filteredRequest?.length === 0 && (
        <div className="text-center mt-16">
          <UserPlus className="mx-auto h-16 w-16 text-blue-500" />
          <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
            No onboarding requests found
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            New requests will appear here when available.
          </p>
        </div>
      )}
    </div>
  );
}
