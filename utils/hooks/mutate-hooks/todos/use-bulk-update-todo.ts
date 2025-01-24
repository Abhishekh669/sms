import { bulk_update } from "@/actions/todo/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useBulkUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulk_update,
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get_todos_by_id'] })
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}