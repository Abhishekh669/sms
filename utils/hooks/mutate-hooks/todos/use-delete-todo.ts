
import { delete_todo } from "@/actions/todo/todo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: delete_todo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get_todos_by_id'] })
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}