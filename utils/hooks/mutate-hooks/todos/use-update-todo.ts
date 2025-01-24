import { bulk_update, update_todo } from "@/actions/todo/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: update_todo,
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get_todos_by_id'] })
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}