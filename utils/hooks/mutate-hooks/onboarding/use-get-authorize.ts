import { authorize_user } from "@/actions/onboarding/onboarding";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useAuthorizeUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authorize_user,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get_unverified_user'] })
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}