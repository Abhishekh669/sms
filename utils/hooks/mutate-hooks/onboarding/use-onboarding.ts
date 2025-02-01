import { onboard_user } from "@/actions/onboarding/onboarding";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useOnboarding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: onboard_user,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get_user_by_id'] })
      queryClient.invalidateQueries({ queryKey: ['get_unverified_user'] })
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}