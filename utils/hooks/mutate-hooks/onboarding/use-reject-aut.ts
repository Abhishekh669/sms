import { reject_user } from "@/actions/onboarding/onboarding";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useRejectUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reject_user,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get_unverified_user'] })
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}